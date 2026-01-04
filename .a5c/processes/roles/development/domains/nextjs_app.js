import { defaultDevelop } from "../../../core/primitives.js";
import { withResearch } from "../aspects/research.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withQualityGate } from "../aspects/quality.js";
import { withDocs } from "../aspects/docs.js";
import { withPerformanceReview } from "../aspects/performance.js";
import { withDomainPlanning } from "../aspects/domain_planning.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildFrontendQualityCriteria } from "./criteria.js";

export const buildNextjsAppDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  planning = {},
  research = { mode: "auto" },
  spec = {},
  tests = {},
  performance = {},
  docs = {},
  quality = { threshold: 0.9, maxIters: 4 },
} = {}) => {
  const planningOpt = normalizeFeature(planning, { checkpoint });
  const researchOpt = normalizeFeature(research, {
    mode: "auto",
    checkpointName: checkpoint ? "research" : "research_no_checkpoint",
  });
  const specOpt = normalizeFeature(spec, { checkpoint });
  const testsOpt = normalizeFeature(tests, { checkpoint });
  const performanceOpt = normalizeFeature(performance);
  const docsOpt = normalizeFeature(docs);

  const enabled = {
    planning: planningOpt.enabled,
    research: researchOpt.enabled,
    spec: specOpt.enabled,
    tests: testsOpt.enabled,
    performance: performanceOpt.enabled,
    docs: docsOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.9,
    maxIters: 4,
    buildCriteria: (task, ctx) => buildFrontendQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "nextjs_app", aspects: enabled }),
    planningOpt.enabled ? withDomainPlanning({ domain: "nextjs_app", checkpoint: planningOpt.checkpoint }) : null,
    researchOpt.enabled ? withResearch(researchOpt) : null,
    specOpt.enabled ? withSpec(specOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    performanceOpt.enabled ? withPerformanceReview(performanceOpt) : null,
    docsOpt.enabled ? withDocs(docsOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};

