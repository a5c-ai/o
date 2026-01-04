import { defaultDevelop } from "../../../core/primitives.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withDocs } from "../aspects/docs.js";
import { withQualityGate } from "../aspects/quality.js";
import { withRefactorGuardrails } from "../aspects/refactor.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildSdkQualityCriteria } from "./criteria.js";

export const buildSdkDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  spec = {},
  tests = {},
  docs = {},
  refactor = {},
  quality = { threshold: 0.9, maxIters: 4 },
} = {}) => {
  const specOpt = normalizeFeature(spec, { checkpoint });
  const testsOpt = normalizeFeature(tests, { checkpoint });
  const refactorOpt = normalizeFeature(refactor);
  const docsOpt = normalizeFeature(docs);

  const enabled = {
    spec: specOpt.enabled,
    tests: testsOpt.enabled,
    refactor: refactorOpt.enabled,
    docs: docsOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.9,
    maxIters: 4,
    buildCriteria: (task, ctx) => buildSdkQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "sdk", aspects: enabled }),
    specOpt.enabled ? withSpec(specOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    refactorOpt.enabled ? withRefactorGuardrails(refactorOpt) : null,
    docsOpt.enabled ? withDocs(docsOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};
