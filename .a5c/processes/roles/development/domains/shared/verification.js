export const verificationPlanTemplate = () => ({
  schema: "verification_plan/v1",
  goals: [],
  invariants: [],
  testPlan: {
    unit: [],
    integration: [],
    e2e: [],
    contract: [],
  },
  checks: {
    manual: [],
    preDeploy: [],
    postDeploy: [],
  },
  dataValidation: [],
  rolloutChecks: [],
  rollbackReadiness: [],
});

export const verificationChecklist = () => [
  "State the primary invariants and how they are verified",
  "Include failure-mode coverage: timeouts, retries, partial failures",
  "Include at least 1 negative test and 1 boundary test",
  "Include deploy-time checks and post-deploy validation",
  "Include a concrete rollback readiness check",
];

export const VERIFICATION_PROMPT = [
  "Create an actionable verification plan for the task.",
  "Return short bullets grouped by: invariants, tests, pre/post deploy checks.",
  "Prefer tests that can be automated; call out any manual verification explicitly.",
].join("\n");

