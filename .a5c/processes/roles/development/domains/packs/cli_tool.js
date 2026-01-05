import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "cli_tool",
  sections: [
    {
      title: "Command UX And Interface",
      prompts: [
        "Commands/subcommands affected and their purpose",
        "Flags, defaults, and compatibility expectations (breaking changes?)",
        "Help text, examples, and error messages for common failures",
      ],
    },
    {
      title: "Configuration And Credentials",
      prompts: [
        "Config sources (flags/env/files) and precedence rules",
        "Credential handling and secret storage (no secrets in logs)",
        "Non-interactive vs interactive auth flows if applicable",
      ],
    },
    {
      title: "Distribution And Updates",
      prompts: [
        "Install paths (brew/npm/pip/apt) and supported platforms",
        "Versioning and migration for config or default changes",
        "Rollback strategy for a bad release (yank, patch, downgrade guidance)",
      ],
    },
    {
      title: "Telemetry And Supportability",
      prompts: [
        "Optional telemetry policy and user controls",
        "Diagnostics: verbose mode, debug bundle, and reproducible error reports",
        "Observability for failures (crash reports, error codes) if applicable",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Breaking flag/default change silently altering behavior for users",
  "Config precedence confusion causing wrong environment usage",
  "Secrets accidentally written to logs or shell history",
  "Packaging/install issues on one OS/arch",
  "Poor error messages causing high support burden",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("CLI works across supported platforms and has predictable UX");
  plan.invariants.push("Config precedence is stable and secrets are never logged");
  plan.testPlan.unit.push("Argument parsing and config precedence tests");
  plan.testPlan.integration.push("End-to-end command tests for key workflows");
  plan.checks.preDeploy.push("Dry-run install and basic smoke on supported platforms where feasible");
  plan.checks.preDeploy.push("Verify help text and examples match actual behavior");
  plan.checks.postDeploy.push("Monitor crash/error reports and support tickets during rollout");
  plan.rollbackReadiness.push("Rollback plan includes yank/patch and downgrade guidance");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Ship as pre-release/beta channel first if available");
  plan.plan.phases.push("Promote to stable with guardrails");
  plan.plan.guardrails.push("Crash rate, error codes, and install failures");
  plan.plan.abortSignals.push("Install failures or crash spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Install failures, crash spike, or severe UX regression");
  plan.steps.push("Yank or deprecate bad release and publish hotfix");
  plan.steps.push("Provide downgrade guidance and known-good version");
  plan.validationAfterRollback.push("Confirm install and key commands succeed");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("CLI: crash rate, error codes frequency, install failures");
  plan.alerts.push("Alert on crash spike or install failure spike");
  plan.logs.push("Structured error output with stable error codes (no secrets)");
  plan.runbooks.push("CLI runbook: yank release, publish hotfix, communicate downgrade");
  return plan;
};

export const criteriaPack = () => [
  "CLI interface is consistent (flags/defaults) and has clear help/examples",
  "Config and credential handling are secure and predictable",
  "Distribution and rollback plan is concrete across supported platforms",
];

