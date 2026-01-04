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

export const triageFeedback = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Triage customer and stakeholder feedback",
      prompt:
        "Triage the feedback into themes and actions. Output: " +
        "{\"themes\": [{\"name\": string, \"signal\": string, \"examples\": string[]}], " +
        "\"actions\": [{\"action\": string, \"ownerRole\": string, \"priority\": \"P0\"|\"P1\"|\"P2\", \"notes\": string}]}",
      input,
    },
    ctx,
    [
      "Groups feedback into clear themes",
      "Proposes actionable next steps with owners",
      "Priorities are justified and realistic",
    ],
    opts
  );
};

export const backlogGrooming = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Backlog grooming",
      prompt:
        "Produce a prioritized backlog refinement output. Include: " +
        "top items with problem statement, value, scope, and acceptance criteria. " +
        "Output JSON: {\"items\": [{\"title\": string, \"problem\": string, \"value\": string, " +
        "\"scope\": string[], \"acceptance\": string[], \"priority\": \"P0\"|\"P1\"|\"P2\", \"notes\": string}]}",
      input,
    },
    ctx,
    [
      "Top items have clear problem and value",
      "Acceptance criteria are testable",
      "Priorities align to impact and effort",
    ],
    opts
  );
};

export const writePRD = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Write PRD",
      prompt:
        "Write a PRD suitable for engineering kickoff. Include: " +
        "problem, goals/non-goals, users, requirements, UX notes, success metrics, " +
        "risks, and open questions. Keep it concise and scannable.",
      input,
    },
    ctx,
    [
      "States goals, non-goals, and target users",
      "Requirements are unambiguous and prioritized",
      "Includes measurable success metrics and risks",
    ],
    opts
  );
};

export const defineSuccessMetrics = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Define success metrics",
      prompt:
        "Define success metrics for the initiative. Output: " +
        "{\"northStar\": string, \"metrics\": [{\"name\": string, \"definition\": string, \"target\": string, \"cadence\": string}], " +
        "\"guardrails\": [{\"name\": string, \"definition\": string, \"threshold\": string}]}",
      input,
    },
    ctx,
    [
      "Metrics have precise definitions and cadence",
      "Targets are plausible and time-bound",
      "Includes guardrails to prevent regressions",
    ],
    opts
  );
};

export const stakeholderUpdate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Stakeholder update",
      prompt:
        "Draft a stakeholder update. Include: status, key progress, next steps, " +
        "risks/asks, and decisions needed. Use plain language and keep to <= 12 bullets.",
      input,
    },
    ctx,
    [
      "Communicates status, progress, and next steps clearly",
      "Calls out risks and concrete asks/decisions",
      "Tone is concise and appropriate for stakeholders",
    ],
    opts
  );
};

export const decisionRecord = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Decision record",
      prompt:
        "Write a short decision record (ADR-style). Include: context, decision, " +
        "options considered, rationale, consequences, and follow-ups.",
      input,
    },
    ctx,
    [
      "Captures context and options fairly",
      "Decision and rationale are explicit",
      "Consequences and follow-ups are practical",
    ],
    opts
  );
};

