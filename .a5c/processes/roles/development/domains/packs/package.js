import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "package",
  sections: [
    {
      title: "Build And Publish",
      prompts: [
        "Build artifacts and reproducibility expectations",
        "Publish process: dry-run, tagging, release notes",
        "Rollback plan: yank, unpublish policy, patch release strategy",
      ],
    },
    {
      title: "Dependencies And Supply Chain",
      prompts: [
        "Dependency update policy and risk assessment for major bumps",
        "Provenance/signing strategy (if available) and integrity checks",
        "Vulnerability scanning and high-risk dependency review",
      ],
    },
    {
      title: "Compatibility And Consumers",
      prompts: [
        "Supported platforms/runtime versions",
        "Deprecations and migration guidance",
        "Examples and docs that validate install/use",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Broken publish leading to unusable package versions",
  "Breaking changes shipped without clear versioning and migration guidance",
  "Supply chain risk introduced via dependency changes",
  "Build artifacts are non-reproducible or missing required files",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Package builds, installs, and runs reliably for supported consumers");
  plan.testPlan.integration.push("Install/build smoke test in a clean environment");
  plan.checks.preDeploy.push("Publish dry run or staging publish if available");
  plan.checks.preDeploy.push("Verify changelog and version bump correctness");
  plan.rollbackReadiness.push("Rollback plan includes yank/unpublish policy and patch release");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Publish pre-release or limited rollout tag if applicable");
  plan.plan.phases.push("Promote to stable after smoke tests and feedback");
  plan.plan.guardrails.push("Install success and downstream CI signals");
  plan.plan.abortSignals.push("Widespread install/build failures");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Widespread install/build failures");
  plan.steps.push("Yank/deprecate the bad version and publish a patch");
  plan.validationAfterRollback.push("Confirm consumers can install and build again");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Release health: download failures, support signals (if available)");
  plan.runbooks.push("Package release runbook: rollback, patch, communicate");
  return plan;
};

export const criteriaPack = () => [
  "Build/install/publish are verified (dry run where possible) and reproducible",
  "Supply chain risks are addressed (dependency policy, provenance where available)",
  "Release notes and deprecations are accurate and actionable for users",
];
