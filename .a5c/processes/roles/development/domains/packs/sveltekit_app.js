import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "sveltekit_app",
  sections: [
    {
      title: "Routing, Load, And Data Boundaries",
      prompts: [
        "Which routes (+page/+layout) change and what runs on server vs client?",
        "Load functions: caching behavior, invalidation, and error handling",
        "Form actions/endpoints and how auth/session is handled",
      ],
    },
    {
      title: "SSR, Adapters, And Deployment",
      prompts: [
        "SSR behavior and adapter choice (node/static/edge) implications",
        "Environment variables and secrets boundaries",
        "Any CDN/cache behavior and invalidation steps",
      ],
    },
    {
      title: "UX And Performance",
      prompts: [
        "Loading and error UI; progressive enhancement expectations",
        "Bundle impact and code splitting for large routes",
        "SEO metadata and robots/index behavior if relevant",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Monitoring: route errors, server-side errors, web vitals, user impact",
        "Rollout strategy (flag/canary) and rollback steps",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Load function caching bug causing stale or incorrect data",
  "Server/client boundary mismatch causing hydration or runtime errors",
  "Adapter or environment misconfig causing production-only failures",
  "Form action regression causing auth or data corruption issues",
  "Missing route-level monitoring hiding user-impacting regressions",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("SvelteKit routes and load functions behave correctly");
  plan.invariants.push("Server/client boundaries preserve correctness and security");
  plan.testPlan.integration.push("Load/action behavior including auth and error cases");
  plan.testPlan.e2e.push("Critical user journeys across key routes");
  plan.checks.preDeploy.push("Verify adapter configuration and environment variables");
  plan.checks.postDeploy.push("Monitor route 5xx and web vitals during rollout");
  plan.rollbackReadiness.push("Rollback reverts adapter/build changes cleanly");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy and validate key routes and telemetry");
  plan.plan.phases.push("Increase traffic gradually with guardrails");
  plan.plan.guardrails.push("Route 5xx, server errors, JS errors, web vitals");
  plan.plan.abortSignals.push("Sustained errors or web vitals regression");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained route errors or user-impacting regressions");
  plan.steps.push("Roll back to previous build or adapter configuration");
  plan.validationAfterRollback.push("Confirm key routes recover and errors normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("SvelteKit: route 5xx, server errors, JS errors, web vitals");
  plan.alerts.push("Alert on sustained route 5xx increase");
  plan.alerts.push("Alert on sustained JS error increase");
  plan.runbooks.push("SvelteKit rollback runbook: revert build/adapter, validate routes");
  return plan;
};

export const criteriaPack = () => [
  "Load caching and invalidation behavior is explicit and tested",
  "Server/client boundaries (SSR, actions) are correct and secure",
  "Deployment adapter and env config are verified before rollout",
];

