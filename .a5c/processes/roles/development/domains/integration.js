import { defaultDevelop } from "../../../core/primitives.js";
import { withResearch } from "../aspects/research.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withSecurityReview } from "../aspects/security.js";
import { withDocs } from "../aspects/docs.js";
import { withQualityGate } from "../aspects/quality.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildIntegrationQualityCriteria } from "./criteria.js";

export const buildIntegrationDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  research = { mode: "auto" },
  spec = {},
  tests = {},
  security = {},
  docs = {},
  quality = { threshold: 0.9, maxIters: 5 },
} = {}) => {
  const researchOpt = normalizeFeature(research, {
    mode: "auto",
    checkpointName: checkpoint ? "research" : "research_no_checkpoint",
  });
  const specOpt = normalizeFeature(spec, { checkpoint });
  const testsOpt = normalizeFeature(tests, { checkpoint });
  const securityOpt = normalizeFeature(security);
  const docsOpt = normalizeFeature(docs);

  const enabled = {
    research: researchOpt.enabled,
    spec: specOpt.enabled,
    tests: testsOpt.enabled,
    security: securityOpt.enabled,
    docs: docsOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.9,
    maxIters: 5,
    buildCriteria: (task, ctx) => buildIntegrationQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "integration", aspects: enabled }),
    researchOpt.enabled ? withResearch(researchOpt) : null,
    specOpt.enabled ? withSpec(specOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    securityOpt.enabled ? withSecurityReview(securityOpt) : null,
    docsOpt.enabled ? withDocs(docsOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};
