import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate, sloSketchTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";
import { migrationPlanTemplate } from "../shared/migrations.js";

export const planningBreakdownTemplate = () => ({
  domain: "spring_boot_service",
  sections: [
    {
      title: "API And Contracts",
      prompts: [
        "Endpoint changes and error model; compatibility expectations",
        "Authn/authz model and least-privilege enforcement",
        "Rate limits, pagination, and caching behavior where relevant",
      ],
    },
    {
      title: "Data And Transactions",
      prompts: [
        "Data model changes and invariants; transaction boundaries",
        "Migration strategy (expand/contract) and rollback safety",
        "Concurrency, locking, and consistency expectations",
      ],
    },
    {
      title: "Performance And Reliability",
      prompts: [
        "Hot paths and latency budgets; thread pool sizing",
        "Timeouts/retries for dependencies; avoid retry storms",
        "Backpressure and degraded modes under partial failure",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Observability: logs/metrics/tracing; correlation IDs",
        "Dashboards and alerts for SLOs and saturation",
        "Rollout/rollback plan and runbooks",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Thread pool starvation causes cascading latency and timeouts",
  "Misconfigured retries amplify downstream outages",
  "Authz misconfiguration exposes sensitive operations",
  "Migration leads to lock contention or correctness bugs",
  "Logging lacks correlation IDs, slowing incident response",
];

export const defaultMigrationPlan = () => {
  const plan = migrationPlanTemplate();
  plan.changes.push("Expand/contract schema steps for concurrent versions");
  plan.backfillPlan.push("Chunked, throttled, resumable backfill if needed");
  plan.validation.push("Counts/invariants validation for migrated data");
  plan.rollback.push("Rollback plan for schema and application versions");
  plan.runbook.push("Runbook: migrate, monitor, rollback, validate");
  return plan;
};

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Service is correct, reliable, and observable under load");
  plan.invariants.push("Authz enforced for sensitive operations");
  plan.testPlan.unit.push("Business logic invariants and edge cases");
  plan.testPlan.integration.push("DB interactions and transaction behavior");
  plan.testPlan.contract.push("API contract tests (request/response/error shapes)");
  plan.checks.preDeploy.push("Load sanity check for critical endpoints");
  plan.checks.postDeploy.push("Monitor SLO signals during rollout");
  plan.rolloutChecks.push("Canary checks include latency, errors, and saturation");
  plan.rollbackReadiness.push("Rollback procedure is documented and feasible under load");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Canary small traffic percentage with guardrails");
  plan.plan.phases.push("Increase gradually if stable; then complete rollout");
  plan.plan.guardrails.push("Latency, error rate, saturation, dependency errors");
  plan.plan.abortSignals.push("Sustained latency regression or error increase");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained latency regression or error increase");
  plan.steps.push("Rollback deploy or disable feature flag");
  plan.validationAfterRollback.push("Confirm metrics return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Service health: latency, errors, saturation, dependency health");
  plan.alerts.push("Alert on SLO burn or sustained 5xx increase");
  plan.logs.push("Structured logs with correlation IDs and key decisions");
  plan.traces.push("Distributed traces for critical request paths");
  plan.runbooks.push("Service runbook: mitigate, rollback, validate");
  return plan;
};

export const defaultSloSketch = () => {
  const slo = sloSketchTemplate();
  slo.service = "spring_boot_service";
  slo.indicators.push("Availability for critical endpoints");
  slo.indicators.push("Latency p95 for critical endpoints");
  slo.objectives.push("Availability meets agreed target for critical endpoints");
  slo.objectives.push("Latency p95 meets agreed target for critical endpoints");
  slo.alerting.push("Multi-window burn-rate alerts tied to user impact");
  return slo;
};

export const criteriaPack = () => [
  "Thread pools, timeouts, and retries are configured to avoid cascading failures",
  "API contracts and error model are explicit and tested",
  "Migration strategy is safe and rollbackable where applicable",
  "Observability includes correlation IDs, dashboards, alerts, and runbooks",
];

