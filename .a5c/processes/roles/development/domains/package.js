import { defaultDevelop } from "../../../core/primitives.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withDocs } from "../aspects/docs.js";
import { withGitHygiene } from "../aspects/git.js";
import { withQualityGate } from "../aspects/quality.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildPackageQualityCriteria } from "./criteria.js";

export const buildPackageDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  spec = {},
  tests = {},
  docs = {},
  git = {},
  quality = { threshold: 0.9, maxIters: 4 },
} = {}) => {
  const specOpt = normalizeFeature(spec, { checkpoint });
  const testsOpt = normalizeFeature(tests, { checkpoint });
  const docsOpt = normalizeFeature(docs);
  const gitOpt = normalizeFeature(git);

  const enabled = {
    spec: specOpt.enabled,
    tests: testsOpt.enabled,
    docs: docsOpt.enabled,
    git: gitOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.9,
    maxIters: 4,
    buildCriteria: (task, ctx) => buildPackageQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "package", aspects: enabled }),
    specOpt.enabled ? withSpec(specOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    docsOpt.enabled ? withDocs(docsOpt) : null,
    gitOpt.enabled ? withGitHygiene(gitOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};
