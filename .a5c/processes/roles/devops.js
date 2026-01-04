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

export const incidentResponse = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Incident response runbook",
      prompt:
        "Produce an incident response execution plan. Include: " +
        "immediate mitigations, verification signals, comms cadence, " +
        "ownership, and rollback options. Keep it fast to execute.",
      input,
    },
    ctx,
    [
      "Prioritizes safe, reversible mitigations",
      "Defines verification signals and decision points",
      "Includes comms cadence and ownership",
    ],
    opts
  );
};

export const deploy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Deploy plan",
      prompt:
        "Draft a deploy plan. Include: prerequisites, rollout steps, " +
        "health checks, rollback plan, and post-deploy validation.",
      input,
    },
    ctx,
    [
      "Prereqs and steps are unambiguous",
      "Health checks and success criteria are defined",
      "Rollback plan is practical and tested",
    ],
    opts
  );
};

export const postmortem = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Postmortem",
      prompt:
        "Write a blameless postmortem. Include: impact, timeline, " +
        "root cause(s), detection gaps, what went well, what didn't, " +
        "and action items with owners and target dates.",
      input,
    },
    ctx,
    [
      "Timeline and impact are clear and factual",
      "Root causes and contributing factors are identified",
      "Action items are specific with owners and dates",
    ],
    opts
  );
};

export const capacityReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Capacity review",
      prompt:
        "Produce a capacity review. Include: current load, bottlenecks, " +
        "forecast, and recommendations (quick wins and longer-term).",
      input,
    },
    ctx,
    [
      "Identifies bottlenecks and constraints explicitly",
      "Recommendations are prioritized with expected impact",
      "Includes monitoring signals to validate changes",
    ],
    opts
  );
};

export const monitorTriage = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Monitoring alert triage",
      prompt:
        "Triage the monitoring alert. Output JSON: " +
        "{\"alert\": string, \"severity\": \"low\"|\"med\"|\"high\", " +
        "\"likelyCause\": string, \"checks\": string[], \"mitigation\": string[], \"escalateTo\": string}",
      input,
    },
    ctx,
    [
      "Severity and escalation path are justified",
      "Checks are ordered from fastest to most informative",
      "Mitigations are safe and reversible",
    ],
    opts
  );
};

export const infraChangePlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Infrastructure change plan",
      prompt:
        "Draft an infrastructure change plan. Include: " +
        "scope, dependencies, rollout and rollback, safety checks, " +
        "and a validation plan.",
      input,
    },
    ctx,
    [
      "Defines scope and dependencies clearly",
      "Rollout/rollback and safety checks are credible",
      "Validation plan ties to observable signals",
    ],
    opts
  );
};

