import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "vue_app",
  sections: [
    {
      title: "Component And State Architecture",
      prompts: [
        "Which components change and how do state flows change?",
        "State management approach (Pinia/Vuex/local) and ownership boundaries",
        "Any reactivity pitfalls (computed/watch) or deep state mutations?",
      ],
    },
    {
      title: "Routing And Data Fetching",
      prompts: [
        "Routes affected and navigation guards",
        "Data fetching patterns and caching (if any)",
        "Loading, empty, and error states for key views",
      ],
    },
    {
      title: "Build Tooling And Performance",
      prompts: [
        "Bundler (Vite/Webpack) changes and bundle size impact",
        "Code splitting/lazy loading for large routes",
        "Performance budgets and accessibility expectations",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Client error monitoring and key UX metrics",
        "Rollout plan (flag/progressive) and rollback triggers",
        "Any CDN/cache invalidation needs",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Reactive state bug causing stale UI or infinite re-renders",
  "Route guard regression breaking auth or navigation flows",
  "Bundle size regression causing slow loads on low-end devices",
  "Missing loading/error states causing broken UX during failures",
  "Client error monitoring gaps hiding real user impact",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Vue app UX behavior is correct across key routes");
  plan.invariants.push("Loading/error states exist and do not trap users");
  plan.testPlan.unit.push("Component unit tests for key logic and states");
  plan.testPlan.e2e.push("Critical user journeys across key routes");
  plan.checks.preDeploy.push("Verify bundle size and performance budgets where applicable");
  plan.checks.postDeploy.push("Monitor JS errors and web vitals during rollout");
  plan.rollbackReadiness.push("Rollback disables flag or reverts deployment cleanly");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "feature-flag";
  plan.plan.phases.push("Enable for internal users or small cohort first");
  plan.plan.phases.push("Increase cohort gradually with guardrails");
  plan.plan.guardrails.push("JS errors and web vitals for key routes");
  plan.plan.abortSignals.push("Sustained JS errors or web vitals regression");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("JS error spike or key journey regression");
  plan.steps.push("Disable feature flag and redeploy previous build if needed");
  plan.validationAfterRollback.push("Confirm key routes work and errors normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Vue app: JS errors, LCP/INP/CLS for key routes");
  plan.alerts.push("Alert on sustained JS error increase");
  plan.alerts.push("Alert on sustained web vitals regression");
  plan.runbooks.push("Frontend rollback runbook: disable flag, revert build");
  return plan;
};

export const criteriaPack = () => [
  "State ownership and reactivity are correct and avoid common pitfalls",
  "Routes and key journeys are covered by e2e or integration tests",
  "Performance and accessibility expectations are measured for key screens",
];

