import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "event_streaming",
  sections: [
    {
      title: "Event Contracts",
      prompts: [
        "Event types, schema evolution policy, and compatibility window",
        "Partitioning key and ordering guarantees required by consumers",
        "Idempotency strategy for at-least-once delivery",
      ],
    },
    {
      title: "Producers And Consumers",
      prompts: [
        "Producer retries/backoff and durability expectations",
        "Consumer group strategy, concurrency, and backpressure handling",
        "DLQ strategy and poison message handling",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Metrics: lag, throughput, retries, DLQ rate, processing latency",
        "Alerting and runbooks for lag growth and consumer failures",
        "Rollout sequencing for schema changes and new consumers",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Schema change breaks consumers without compatibility plan",
  "Bad partitioning causes hotspots or breaks ordering assumptions",
  "Consumer lag grows without alerting and causes downstream SLA breaches",
  "Poison messages block progress without DLQ handling",
  "Retry storms amplify outages across services",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Event flow is correct under retries, ordering, and schema evolution");
  plan.invariants.push("Consumers are idempotent and safe for at-least-once delivery");
  plan.testPlan.contract.push("Schema compatibility tests and negative cases");
  plan.testPlan.integration.push("End-to-end producer to consumer flow with retries and DLQ behavior");
  plan.checks.preDeploy.push("Verify partitioning key and ordering expectations");
  plan.checks.postDeploy.push("Monitor consumer lag, DLQ rate, and processing latency during rollout");
  plan.rollbackReadiness.push("Rollback plan includes disabling new consumer/producer changes safely");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy compatible schema and producer first");
  plan.plan.phases.push("Deploy consumers; gradually increase concurrency with guardrails");
  plan.plan.guardrails.push("Lag, DLQ rate, processing latency, error rates");
  plan.plan.abortSignals.push("Lag growth, DLQ spikes, or ordering/correctness regressions");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Lag growth, DLQ spikes, or correctness regressions");
  plan.steps.push("Reduce consumer concurrency or disable new consumer version");
  plan.steps.push("Revert producer changes if they increase volume or break contracts");
  plan.validationAfterRollback.push("Confirm lag drains and DLQ stabilizes");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Streaming: lag, throughput, retries, DLQ, processing latency");
  plan.alerts.push("Alert on lag growth, DLQ growth, or sustained processing errors");
  plan.runbooks.push("Streaming runbook: reduce concurrency, redrive DLQ, rollback, validate");
  return plan;
};

export const criteriaPack = () => [
  "Schema evolution and compatibility window are explicit and tested",
  "Partitioning and ordering assumptions are explicit and validated",
  "Lag/DLQ observability and runbooks exist before scaling up consumers",
];

