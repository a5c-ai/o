import { commonPlanningCriteria } from "./_shared_criteria.js";

import * as frontend from "./frontend.js";
import * as nextjs from "./nextjs_app.js";
import * as backend from "./backend.js";
import * as infra from "./infra.js";
import * as awsServerless from "./aws_serverless.js";
import * as kubernetes from "./kubernetes_service.js";
import * as gcpCloudRun from "./gcp_cloudrun.js";
import * as data from "./data.js";
import * as workers from "./workers.js";
import * as integration from "./integration.js";
import * as sdk from "./sdk.js";
import * as pkg from "./package.js";

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
  if (normalized === "next") return "nextjs_app";
  if (normalized === "nextjs") return "nextjs_app";
  if (normalized === "aws") return "aws_serverless";
  if (normalized === "k8s") return "kubernetes_service";
  if (normalized === "kubernetes") return "kubernetes_service";
  if (normalized === "cloudrun") return "gcp_cloudrun";
  if (normalized === "gcp") return "gcp_cloudrun";
  return normalized;
};

const packRegistry = {
  frontend,
  nextjs_app: nextjs,
  backend,
  infra,
  aws_serverless: awsServerless,
  kubernetes_service: kubernetes,
  gcp_cloudrun: gcpCloudRun,
  data,
  workers,
  integration,
  sdk,
  package: pkg,
};

export const getDomainPlanningPack = (domain) => {
  const normalized = normalizeDomainName(domain);
  return packRegistry[normalized] ?? packRegistry.backend;
};

export const getDomainCriteriaPack = (domain) => {
  const pack = getDomainPlanningPack(domain);
  const domainSpecific = typeof pack.criteriaPack === "function" ? pack.criteriaPack() : [];
  return [...commonPlanningCriteria, ...domainSpecific];
};
