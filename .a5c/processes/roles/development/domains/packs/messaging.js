import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "messaging",
  sections: [
    {
      title: "Messaging Pattern Selection",
      prompts: [
        "Is this a queue, pub/sub topic, event bus, or stream (and why)?",
        "Delivery guarantees required (at-most-once/at-least-once/exactly-once semantics)",
        "Ordering guarantees needed and how they are enforced",
      ],
    },
    {
      title: "Contracts And Compatibility",
      prompts: [
        "Message/event schema and evolution policy (compat window, versioning)",
        "Idempotency strategy and deduplication keys",
        "Routing rules, filtering, and fanout needs",
      ],
    },
    {
      title: "Retries, Backpressure, And DLQs",
      prompts: [
        "Producer retry/backoff and consumer concurrency model",
        "Backpressure strategy (rate limits, batching, circuit breakers)",
        "DLQ/redrive plan and poison message handling",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Observability: lag/backlog, throughput, error rate, retries, DLQ growth",
        "Rollout/rollback strategy for schema and consumer/producer changes",
        "Runbooks for lag incidents, retries storms, and redrive operations",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Schema change breaks consumers without compatibility plan",
  "Retry storms amplify outages across producers/consumers",
  "Poison messages block progress without DLQ/redrive handling",
  "Ordering assumptions break and cause correctness regressions",
  "Consumer lag grows without alerting and impacts SLAs",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Messaging flow is correct under retries, backpressure, and schema evolution");
  plan.invariants.push("Consumers are idempotent and safe for at-least-once delivery");
  plan.testPlan.contract.push("Schema compatibility tests and negative cases");
  plan.testPlan.integration.push("End-to-end producer to consumer flow with retries and DLQ behavior");
  plan.checks.preDeploy.push("Verify ordering/dedup assumptions and partition/routing strategy");
  plan.checks.postDeploy.push("Monitor backlog/lag, retries, error rate, and DLQ growth during rollout");
  plan.rollbackReadiness.push("Rollback includes disabling new consumers/producers safely and redrive plan");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy compatible schema and producer changes first");
  plan.plan.phases.push("Deploy consumers; gradually increase concurrency with guardrails");
  plan.plan.guardrails.push("Lag/backlog, DLQ rate, processing latency, error rates");
  plan.plan.abortSignals.push("Lag growth, DLQ spikes, or ordering/correctness regressions");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Lag growth, DLQ spikes, or correctness regressions");
  plan.steps.push("Reduce consumer concurrency or disable new consumer version");
  plan.steps.push("Revert producer/schema changes that increased volume or broke contracts");
  plan.validationAfterRollback.push("Confirm backlog drains and DLQ stabilizes");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Messaging: backlog/lag, throughput, retries, DLQ, processing latency");
  plan.alerts.push("Alert on lag/backlog growth, DLQ growth, or sustained processing errors");
  plan.runbooks.push("Messaging runbook: reduce concurrency, redrive DLQ, rollback, validate");
  return plan;
};

export const criteriaPack = () => [
  "Messaging pattern and delivery/order guarantees are explicit and validated",
  "Schema evolution and idempotency are tested for at-least-once delivery",
  "Backpressure/DLQ strategy exists with observability and runbooks",
];

