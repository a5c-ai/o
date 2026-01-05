import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "angular_app",
  sections: [
    {
      title: "Module And Component Architecture",
      prompts: [
        "Which modules/components change and what responsibilities move?",
        "Change detection strategy and performance implications",
        "Shared services and dependency injection boundaries",
      ],
    },
    {
      title: "Routing And Data Flow",
      prompts: [
        "Routes affected; guards/resolvers changes",
        "RxJS streams: error handling, cancellation, and subscriptions cleanup",
        "Forms (reactive/template) and validation behavior",
      ],
    },
    {
      title: "Build Tooling And Performance",
      prompts: [
        "Build config changes and bundle size impact",
        "Lazy loading and route-level code splitting",
        "Accessibility and performance budgets for key pages",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Client error monitoring and key UX metrics",
        "Rollout strategy and rollback triggers",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "RxJS subscription leak causing memory growth or duplicate requests",
  "Guard/resolver regression breaking navigation or auth flows",
  "Change detection issues causing stale UI or performance regressions",
  "Form validation mismatch causing incorrect submissions or blocked users",
  "Bundle size regression harming load times",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Angular app behavior is correct for key routes and forms");
  plan.invariants.push("Subscriptions are cleaned up and streams handle errors correctly");
  plan.testPlan.unit.push("Component and service unit tests for key logic");
  plan.testPlan.e2e.push("Critical user journeys including navigation and forms");
  plan.checks.preDeploy.push("Verify lazy loading and bundle size budgets");
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
  plan.plan.abortSignals.push("Sustained JS errors or user journey regression");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("JS error spike or critical journey regression");
  plan.steps.push("Disable feature flag and redeploy previous build if needed");
  plan.validationAfterRollback.push("Confirm key routes work and errors normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Angular app: JS errors, LCP/INP for key routes");
  plan.alerts.push("Alert on sustained JS error increase");
  plan.alerts.push("Alert on sustained web vitals regression");
  plan.runbooks.push("Frontend rollback runbook: disable flag, revert build");
  return plan;
};

export const criteriaPack = () => [
  "Module boundaries and DI usage are coherent and testable",
  "RxJS streams handle errors and cancellation and avoid leaks",
  "Routing/guards and forms behavior are covered by tests",
];

