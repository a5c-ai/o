import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";
import { migrationPlanTemplate } from "../shared/migrations.js";

export const planningBreakdownTemplate = () => ({
  domain: "django_app",
  sections: [
    {
      title: "Views, URLs, And Templates",
      prompts: [
        "Which views/URL routes change and what behavior is impacted?",
        "Permissions and auth checks (including object-level permissions)",
        "Key user states and error handling behavior",
      ],
    },
    {
      title: "Models And Migrations",
      prompts: [
        "Model changes and invariants; data migrations if needed",
        "Migration strategy and rollback approach; concurrency window",
        "Admin and management commands impacted",
      ],
    },
    {
      title: "Performance And Reliability",
      prompts: [
        "Query performance; select_related/prefetch_related where needed",
        "Caching strategy and invalidation",
        "External dependencies: timeouts/retries and failure behavior",
      ],
    },
    {
      title: "Operability And Security",
      prompts: [
        "Logging and request correlation IDs",
        "Security: input validation, CSRF, secrets, sensitive data redaction",
        "Rollout and rollback plan with monitoring",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Migration causes lock contention or long-running operations in production",
  "Query regression due to missing select_related/prefetch_related",
  "Permission check missing leading to unauthorized access",
  "Caching invalidation causes stale or inconsistent user views",
  "Unhandled exceptions cause 500 spikes without good logging",
];

export const defaultMigrationPlan = () => {
  const plan = migrationPlanTemplate();
  plan.changes.push("Expand/contract schema changes where needed for concurrency");
  plan.backfillPlan.push("Chunked, resumable data migration if needed");
  plan.validation.push("Counts/invariants and sampled correctness checks");
  plan.rollback.push("Rollback plan for schema and data separately");
  plan.runbook.push("Migration runbook and monitoring signals");
  return plan;
};

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Django behavior is correct and secure");
  plan.invariants.push("Permissions enforced for sensitive actions and data");
  plan.testPlan.unit.push("Model validation and business logic tests");
  plan.testPlan.integration.push("Views and data access integration tests");
  plan.testPlan.e2e.push("Critical user journeys and error states");
  plan.checks.preDeploy.push("Query performance review for hot paths");
  plan.checks.preDeploy.push("Migration safety and rollback review");
  plan.checks.postDeploy.push("Monitor error rate, latency, and DB health during rollout");
  plan.rollbackReadiness.push("Rollback plan includes deploy revert and migration strategy");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Canary traffic and monitor guardrails");
  plan.plan.phases.push("Increase gradually; then complete rollout");
  plan.plan.guardrails.push("Latency, 5xx rate, DB saturation, slow queries");
  plan.plan.abortSignals.push("Sustained 5xx increase or DB latency spikes");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained 5xx increase or DB latency spikes");
  plan.steps.push("Rollback deploy; disable feature flags if applicable");
  plan.dataRecovery.push("Pause data migration and recover if needed");
  plan.validationAfterRollback.push("Confirm metrics return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Django: request latency/errors, DB health, job health");
  plan.alerts.push("Alert on sustained 5xx increase or job failures");
  plan.logs.push("Structured logs include correlation IDs and redacted context");
  plan.runbooks.push("Django runbook: mitigate, rollback, validate");
  return plan;
};

export const criteriaPack = () => [
  "Migrations are safe (expand/contract where needed; rollback is feasible)",
  "Query performance risks are assessed and mitigated for hot paths",
  "Permissions and CSRF/data handling risks are explicitly reviewed",
  "Monitoring and rollback steps exist before risky rollout",
];

