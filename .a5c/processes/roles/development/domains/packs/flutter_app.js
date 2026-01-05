import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "flutter_app",
  sections: [
    {
      title: "Architecture And State",
      prompts: [
        "State management approach (provider/bloc/riverpod) and ownership boundaries",
        "Navigation/routing changes and deep link handling",
        "Offline behavior and caching if relevant",
      ],
    },
    {
      title: "Platform Integration",
      prompts: [
        "Permissions and platform-specific behaviors (iOS/Android)",
        "Platform channels and error handling",
        "Build flavors, signing, and release configuration",
      ],
    },
    {
      title: "Performance And UX",
      prompts: [
        "Frame budget and jank risks for key screens",
        "Large list rendering, image handling, and startup time impact",
        "Loading, error, and empty states for critical flows",
      ],
    },
    {
      title: "Release And Monitoring",
      prompts: [
        "Store rollout strategy and versioning policy",
        "Crash reporting, app start metrics, and key user journey health",
        "Rollback plan (staged rollout pause, hotfix, remote config)",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Release build misconfiguration causing production-only crashes",
  "Platform channel errors causing user-visible failures on one platform",
  "Performance regression causing jank or slow startup",
  "Navigation regression breaking deep links or critical flows",
  "Missing crash monitoring delaying detection of regressions",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Flutter app behavior is correct on iOS and Android for key flows");
  plan.invariants.push("Release build works and telemetry captures failures");
  plan.testPlan.unit.push("Widget and unit tests for critical states and flows");
  plan.testPlan.e2e.push("Smoke tests on real devices or emulators for key journeys");
  plan.checks.preDeploy.push("Verify release build and signing configuration");
  plan.checks.postDeploy.push("Monitor crash-free sessions and key journey success during rollout");
  plan.rollbackReadiness.push("Rollback plan includes staged rollout pause and hotfix steps");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Ship internal/beta, validate crash-free and key metrics");
  plan.plan.phases.push("Staged rollout to small percent, then expand");
  plan.plan.guardrails.push("Crash-free sessions and key journey success rate");
  plan.plan.abortSignals.push("Crash spike or major regression in key flow");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Crash spike or critical flow regression");
  plan.steps.push("Pause staged rollout and publish hotfix if needed");
  plan.steps.push("Use remote config/feature flag to disable risky features");
  plan.validationAfterRollback.push("Confirm crash rate and key metrics recover");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Flutter: crash-free sessions, app start time, key journey success");
  plan.alerts.push("Alert on crash rate increase above threshold");
  plan.logs.push("Client logs with breadcrumbs for key user actions (no PII)");
  plan.runbooks.push("Mobile rollback runbook: pause rollout, hotfix, remote kill switch");
  return plan;
};

export const criteriaPack = () => [
  "iOS/Android platform behaviors and permissions are verified",
  "Release build and signing are validated before rollout",
  "Monitoring covers crash rate and key journey success with a rollback playbook",
];

