export const rolloutPlanTemplate = () => ({
  schema: "rollout_plan/v1",
  strategyOptions: ["all-at-once", "canary", "progressive", "feature-flag"],
  plan: {
    strategy: "progressive",
    phases: [],
    guardrails: [],
    abortSignals: [],
    communication: [],
  },
});

export const rollbackPlanTemplate = () => ({
  schema: "rollback_plan/v1",
  triggers: [],
  steps: [],
  dataRecovery: [],
  validationAfterRollback: [],
});

export const rolloutChecklist = () => [
  "Define phases (percentages or cohorts) and time between them",
  "Define guardrails (metrics) and clear abort signals",
  "Call out any one-way changes and required mitigations",
  "Define how to communicate status and who owns the decision",
];

export const rollbackChecklist = () => [
  "Define clear rollback triggers tied to metrics and user impact",
  "Ensure rollback is tested or at least rehearsed as a procedure",
  "Call out data recovery steps and any irreversible actions",
  "Include validation steps after rollback",
];

export const ROLLOUT_PROMPT = [
  "Create a rollout plan for the task.",
  "Return short bullets grouped by: strategy, phases, guardrails, abort signals, comms.",
  "Prefer progressive rollout or feature flags when risk is non-trivial.",
].join("\n");

export const ROLLBACK_PROMPT = [
  "Create a rollback plan for the task.",
  "Return short bullets grouped by: triggers, steps, data recovery, validation after rollback.",
  "Be explicit about irreversible steps and how to mitigate them.",
].join("\n");

