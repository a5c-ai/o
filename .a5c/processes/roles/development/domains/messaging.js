import { defaultDevelop } from "../../../core/primitives.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withOpsReview } from "../aspects/ops.js";
import { withSecurityReview } from "../aspects/security.js";
import { withErrorHandlingReview } from "../aspects/error_handling.js";
import { withDocs } from "../aspects/docs.js";
import { withQualityGate } from "../aspects/quality.js";
import { withDomainPlanning } from "../aspects/domain_planning.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildIntegrationQualityCriteria } from "./criteria.js";

export const buildMessagingDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  planning = {},
  spec = {},
  tests = {},
  ops = {},
  security = {},
  errorHandling = {},
  docs = {},
  quality = { threshold: 0.92, maxIters: 5 },
} = {}) => {
  const planningOpt = normalizeFeature(planning, { checkpoint });
  const specOpt = normalizeFeature(spec, { checkpoint });
  const testsOpt = normalizeFeature(tests, { checkpoint });
  const opsOpt = normalizeFeature(ops);
  const securityOpt = normalizeFeature(security);
  const errorHandlingOpt = normalizeFeature(errorHandling);
  const docsOpt = normalizeFeature(docs);

  const enabled = {
    planning: planningOpt.enabled,
    spec: specOpt.enabled,
    tests: testsOpt.enabled,
    ops: opsOpt.enabled,
    security: securityOpt.enabled,
    errorHandling: errorHandlingOpt.enabled,
    docs: docsOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.92,
    maxIters: 5,
    buildCriteria: (task, ctx) => buildIntegrationQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "messaging", aspects: enabled }),
    planningOpt.enabled ? withDomainPlanning({ domain: "messaging", checkpoint: planningOpt.checkpoint }) : null,
    specOpt.enabled ? withSpec(specOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    opsOpt.enabled ? withOpsReview(opsOpt) : null,
    securityOpt.enabled ? withSecurityReview(securityOpt) : null,
    errorHandlingOpt.enabled ? withErrorHandlingReview(errorHandlingOpt) : null,
    docsOpt.enabled ? withDocs(docsOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};

