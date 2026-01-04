import { buildBackendDevelop } from "./backend.js";
import { buildFrontendDevelop } from "./frontend.js";
import { buildInfraDevelop } from "./infra.js";
import { buildDataDevelop } from "./data.js";
import { buildWorkersDevelop } from "./workers.js";
import { buildIntegrationDevelop } from "./integration.js";
import { buildSdkDevelop } from "./sdk.js";
import { buildPackageDevelop } from "./package.js";

export const normalizeDomainName = (domain) => {
  const normalized = String(domain ?? "backend").toLowerCase().trim();
  if (normalized === "ui") return "frontend";
  if (normalized === "fe") return "frontend";
  if (normalized === "be") return "backend";
  if (normalized === "infrastructure") return "infra";
  if (normalized === "platform") return "infra";
  if (normalized === "worker") return "workers";
  if (normalized === "jobs") return "workers";
  if (normalized === "pkg") return "package";
  return normalized;
};

export const domainRegistry = {
  backend: buildBackendDevelop,
  frontend: buildFrontendDevelop,
  infra: buildInfraDevelop,
  data: buildDataDevelop,
  workers: buildWorkersDevelop,
  integration: buildIntegrationDevelop,
  sdk: buildSdkDevelop,
  package: buildPackageDevelop,
};

export const buildDevelopForDomain = (domain, opts = {}) => {
  const normalized = normalizeDomainName(domain);
  const builder = domainRegistry[normalized] ?? domainRegistry.backend;
  return builder(opts);
};

