import { defaultDevelop } from "../../../core/primitives.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withOpsReview } from "../aspects/ops.js";
import { withErrorHandlingReview } from "../aspects/error_handling.js";
import { withQualityGate } from "../aspects/quality.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildWorkersQualityCriteria } from "./criteria.js";

export const buildWorkersDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  spec = {},
  tests = {},
  ops = {},
  errorHandling = {},
  quality = { threshold: 0.9, maxIters: 5 },
} = {}) => {
  const specOpt = normalizeFeature(spec, { checkpoint });
  const testsOpt = normalizeFeature(tests, { checkpoint });
  const opsOpt = normalizeFeature(ops);
  const errorHandlingOpt = normalizeFeature(errorHandling);

  const enabled = {
    spec: specOpt.enabled,
    tests: testsOpt.enabled,
    ops: opsOpt.enabled,
    errorHandling: errorHandlingOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.9,
    maxIters: 5,
    buildCriteria: (task, ctx) => buildWorkersQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "workers", aspects: enabled }),
    specOpt.enabled ? withSpec(specOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    opsOpt.enabled ? withOpsReview(opsOpt) : null,
    errorHandlingOpt.enabled ? withErrorHandlingReview(errorHandlingOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};
