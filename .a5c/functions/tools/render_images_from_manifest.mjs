#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usage = () => {
  const text = `
Usage:
  node tools/render_images_from_manifest.mjs --manifest <path> [--assets-dir <path>] [--model <name>] [--endpoint <url> | --resource-name <name>] [--api-version <ver>] [--concurrency <n>] [--overwrite]

Env:
  AZURE_OPENAI_API_KEY        Required unless --api-key is provided (not recommended).
  AZURE_OPENAI_ENDPOINT       Optional (e.g. https://<resource>.openai.azure.com). If omitted, AZURE_OPENAI_PROJECT_NAME or AZURE_OPENAI_RESOURCE_NAME will be used.
  AZURE_OPENAI_PROJECT_NAME   Optional resource name (e.g. a5c-sw-resource)
  AZURE_OPENAI_RESOURCE_NAME  Optional resource name (e.g. a5c-sw-resource)

Notes:
  - Uses Azure OpenAI Images endpoint:
    - Azure: <endpoint>/openai/deployments/<deployment>/images/generations?api-version=...
    - Non-Azure: <endpoint>/openai/images/generations?api-version=...
  - Writes PNGs to assets-dir and updates the manifest slide status to "rendered".
  - If a slide is already "rendered" and the image exists, it is skipped unless --overwrite.
`;
  // eslint-disable-next-line no-console
  console.log(text.trim());
};

const parseArgs = (argv) => {
  const args = {
    manifest: null,
    assetsDir: null,
    model: "gpt-image-1.5",
    endpoint: process.env.AZURE_OPENAI_ENDPOINT ?? null,
    resourceName:
      process.env.AZURE_OPENAI_PROJECT_NAME ?? process.env.AZURE_OPENAI_RESOURCE_NAME ?? null,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2025-04-01-preview",
    apiKey: process.env.AZURE_OPENAI_API_KEY ?? null,
    concurrency: 2,
    overwrite: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
      continue;
    }
    if (a === "--manifest") args.manifest = argv[++i];
    else if (a === "--assets-dir") args.assetsDir = argv[++i];
    else if (a === "--model") args.model = argv[++i];
    else if (a === "--endpoint") args.endpoint = argv[++i];
    else if (a === "--resource-name") args.resourceName = argv[++i];
    else if (a === "--api-version") args.apiVersion = argv[++i];
    else if (a === "--api-key") args.apiKey = argv[++i];
    else if (a === "--concurrency") args.concurrency = Number(argv[++i] ?? "2");
    else if (a === "--overwrite") args.overwrite = true;
    else throw new Error(`Unknown arg: ${a}`);
  }
  return args;
};

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const fileExists = (p) => {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const normalizeEndpoint = (endpoint) => {
  if (!endpoint) return null;
  // Allow passing either https://<resource>.openai.azure.com OR https://<resource>.openai.azure.com/openai
  return endpoint.replace(/\/+$/, "").replace(/\/openai$/, "");
};

const endpointFromResourceName = (resourceName) => {
  const name = String(resourceName ?? "").trim();
  if (!name) return null;
  return `https://${name}.openai.azure.com`;
};

const pickSupportedSize = (requested) => {
  // OpenAI Images commonly supports: 1024x1024, 1024x1536, 1536x1024.
  // We map common deck size (1920x1080) to the closest landscape preset.
  const r = String(requested ?? "").trim();
  if (!r) return { api: "1536x1024", note: "defaulted" };
  if (r === "1536x1024" || r === "1024x1024" || r === "1024x1536") return { api: r, note: "exact" };
  if (r === "1920x1080") return { api: "1536x1024", note: "mapped_from_1920x1080" };
  if (r === "1080x1920") return { api: "1024x1536", note: "mapped_from_1080x1920" };
  return { api: "1536x1024", note: `mapped_from_${r}` };
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (url, init, { maxRetries = 3 } = {}) => {
  let lastErr = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        const err = new Error(`HTTP ${res.status}: ${txt.slice(0, 500)}`);
        err.status = res.status;
        throw err;
      }
      return res;
    } catch (e) {
      lastErr = e;
      const backoff = 500 * attempt * attempt;
      await sleep(backoff);
    }
  }
  throw lastErr;
};

const resolveAssetPath = (manifestPath, assetsDir, assetFile) => {
  const baseDir = path.dirname(manifestPath);
  const rel = assetFile?.replace(/\\/g, "/") ?? "";
  if (!rel) throw new Error("Missing slide.assetFile");

  if (assetsDir) {
    // assetFile is expected to be like assets/slide_01_problem.png; join under provided assetsDir
    const fileName = path.basename(rel);
    return path.resolve(assetsDir, fileName);
  }

  return path.resolve(baseDir, rel);
};

const writePromptSidecar = (assetsDir, assetFile, prompt) => {
  const fileName = path.basename(assetFile, path.extname(assetFile));
  const sidecar = path.join(assetsDir, `${fileName}.prompt.txt`);
  if (!fileExists(sidecar)) fs.writeFileSync(sidecar, String(prompt ?? ""), "utf8");
};

