import { defaultDevelop } from "../../../core/primitives.js";
import { withResearch } from "../aspects/research.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withQualityGate } from "../aspects/quality.js";
import { withDocs } from "../aspects/docs.js";
import { withSecurityReview } from "../aspects/security.js";
import { withOpsReview } from "../aspects/ops.js";
import { withErrorHandlingReview } from "../aspects/error_handling.js";
import { withPerformanceReview } from "../aspects/performance.js";
import { withDomainPlanning } from "../aspects/domain_planning.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildBackendQualityCriteria } from "./criteria.js";

export const buildGoServiceDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  planning = {},
  research = { mode: "auto" },
  spec = {},
  tests = {},
  security = {},
  ops = {},
  errorHandling = {},
  performance = {},
  docs = {},
  quality = { threshold: 0.92, maxIters: 5 },
} = {}) => {
  const planningOpt = normalizeFeature(planning, { checkpoint });
  const researchOpt = normalizeFeature(research, {
    mode: "auto",
    checkpointName: checkpoint ? "research" : "research_no_checkpoint",
  });
  const specOpt = normalizeFeature(spec, { checkpoint });
  const testsOpt = normalizeFeature(tests, { checkpoint });
  const securityOpt = normalizeFeature(security);
  const opsOpt = normalizeFeature(ops);
  const errorHandlingOpt = normalizeFeature(errorHandling);
  const performanceOpt = normalizeFeature(performance);
  const docsOpt = normalizeFeature(docs);

  const enabled = {
    planning: planningOpt.enabled,
    research: researchOpt.enabled,
    spec: specOpt.enabled,
    tests: testsOpt.enabled,
    security: securityOpt.enabled,
    ops: opsOpt.enabled,
    errorHandling: errorHandlingOpt.enabled,
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
    withDomainContext({ domain: "go_service", aspects: enabled }),
    planningOpt.enabled ? withDomainPlanning({ domain: "go_service", checkpoint: planningOpt.checkpoint }) : null,
    researchOpt.enabled ? withResearch(researchOpt) : null,
    specOpt.enabled ? withSpec(specOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    securityOpt.enabled ? withSecurityReview(securityOpt) : null,
    opsOpt.enabled ? withOpsReview(opsOpt) : null,
    errorHandlingOpt.enabled ? withErrorHandlingReview(errorHandlingOpt) : null,
    performanceOpt.enabled ? withPerformanceReview(performanceOpt) : null,
    docsOpt.enabled ? withDocs(docsOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};

