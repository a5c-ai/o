import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "sdk",
  sections: [
    {
      title: "Public API Design",
      prompts: [
        "What is the public surface (methods/types/options/errors)?",
        "Consistency with existing patterns and naming",
        "Breaking changes and deprecation strategy",
      ],
    },
    {
      title: "Compatibility And Releases",
      prompts: [
        "Supported runtimes/platforms and version matrix",
        "Semver policy and changelog expectations",
        "Release automation and rollback (yank, patch release)",
      ],
    },
    {
      title: "Reliability And Security",
      prompts: [
        "Retry/timeouts policy and safe defaults",
        "Credential handling and redaction in logs",
        "Supply chain considerations and dependency policy",
      ],
    },
    {
      title: "Testing And Examples",
      prompts: [
        "Integration tests against real or emulated services",
        "Examples that compile and run in CI",
        "Documentation coverage for the new API surface",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Breaking change introduced without semver bump or migration guidance",
  "Unsafe defaults causing retries storms or data leaks",
  "Docs/examples drift causing user confusion and support load",
  "Inconsistent error handling across methods",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("SDK is ergonomic, correct, and consistent across supported environments");
  plan.invariants.push("Public API behavior is stable and documented");
  plan.testPlan.unit.push("Edge cases and error mapping tests");
  plan.testPlan.integration.push("End-to-end usage against service or emulator");
  plan.checks.preDeploy.push("Versioning and changelog sanity check");
  plan.checks.postDeploy.push("Publish smoke test or install test on supported environments");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Release as pre-release or minor release if possible");
  plan.plan.phases.push("Monitor adoption and issues before wide promotion");
  plan.plan.guardrails.push("Install success and error reports from users/CI");
  plan.plan.abortSignals.push("Critical regressions or widespread install failures");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Critical regressions or widespread install failures");
  plan.steps.push("Yank or deprecate the release and publish a patch if needed");
  plan.validationAfterRollback.push("Confirm installs resolve and docs updated");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("SDK adoption and error reports (if telemetry exists)");
  plan.alerts.push("Alert on spike in error reports or install failures (if available)");
  plan.runbooks.push("SDK release runbook: rollback, yank, patch, communicate");
  return plan;
};

export const criteriaPack = () => [
  "Public API design is consistent and ergonomic; breaking changes are explicit",
  "Versioning and release process is defined (semver, deprecations)",
  "Testing matrix covers supported environments and example code stays working",
];
