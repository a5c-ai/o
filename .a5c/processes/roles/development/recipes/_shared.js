import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { buildBackendDevelop } from "../domains/backend.js";
import { buildFrontendDevelop } from "../domains/frontend.js";
import { buildSdkDevelop } from "../domains/sdk.js";
import { buildInfraDevelop } from "../domains/infra.js";
import { buildDataDevelop } from "../domains/data.js";
import { buildWorkersDevelop } from "../domains/workers.js";
import { buildIntegrationDevelop } from "../domains/integration.js";
import { buildPackageDevelop } from "../domains/package.js";

export const buildDevelopForDomain = (domain, opts = {}) => {
  const normalized = String(domain ?? "backend").toLowerCase();
  if (normalized === "frontend") return buildFrontendDevelop(opts);
  if (normalized === "sdk") return buildSdkDevelop(opts);
  if (normalized === "infra" || normalized === "infrastructure") return buildInfraDevelop(opts);
  if (normalized === "data") return buildDataDevelop(opts);
  if (normalized === "workers") return buildWorkersDevelop(opts);
  if (normalized === "integration") return buildIntegrationDevelop(opts);
  if (normalized === "package") return buildPackageDevelop(opts);
  return buildBackendDevelop(opts);
};

export const requireAct = (ctx = {}) => {
  const { act } = primitivesFrom(ctx);
  return requirePrimitive("act", act);
};