const decodeB64ToBuffer = (b64) => Buffer.from(b64, "base64");

const isAzureEndpoint = (endpoint) => {
  try {
    const { hostname } = new URL(endpoint);
    return hostname.endsWith(".openai.azure.com");
  } catch {
    return false;
  }
};

const generateOne = async ({
  endpoint,
  apiVersion,
  apiKey,
  model,
  prompt,
  size,
}) => {
  const azureStyle = isAzureEndpoint(endpoint);
  if (azureStyle && !model) throw new Error("Azure image generation requires a deployment/model name");

  const path = azureStyle
    ? `/openai/deployments/${encodeURIComponent(model)}/images/generations`
    : "/openai/images/generations";

  const url = `${endpoint}${path}?api-version=${encodeURIComponent(apiVersion)}`;
  const body = {
    prompt,
    size,
    n: 1,
  };

  if (!azureStyle) {
    body.model = model;
    body.response_format = "b64_json";
  }

  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  const data0 = json?.data?.[0];
  if (data0?.b64_json) return { b64: data0.b64_json, raw: json };
  if (data0?.url) {
    // Fallback: if the service returns a URL, fetch it.
    const imgRes = await fetchWithRetry(data0.url, { method: "GET" });
    const arr = new Uint8Array(await imgRes.arrayBuffer());
    return { bytes: Buffer.from(arr), raw: json };
  }
  throw new Error(`Unexpected images response shape: ${JSON.stringify(json).slice(0, 500)}`);
};

const run = async () => {
  const args = parseArgs(process.argv);
  if (args.help) return usage();
  if (!args.manifest) throw new Error("--manifest is required");
  if (!args.apiKey) throw new Error("Missing AZURE_OPENAI_API_KEY (or --api-key)");

  const endpoint = normalizeEndpoint(args.endpoint) ?? endpointFromResourceName(args.resourceName);
  if (!endpoint) {
    throw new Error(
      "Missing Azure OpenAI endpoint. Set AZURE_OPENAI_ENDPOINT, or set AZURE_OPENAI_PROJECT_NAME/AZURE_OPENAI_RESOURCE_NAME, or pass --endpoint/--resource-name."
    );
  }

  const manifestPath = path.resolve(process.cwd(), args.manifest);
  const manifestDir = path.dirname(manifestPath);
  const manifestRaw = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(manifestRaw);

  const slides = manifest?.slides ?? [];
  if (!Array.isArray(slides) || slides.length === 0) throw new Error("manifest.slides must be a non-empty array");

  const resolvedAssetsDir =
    args.assetsDir ? path.resolve(process.cwd(), args.assetsDir) : path.resolve(manifestDir, "assets");
  ensureDir(resolvedAssetsDir);

  // Ensure prompt sidecars exist even if we skip rendering.
  for (const slide of slides) {
    if (slide?.assetFile && slide?.prompt) writePromptSidecar(resolvedAssetsDir, slide.assetFile, slide.prompt);
  }

  const queue = slides.map((slide, idx) => ({ slide, idx }));
  let renderedCount = 0;
  let skippedCount = 0;

  const workers = new Array(Math.max(1, args.concurrency)).fill(null).map(async () => {
    for (;;) {
      const next = queue.shift();
      if (!next) return;
      const { slide, idx } = next;

      const assetFile = slide?.assetFile;
      const prompt = slide?.prompt;
      if (!assetFile || !prompt) continue;

      const assetPath = resolveAssetPath(manifestPath, resolvedAssetsDir, assetFile);

      const alreadyRendered = slide?.status === "rendered" && fileExists(assetPath);
      if (alreadyRendered && !args.overwrite) {
        skippedCount++;
        continue;
      }

      const { api: sizeApi, note: sizeNote } = pickSupportedSize(slide?.size);
      const result = await generateOne({
        endpoint,
        apiVersion: args.apiVersion,
        apiKey: args.apiKey,
        model: args.model,
        prompt,
        size: sizeApi,
      });

      const bytes = result.bytes ?? decodeB64ToBuffer(result.b64);
      ensureDir(path.dirname(assetPath));
      fs.writeFileSync(assetPath, bytes);

      slides[idx] = {
        ...slide,
        status: "rendered",
        renderedAtUtc: new Date().toISOString(),
        renderedWith: {
          provider: "azure_openai",
          model: args.model,
          apiVersion: args.apiVersion,
          endpoint,
        },
        renderedSize: sizeApi,
        renderedSizeNote: sizeNote,
      };
      renderedCount++;
    }
  });

  await Promise.all(workers);

  const updated = { ...manifest, slides };
  fs.writeFileSync(manifestPath, JSON.stringify(updated, null, 2) + "\n", "utf8");

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        ok: true,
        manifest: args.manifest,
        assetsDir: path.relative(process.cwd(), resolvedAssetsDir),
        rendered: renderedCount,
        skipped: skippedCount,
        model: args.model,
        endpoint,
        apiVersion: args.apiVersion,
      },
      null,
      2
    )
  );
};

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err?.stack ?? String(err));
  process.exitCode = 1;
});
