import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "react_native_app",
  sections: [
    {
      title: "Screens, Navigation, And State",
      prompts: [
        "Which screens and navigation routes are affected?",
        "Key states: loading/empty/error/offline/success",
        "State ownership and data flow (local state, cache, server sync)",
      ],
    },
    {
      title: "Native Boundaries",
      prompts: [
        "Any native modules involved (iOS/Android) and version constraints?",
        "Permissions (camera, location) and user prompts",
        "Background execution, push notifications, deep links (if relevant)",
      ],
    },
    {
      title: "Performance, Reliability, And Offline",
      prompts: [
        "Startup time, frame drops, memory usage on low-end devices",
        "Offline behavior and data consistency model",
        "Crash handling and user-visible error states",
      ],
    },
    {
      title: "Release And Rollback",
      prompts: [
        "Release strategy (phased rollout via app stores, feature flags, OTA updates)",
        "Rollback strategy (disable flag, OTA rollback, hotfix release)",
        "Guardrails: crash rate, ANR rate, key flow success rate",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Crash due to device-specific runtime or native module mismatch",
  "Offline behavior corrupts local state or causes data loss",
  "Performance regression (startup time, dropped frames, memory leaks)",
  "Permission flow breaks key user journeys",
  "Deep link or navigation regression breaks routing",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("App behavior is correct across key screens and device states");
  plan.invariants.push("No crashes in critical flows; errors are user-friendly");
  plan.testPlan.unit.push("Component logic and state transitions");
  plan.testPlan.integration.push("Data sync/offline transitions and error handling");
  plan.testPlan.e2e.push("Critical flows on iOS and Android (at least 1 device each)");
  plan.checks.manual.push("Permission prompts and deep links (if relevant)");
  plan.checks.preDeploy.push("Bundle size and performance smoke check");
  plan.checks.postDeploy.push("Monitor crash rate and key flow success rate during rollout");
  plan.rollbackReadiness.push("Rollback plan includes disable flag or revert OTA/hotfix release");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Internal testing, then small percentage rollout");
  plan.plan.phases.push("Increase rollout as crash rate and guardrails stay healthy");
  plan.plan.guardrails.push("Crash rate, ANR rate, key flow success rate");
  plan.plan.abortSignals.push("Sustained crash/ANR increase or key flow failure spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained crash/ANR increase or key flow failure spike");
  plan.steps.push("Disable feature flag or revert OTA update if applicable");
  plan.steps.push("Ship hotfix release if rollback cannot be immediate");
  plan.validationAfterRollback.push("Confirm crash rate and key flow success rate return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Mobile health: crash rate, ANR rate, launch time, key flow success");
  plan.alerts.push("Alert on sustained crash/ANR increase");
  plan.logs.push("Client logs include correlation IDs and key decision points");
  plan.runbooks.push("Mobile rollback runbook: disable flag, OTA rollback, hotfix, validate");
  return plan;
};

export const criteriaPack = () => [
  "Plan covers screens/routes and device states (offline, permissions, background) where relevant",
  "Release uses phased rollout with crash/ANR guardrails and rollback plan",
  "Verification includes at least 1 real device pass per platform for key flows",
];

