import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate, sloSketchTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";
import { migrationPlanTemplate } from "../shared/migrations.js";

export const planningBreakdownTemplate = () => ({
  domain: "dotnet_webapi",
  sections: [
    {
      title: "API Contracts And Versioning",
      prompts: [
        "Endpoint changes and compatibility strategy",
        "Authn/authz, scopes/claims, and least-privilege",
        "Idempotency, pagination, rate limiting, and caching where needed",
      ],
    },
    {
      title: "Data And Consistency",
      prompts: [
        "Data model invariants and transaction boundaries",
        "Migration strategy (expand/contract) and rollback",
        "Concurrency behavior and partial failure handling",
      ],
    },
    {
      title: "Performance And Reliability",
      prompts: [
        "Hot paths and allocation pressure; latency budgets",
        "Timeouts/retries for dependencies; avoid retry storms",
        "Thread pool starvation risks and mitigations",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Structured logs and correlation IDs",
        "Metrics for latency/errors/saturation; alerting and runbooks",
        "Rollout/rollback plan with guardrails",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Thread pool starvation causes cascading timeouts and errors",
  "Retry storms amplify downstream outages",
  "Authz gaps due to misconfigured policies/claims checks",
  "Migration causes lock contention or correctness bugs",
  "Insufficient logging makes incidents hard to triage",
];

export const defaultMigrationPlan = () => {
  const plan = migrationPlanTemplate();
  plan.changes.push("Expand/contract schema steps for concurrent versions");
  plan.backfillPlan.push("Chunked, throttled backfill if needed");
  plan.validation.push("Counts/invariants validation");
  plan.rollback.push("Rollback plan for schema and application versions");
  plan.runbook.push("Runbook for migration execution and monitoring");
  return plan;
};

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("API is correct, compatible, and reliable under load");
  plan.invariants.push("Authz enforced for sensitive operations");
  plan.testPlan.unit.push("Business logic edge cases and error mapping");
  plan.testPlan.integration.push("DB interactions and transaction behavior");
  plan.testPlan.contract.push("API contract tests for request/response/error shapes");
  plan.checks.preDeploy.push("Load sanity check for critical endpoints");
  plan.checks.postDeploy.push("Monitor SLO signals and dependency errors during rollout");
  plan.rollbackReadiness.push("Rollback plan exists and is feasible under load");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Canary traffic with guardrails");
  plan.plan.phases.push("Increase gradually if stable; then complete rollout");
  plan.plan.guardrails.push("Latency, error rate, saturation, dependency errors");
  plan.plan.abortSignals.push("Sustained latency regression or error spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained latency regression or error spike");
  plan.steps.push("Rollback deploy or disable feature flag");
  plan.validationAfterRollback.push("Confirm metrics return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("API health: latency, errors, saturation, dependency health");
  plan.alerts.push("Alert on SLO burn or sustained error spikes");
  plan.logs.push("Structured logs with correlation IDs and auth failures");
  plan.traces.push("Distributed traces for critical request paths");
  plan.runbooks.push("API runbook: mitigate, rollback, validate");
  return plan;
};

export const defaultSloSketch = () => {
  const slo = sloSketchTemplate();
  slo.service = "dotnet_webapi";
  slo.indicators.push("Availability for critical endpoints");
  slo.indicators.push("Latency p95 for critical endpoints");
  slo.objectives.push("Availability meets agreed target for critical endpoints");
  slo.objectives.push("Latency p95 meets agreed target for critical endpoints");
  slo.alerting.push("Multi-window burn-rate alerts tied to user impact");
  return slo;
};

export const criteriaPack = () => [
  "Thread pool starvation and retry storms are considered and mitigated",
  "API contract and error model are explicit and tested",
  "Authz policies/claims checks are least-privilege and verified",
  "Observability includes correlation IDs, dashboards, alerts, and runbooks",
];

