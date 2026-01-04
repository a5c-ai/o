import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";

const gate = (task, ctx, criteria, opts = {}) =>
  runQualityGate({
    task,
    ctx,
    develop: defaultDevelop,
    criteria,
    threshold: opts.threshold ?? 0.85,
    maxIters: opts.maxIters ?? 4,
    checkpoint: opts.checkpoint ?? false,
  });

export const testPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Test plan",
      prompt:
        "Create a test plan. Output JSON: " +
        "{\"scope\": string[], \"outOfScope\": string[], " +
        "\"riskAreas\": string[], \"testMatrix\": [{\"dimension\": string, \"values\": string[]}], " +
        "\"tests\": {\"unit\": string[], \"integration\": string[], \"e2e\": string[], \"manual\": string[]}, " +
        "\"environments\": string[], \"entryCriteria\": string[], \"exitCriteria\": string[]}",
      input,
    },
    ctx,
    [
      "Plan is risk-based and scoped to the change",
      "Entry/exit criteria are measurable and enforceable",
      "Test matrix reflects real user environments and edge cases",
    ],
    opts
  );
};

export const releaseReadiness = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Release readiness review",
      prompt:
        "Perform a release readiness review. Output JSON: " +
        "{\"ready\": boolean, \"blockers\": string[], \"risks\": string[], " +
        "\"requiredChecks\": string[], \"rolloutPlan\": string[], \"rollbackPlan\": string[], " +
        "\"monitoring\": string[], \"owners\": [{\"area\": string, \"ownerRole\": string}]}",
      input,
    },
    ctx,
    [
      "Decision (ready/not ready) is justified by blockers and required checks",
      "Rollout/rollback is concrete and matches risk level",
      "Monitoring and ownership are explicit and actionable",
    ],
    opts
  );
};

export const regressionSuitePlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Regression suite plan",
      prompt:
        "Design a regression suite plan. Include: what to automate, what to keep manual, " +
        "how to keep flake low, and how to gate merges/releases. Output JSON: " +
        "{\"smoke\": string[], \"criticalFlows\": string[], \"nonFunctional\": string[], " +
        "\"automationPriorities\": string[], \"flakeMitigation\": string[], \"ciGates\": string[]}",
      input,
    },
    ctx,
    [
      "Covers smoke and critical flows with clear automation priorities",
      "Flake mitigation is practical and specific",
      "CI gates map to real risk and are not overly brittle",
    ],
    opts
  );
};

export const bugBashPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Bug bash plan",
      prompt:
        "Create a bug bash plan. Output JSON: " +
        "{\"goal\": string, \"charters\": [{\"area\": string, \"focus\": string, \"steps\": string[]}], " +
        "\"participants\": string[], \"timebox\": string, \"triageRules\": string[], \"reporting\": string[]}",
      input,
    },
    ctx,
    [
      "Charters are scoped and actionable for participants",
      "Triage rules prevent noise and ensure follow-through",
      "Reporting captures enough evidence for engineering",
    ],
    opts
  );
};

