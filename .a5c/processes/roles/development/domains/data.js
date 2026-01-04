import { defaultDevelop } from "../../../core/primitives.js";
import { withResearch } from "../aspects/research.js";
import { withSpec } from "../aspects/spec.js";
import { withDataDrivenWork } from "../aspects/data_driven.js";
import { withTests } from "../aspects/tests.js";
import { withQualityGate } from "../aspects/quality.js";
import { withDomainPlanning } from "../aspects/domain_planning.js";
import { applyOptionalMiddlewares, normalizeFeature, normalizeQuality, withDomainContext } from "./_domain_utils.js";
import { buildDataQualityCriteria } from "./criteria.js";

export const buildDataDevelop = ({
  baseDevelop = defaultDevelop,
  checkpoint = false,
  planning = {},
  research = { mode: "auto" },
  spec = {},
  dataDriven = {},
  tests = {},
  quality = { threshold: 0.9, maxIters: 5 },
} = {}) => {
  const planningOpt = normalizeFeature(planning, { checkpoint });
  const researchOpt = normalizeFeature(research, {
    mode: "auto",
    checkpointName: checkpoint ? "research" : "research_no_checkpoint",
  });
  const specOpt = normalizeFeature(spec, { checkpoint });
  const dataDrivenOpt = normalizeFeature(dataDriven);
  const testsOpt = normalizeFeature(tests, { checkpoint });

  const enabled = {
    planning: planningOpt.enabled,
    research: researchOpt.enabled,
    spec: specOpt.enabled,
    dataDriven: dataDrivenOpt.enabled,
    tests: testsOpt.enabled,
  };

  const qualityOpt = normalizeQuality(quality, {
    threshold: 0.9,
    maxIters: 5,
    buildCriteria: (task, ctx) => buildDataQualityCriteria(task, ctx, enabled),
  });

  return applyOptionalMiddlewares(
    baseDevelop,
    withDomainContext({ domain: "data", aspects: enabled }),
    planningOpt.enabled ? withDomainPlanning({ domain: "data", checkpoint: planningOpt.checkpoint }) : null,
    researchOpt.enabled ? withResearch(researchOpt) : null,
    specOpt.enabled ? withSpec(specOpt) : null,
    dataDrivenOpt.enabled ? withDataDrivenWork(dataDrivenOpt) : null,
    testsOpt.enabled ? withTests(testsOpt) : null,
    qualityOpt.enabled ? withQualityGate(qualityOpt) : null
  );
};
