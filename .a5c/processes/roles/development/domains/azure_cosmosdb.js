import { defaultDevelop } from "../../../core/primitives.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withOpsReview } from "../aspects/ops.js";
import { withSecurityReview } from "../aspects/security.js";
import { withPerformanceReview } from "../aspects/performance.js";
import { withDocs } from "../aspects/docs.js";
import { withQualityGate } from "../aspects/quality.js";
import { withDomainPlanning } from "../aspects/domain_planning.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildBackendQualityCriteria } from "./criteria.js";

export const buildAzureCosmosdbDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  planning = {},
  spec = {},
  tests = {},
  ops = {},
  security = {},
  performance = {},
  docs = {},
  quality = { threshold: 0.92, maxIters: 5 },
} = {}) => {
  const planningOpt = normalizeFeature(planning, { checkpoint });
  const specOpt = normalizeFeature(spec, { checkpoint });
  const testsOpt = normalizeFeature(tests, { checkpoint });
  const opsOpt = normalizeFeature(ops);
  const securityOpt = normalizeFeature(security);
  const performanceOpt = normalizeFeature(performance);
  const docsOpt = normalizeFeature(docs);

  const enabled = {
    planning: planningOpt.enabled,
    spec: specOpt.enabled,
    tests: testsOpt.enabled,
    ops: opsOpt.enabled,
    security: securityOpt.enabled,
    performance: performanceOpt.enabled,
    docs: docsOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.92,
    maxIters: 5,
    buildCriteria: (task, ctx) => buildBackendQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "azure_cosmosdb", aspects: enabled }),
    planningOpt.enabled ? withDomainPlanning({ domain: "azure_cosmosdb", checkpoint: planningOpt.checkpoint }) : null,
    specOpt.enabled ? withSpec(specOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    opsOpt.enabled ? withOpsReview(opsOpt) : null,
    securityOpt.enabled ? withSecurityReview(securityOpt) : null,
    performanceOpt.enabled ? withPerformanceReview(performanceOpt) : null,
    docsOpt.enabled ? withDocs(docsOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};

