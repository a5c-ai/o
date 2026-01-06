import { validateDevelopmentDomainSetup } from "./roles/development/validate.js";
import { domainRegistry } from "./roles/development/domains/registry.js";
import { packRegistry } from "./roles/development/domains/packs/registry.js";

import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const hasAnyFunctionExport = (mod) =>
  mod && typeof mod === "object" && Object.values(mod).some((v) => typeof v === "function");

const isPlainObject = (v) => v != null && typeof v === "object" && !Array.isArray(v);

const formatError = (err) => {
  if (err == null) return "Unknown error";
  if (typeof err === "string") return err;
  return err.stack ?? err.message ?? String(err);
};

const validatePostmortemFollowupsFixture = async () => {
  const fixturePath = fileURLToPath(
    new URL("../fixtures/unPostmortemFollowups.followups.items.example.json", import.meta.url)
  );
  const source = await readFile(fixturePath, "utf8");
  const data = JSON.parse(source);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Fixture must be a non-empty JSON array.");
  }

  for (const [idx, item] of data.entries()) {
    if (!isPlainObject(item)) throw new Error(`Item ${idx} must be a JSON object.`);
    const keys = Object.keys(item).sort();
    const expectedKeys = ["owner", "reason", "title"];
    if (keys.join(",") !== expectedKeys.join(",")) {
      throw new Error(`Item ${idx} must have exactly keys: ${expectedKeys.join(", ")}.`);
    }
    if (typeof item.title !== "string") throw new Error(`Item ${idx}.title must be a string.`);
    if (typeof item.reason !== "string") throw new Error(`Item ${idx}.reason must be a string.`);
    if (!(item.owner === null || typeof item.owner === "string")) {
      throw new Error(`Item ${idx}.owner must be a string or null.`);
    }
  }
};

export const validateA5cProcesses = async ({ throwOnError = false } = {}) => {
  const errors = [];
  const warnings = [];

  let development = null;
  try {
    development = validateDevelopmentDomainSetup();
  } catch (err) {
    errors.push({ code: "development_domain_setup", message: formatError(err) });
  }

  let roleRegistryKeyCount = 0;
  try {
    const rolesModule = await import("./roles/index.js");
    const roleRegistry = rolesModule?.roleRegistry;
    if (!roleRegistry || typeof roleRegistry !== "object") {
      errors.push({ code: "roles_registry_missing", message: "roles/index.js must export roleRegistry." });
    } else {
      const entries = Object.entries(roleRegistry);
      roleRegistryKeyCount = entries.length;
      const emptyRoles = entries
        .filter(([, mod]) => !hasAnyFunctionExport(mod))
        .map(([name]) => name)
        .sort();
      if (emptyRoles.length) {
        errors.push({
          code: "roles_registry_empty_role",
          message:
            "roleRegistry contains roles with no exported functions:\n" + emptyRoles.map((r) => `- ${r}`).join("\n"),
        });
      }
    }
  } catch (err) {
    errors.push({ code: "roles_import_failed", message: formatError(err) });
  }

  let loopFileCount = 0;
  try {
    const loopsDir = fileURLToPath(new URL("./core/loops/", import.meta.url));
    const loopFiles = (await readdir(loopsDir))
      .filter((f) => f.endsWith(".js"))
      .filter((f) => f !== "index.js")
      .filter((f) => !f.startsWith("_"))
      .sort();

    loopFileCount = loopFiles.length;

    const loopsIndexPath = fileURLToPath(new URL("./core/loops/index.js", import.meta.url));
    const loopsIndexSource = await readFile(loopsIndexPath, "utf8");
    const missingLoopExports = loopFiles.filter(
      (f) => !loopsIndexSource.includes(`"./${f}"`) && !loopsIndexSource.includes(`'./${f}'`)
    );
    if (missingLoopExports.length) {
      errors.push({
        code: "loops_index_missing_exports",
        message:
          "core/loops/index.js is missing exports for loop files:\n" +
          missingLoopExports.map((f) => `- .a5c/processes/core/loops/${f}`).join("\n"),
      });
    }

    const loopsIndexModule = await import("./core/loops/index.js");
    if (typeof loopsIndexModule?.runKanbanBacklogEating !== "function") {
      errors.push({
        code: "loops_missing_runKanbanBacklogEating",
        message: "core/loops/index.js must export runKanbanBacklogEating.",
      });
    }
    if (typeof loopsIndexModule?.runPostmortemFollowups !== "function") {
      errors.push({
        code: "loops_missing_runPostmortemFollowups",
        message: "core/loops/index.js must export runPostmortemFollowups.",
      });
    }

    const loopModulesWithoutFunctions = [];
    for (const file of loopFiles) {
      const mod = await import(new URL(`./core/loops/${file}`, import.meta.url));
      if (!hasAnyFunctionExport(mod)) loopModulesWithoutFunctions.push(file);
    }
    if (loopModulesWithoutFunctions.length) {
      warnings.push({
        code: "loops_file_no_functions",
        message:
          "Some loop files export no functions:\n" +
          loopModulesWithoutFunctions.map((f) => `- .a5c/processes/core/loops/${f}`).join("\n"),
      });
    }
  } catch (err) {
    errors.push({ code: "loops_validation_failed", message: formatError(err) });
  }

  try {
    await validatePostmortemFollowupsFixture();
  } catch (err) {
    errors.push({ code: "fixture_postmortem_followups_invalid", message: formatError(err) });
  }

  const result = {
    ok: errors.length === 0,
    errors,
    warnings,
    development,
    developmentDomainRegistryCount: Object.keys(domainRegistry).length,
    developmentPackRegistryCount: Object.keys(packRegistry).length,
    roleRegistryKeyCount,
    loopFileCount,
  };

  if (!result.ok && throwOnError) {
    throw new Error(
      "A5C processes validation failed:\n" + result.errors.map((e) => `- [${e.code}] ${e.message}`).join("\n")
    );
  }

  return result;
};
