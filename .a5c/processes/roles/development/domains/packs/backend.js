import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate, sloSketchTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";
import { migrationPlanTemplate } from "../shared/migrations.js";

export const planningBreakdownTemplate = () => ({
  domain: "backend",
  sections: [
    {
      title: "API Surface And Contracts",
      prompts: [
        "What endpoints/events are added or changed (inputs/outputs/errors)?",
        "Authn/authz requirements and least-privilege access model",
        "Idempotency, pagination, rate limits, and caching needs",
      ],
    },
    {
      title: "Data Model And Invariants",
      prompts: [
        "What entities and invariants change? How are they enforced?",
        "Migration strategy (expand/contract) and rollback safety",
        "Consistency and concurrency behavior (transactions/locks/ordering)",
      ],
    },
    {
      title: "Failure Modes And Degradation",
      prompts: [
        "Timeouts/retries for dependencies, circuit breakers, fallbacks",
        "Partial failure behavior and user-visible errors",
        "Queue/job safety if background work is involved",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Dashboards and alerts for latency/error/saturation",
        "Runbooks and oncall readiness",
        "Rollout strategy (canary/flag) and abort signals",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Authorization bypass or privilege escalation",
  "Idempotency failure causing duplicated side effects",
  "Hot path latency regression or resource saturation",
  "Data inconsistency due to concurrent writes or partial failures",
  "Breaking API change causing client failures",
  "Retry storms or thundering herd on downstream dependencies",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("API behavior is correct and backward compatible where required");
  plan.invariants.push("Authz enforced for all sensitive actions");
  plan.invariants.push("Idempotency holds for retries and at-least-once delivery");
  plan.testPlan.unit.push("Business logic invariants and edge cases");
  plan.testPlan.integration.push("DB interactions and transactional behavior");
  plan.testPlan.contract.push("API contract tests (request/response/error shapes)");
  plan.checks.preDeploy.push("Load or latency sanity check for critical endpoints");
  plan.checks.postDeploy.push("Verify key metrics and error rates during rollout");
  plan.rolloutChecks.push("Canary checks include latency, errors, saturation, and correctness");
  plan.rollbackReadiness.push("Rollback procedure is documented and feasible under load");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained increase in error rate or user-impacting failures");
  plan.triggers.push("Sustained latency regression on critical endpoints");
  plan.steps.push("Revert deployment or disable feature flag");
  plan.steps.push("Disable or throttle background work if applicable");
  plan.dataRecovery.push("Assess data consistency; run compensating actions if required");
  plan.validationAfterRollback.push("Verify error/latency return to baseline");
  plan.validationAfterRollback.push("Verify core flows remain correct");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.goldenSignals.latency.push("Request latency p50/p95/p99 for critical endpoints");
  plan.goldenSignals.errors.push("5xx rate and domain-specific error codes");
  plan.goldenSignals.saturation.push("CPU/memory and connection pool saturation");
  plan.dashboards.push("API health: latency, errors, saturation, dependency health");
  plan.alerts.push("Alert on SLO burn or sustained 5xx increase");
  plan.logs.push("Structured logs for key decisions and authorization failures");
  plan.traces.push("Distributed traces for critical request paths");
  plan.runbooks.push("Backend incident runbook: mitigate, rollback, validate");
  return plan;
};

export const defaultSloSketch = () => {
  const slo = sloSketchTemplate();
  slo.service = "backend";
  slo.indicators.push("Availability for critical endpoints");
  slo.indicators.push("Latency p95 for critical endpoints");
  slo.objectives.push("Availability meets agreed target for critical endpoints");
  slo.objectives.push("Latency p95 meets agreed target for critical endpoints");
  slo.alerting.push("Multi-window burn-rate alerts tied to user impact");
  return slo;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Canary 1-5% for 15-30 minutes with guardrails");
  plan.plan.phases.push("Increase to 25-50% if stable, then 100%");
  plan.plan.guardrails.push("Error rate and latency on critical endpoints");
  plan.plan.abortSignals.push("Sustained 5xx increase or SLO burn");
  return plan;
};

export const defaultMigrationPlan = () => {
  const plan = migrationPlanTemplate();
  plan.changes.push("Describe schema change and compatibility approach");
  plan.backfillPlan.push("If needed: chunked, throttled, resumable backfill");
  plan.validation.push("Counts/invariants validation for migrated data");
  plan.rollback.push("Rollback schema and/or application versions safely");
  return plan;
};

export const criteriaPack = () => [
  "API contract and error shapes are explicit (compat, versioning where needed)",
  "Authn/authz is least-privilege and tested for negative cases",
  "Data model invariants and concurrency behavior are explicit",
  "Dependency failure handling is explicit (timeouts, retries/backoff, fallbacks)",
];
