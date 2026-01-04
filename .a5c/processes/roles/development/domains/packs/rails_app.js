import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";
import { migrationPlanTemplate } from "../shared/migrations.js";

export const planningBreakdownTemplate = () => ({
  domain: "rails_app",
  sections: [
    {
      title: "Routes, Controllers, And Views",
      prompts: [
        "Which controllers/actions/routes are added or changed?",
        "Authn/authz checks and policy boundaries",
        "Key UX states and error handling behavior",
      ],
    },
    {
      title: "Data Model And Migrations",
      prompts: [
        "ActiveRecord model changes and invariants",
        "Migration strategy and lock risk; expand/contract where needed",
        "Background jobs or callbacks impacted",
      ],
    },
    {
      title: "Performance And Reliability",
      prompts: [
        "N+1 queries and eager loading strategy",
        "Caching strategy and invalidation boundaries",
        "Timeouts and failure handling for external dependencies",
      ],
    },
    {
      title: "Operability And Security",
      prompts: [
        "Logs/metrics/tracing for key requests and jobs",
        "Security: input validation, CSRF, authz, secrets handling",
        "Rollout plan and rollback plan with validation",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "N+1 query regression causes latency spikes",
  "Migration locks block production writes and causes timeouts",
  "Authz check missing or bypassed for sensitive actions",
  "Background jobs duplicate side effects without idempotency",
  "Caching invalidation bugs cause stale views",
];

export const defaultMigrationPlan = () => {
  const plan = migrationPlanTemplate();
  plan.changes.push("Expand/contract schema steps for concurrent app versions");
  plan.backfillPlan.push("Chunked, throttled backfill if needed");
  plan.validation.push("Counts and invariants validation");
  plan.rollback.push("Separate rollback plan for schema and app versions");
  plan.runbook.push("Runbook for migration execution and monitoring");
  return plan;
};

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Rails behavior is correct and stable under production load");
  plan.invariants.push("Authz enforced for sensitive actions");
  plan.testPlan.unit.push("Model validations and business logic edge cases");
  plan.testPlan.integration.push("Controller actions and DB interactions");
  plan.testPlan.e2e.push("Critical user journeys and error states");
  plan.checks.preDeploy.push("Query plan review for hot paths; N+1 checks");
  plan.checks.preDeploy.push("Migration lock risk review");
  plan.checks.postDeploy.push("Monitor request latency, errors, and DB saturation during rollout");
  plan.rollbackReadiness.push("Rollback plan includes deploy revert and migration safety");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Canary traffic with guardrails and DB metrics");
  plan.plan.phases.push("Increase gradually if stable; complete rollout");
  plan.plan.guardrails.push("Request latency, 5xx rate, DB saturation, slow queries");
  plan.plan.abortSignals.push("Sustained 5xx increase or DB latency spikes");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained 5xx increase or DB latency spikes");
  plan.steps.push("Rollback deploy; disable risky feature flags if present");
  plan.dataRecovery.push("Pause backfills; run compensating actions if needed");
  plan.validationAfterRollback.push("Confirm latency and errors return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Rails: request latency/errors, job failures, DB health");
  plan.alerts.push("Alert on sustained 5xx increase or job failure spikes");
  plan.logs.push("Structured request logs include request IDs and key params (redacted)");
  plan.runbooks.push("Rails runbook: mitigate, rollback, validate");
  return plan;
};

export const criteriaPack = () => [
  "Database migrations are safe (lock risk assessed; expand/contract where needed)",
  "N+1 query risk is assessed and mitigated for hot paths",
  "Authn/authz and input validation are explicitly reviewed",
  "Observability and rollback steps exist before risky rollout",
];

