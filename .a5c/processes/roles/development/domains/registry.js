import { buildBackendDevelop } from "./backend.js";
import { buildFrontendDevelop } from "./frontend.js";
import { buildNextjsAppDevelop } from "./nextjs_app.js";
import { buildInfraDevelop } from "./infra.js";
import { buildAwsServerlessDevelop } from "./aws_serverless.js";
import { buildKubernetesServiceDevelop } from "./kubernetes_service.js";
import { buildGcpCloudRunDevelop } from "./gcp_cloudrun.js";
import { buildDataDevelop } from "./data.js";
import { buildWorkersDevelop } from "./workers.js";
import { buildIntegrationDevelop } from "./integration.js";
import { buildSdkDevelop } from "./sdk.js";
import { buildPackageDevelop } from "./package.js";

export const normalizeDomainName = (domain) => {
  const normalized = String(domain ?? "backend").toLowerCase().trim();
  if (normalized === "ui") return "frontend";
  if (normalized === "fe") return "frontend";
  if (normalized === "next") return "nextjs_app";
  if (normalized === "nextjs") return "nextjs_app";
  if (normalized === "be") return "backend";
  if (normalized === "infrastructure") return "infra";
  if (normalized === "platform") return "infra";
  if (normalized === "aws") return "aws_serverless";
  if (normalized === "k8s") return "kubernetes_service";
  if (normalized === "kubernetes") return "kubernetes_service";
  if (normalized === "gcp") return "gcp_cloudrun";
  if (normalized === "cloudrun") return "gcp_cloudrun";
  if (normalized === "worker") return "workers";
  if (normalized === "jobs") return "workers";
  if (normalized === "pkg") return "package";
  return normalized;
};

export const domainRegistry = {
  backend: buildBackendDevelop,
  frontend: buildFrontendDevelop,
  nextjs_app: buildNextjsAppDevelop,
  infra: buildInfraDevelop,
  aws_serverless: buildAwsServerlessDevelop,
  kubernetes_service: buildKubernetesServiceDevelop,
  gcp_cloudrun: buildGcpCloudRunDevelop,
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
