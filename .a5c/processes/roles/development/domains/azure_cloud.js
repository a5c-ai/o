import { defaultDevelop } from "../../../core/primitives.js";
import { withSpec } from "../aspects/spec.js";
import { withOpsReview } from "../aspects/ops.js";
import { withSecurityReview } from "../aspects/security.js";
import { withDocs } from "../aspects/docs.js";
import { withQualityGate } from "../aspects/quality.js";
import { withDomainPlanning } from "../aspects/domain_planning.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildInfraQualityCriteria } from "./criteria.js";

export const buildAzureCloudDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  planning = {},
  spec = {},
  ops = {},
  security = {},
  docs = {},
  quality = { threshold: 0.9, maxIters: 5 },
} = {}) => {
  const planningOpt = normalizeFeature(planning, { checkpoint });
  const specOpt = normalizeFeature(spec, { checkpoint });
  const opsOpt = normalizeFeature(ops);
  const securityOpt = normalizeFeature(security);
  const docsOpt = normalizeFeature(docs);

  const enabled = {
    planning: planningOpt.enabled,
    spec: specOpt.enabled,
    ops: opsOpt.enabled,
    security: securityOpt.enabled,
    docs: docsOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.9,
    maxIters: 5,
    buildCriteria: (task, ctx) => buildInfraQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "azure_cloud", aspects: enabled }),
    planningOpt.enabled ? withDomainPlanning({ domain: "azure_cloud", checkpoint: planningOpt.checkpoint }) : null,
    specOpt.enabled ? withSpec(specOpt) : null,
    opsOpt.enabled ? withOpsReview(opsOpt) : null,
    securityOpt.enabled ? withSecurityReview(securityOpt) : null,
    docsOpt.enabled ? withDocs(docsOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};

