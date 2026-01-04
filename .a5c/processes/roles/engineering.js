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

export const techDesign = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Technical design",
      prompt:
        "Write a technical design document. Include: context, goals/non-goals, " +
        "approach, data/contracts, failure modes, rollout plan, and open questions.",
      input,
    },
    ctx,
    [
      "Describes a coherent approach with tradeoffs",
      "Calls out failure modes and operational concerns",
      "Includes rollout plan and open questions",
    ],
    opts
  );
};

export const implementChange = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Implementation plan",
      prompt:
        "Produce an engineering implementation plan. Include: tasks, " +
        "tests/verification, rollout, and risk mitigations. Keep it concrete.",
      input,
    },
    ctx,
    [
      "Breaks work into concrete, testable steps",
      "Includes verification and rollback considerations",
      "Risks and edge cases are addressed",
    ],
    opts
  );
};

export const codeReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Code review",
      prompt:
        "Perform a code review and produce review feedback. Include: " +
        "correctness issues, maintainability, security/perf concerns, and " +
        "a clear approve/request-changes recommendation.",
      input,
    },
    ctx,
    [
      "Finds correctness and edge case risks",
      "Feedback is actionable and prioritized",
      "Calls out security/perf and maintainability",
    ],
    opts
  );
};

export const investigateBug = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Bug investigation",
      prompt:
        "Investigate the bug and propose next actions. Include: " +
        "repro steps, suspected root cause, impacted areas, " +
        "short-term mitigation, and a fix plan.",
      input,
    },
    ctx,
    [
      "Repro and impact are clearly described",
      "Root cause hypothesis is plausible and evidence-driven",
      "Proposes mitigation and fix plan with verification",
    ],
    opts
  );
};

export const refactor = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Refactor proposal",
      prompt:
        "Propose a refactor. Include: motivation, scope, " +
        "incremental steps, risks, and success criteria.",
      input,
    },
    ctx,
    [
      "Motivation ties to maintainability or reliability",
      "Plan is incremental with clear success criteria",
      "Risks and regression tests are addressed",
    ],
    opts
  );
};

export const oncallTriage = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "On-call triage",
      prompt:
        "Perform on-call triage. Output JSON: " +
        "{\"summary\": string, \"severity\": \"SEV0\"|\"SEV1\"|\"SEV2\"|\"SEV3\", " +
        "\"hypotheses\": string[], \"nextChecks\": string[], \"mitigations\": string[], \"ownerRole\": string}",
      input,
    },
    ctx,
    [
      "Assigns a defensible severity level",
      "Next checks and mitigations are prioritized and concrete",
      "Summary is clear and suitable for incident comms",
    ],
    opts
  );
};

export const rfc = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "RFC",
      prompt:
        "Write an RFC. Include: problem statement, context, goals/non-goals, " +
        "proposed solution, alternatives, risks, rollout, and open questions. " +
        "Prefer crisp bullets and clear decision points.",
      input,
    },
    ctx,
    [
      "Problem and goals are clear and non-overlapping",
      "Alternatives are considered fairly with tradeoffs",
      "Rollout, risks, and open questions are explicit",
    ],
    opts
  );
};

export const testStrategy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Test strategy",
      prompt:
        "Create a test strategy. Output JSON: " +
        "{\"scope\": string, \"testPyramid\": {\"unit\": string[], \"integration\": string[], \"e2e\": string[]}, " +
        "\"nonFunctional\": string[], \"tooling\": string[], \"ciGates\": string[], \"risks\": string[]}",
      input,
    },
    ctx,
    [
      "Test pyramid is appropriate to risk and system shape",
      "CI gates are explicit and map to risks",
      "Includes non-functional testing where it matters (perf, security, reliability)",
    ],
    opts
  );
};
