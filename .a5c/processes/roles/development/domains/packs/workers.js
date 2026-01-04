import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "workers",
  sections: [
    {
      title: "Job Semantics",
      prompts: [
        "Idempotency key and deduplication strategy",
        "Ordering and concurrency expectations",
        "Visibility into job state and progress checkpoints",
      ],
    },
    {
      title: "Retry And Failure Handling",
      prompts: [
        "Retry policy (max attempts, backoff, jitter) and timeout policy",
        "DLQ strategy and redrive policy for poison messages",
        "Compensating actions and partial failure handling",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Metrics: queue depth, processing latency, retries, DLQ rate",
        "Alerts and runbooks for stuck jobs and backlog growth",
        "Safe deploy strategy for workers (drain, rolling, version skew)",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Duplicate processing due to missing idempotency",
  "Retry storms causing downstream overload",
  "Poison messages stuck without DLQ handling",
  "Unbounded concurrency leading to resource exhaustion",
  "Jobs stuck without visibility or progress checkpoints",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Jobs are correct under retries, timeouts, and partial failures");
  plan.invariants.push("Idempotency holds for at-least-once delivery");
  plan.testPlan.integration.push("Worker processes representative jobs end-to-end");
  plan.testPlan.contract.push("Message payload contract tests and negative cases");
  plan.checks.preDeploy.push("Verify retry and DLQ configuration");
  plan.checks.postDeploy.push("Monitor backlog, retry rate, and processing latency");
  plan.rolloutChecks.push("Canary verifies no DLQ growth and stable processing times");
  plan.rollbackReadiness.push("Rollback includes draining/pausing workers safely");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Canary a small subset of workers or queues first");
  plan.plan.phases.push("Increase worker pool gradually with guardrails");
  plan.plan.guardrails.push("Backlog depth, processing latency, retries, DLQ rate");
  plan.plan.abortSignals.push("Sustained DLQ growth or backlog increase");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained DLQ growth or backlog increase");
  plan.steps.push("Scale down or pause new worker version");
  plan.steps.push("Revert worker deployment to previous version");
  plan.validationAfterRollback.push("Confirm backlog drains and DLQ stabilizes");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Worker health: backlog, latency, retries, DLQ, throughput");
  plan.alerts.push("Alert on backlog age, DLQ growth, or sustained retry spikes");
  plan.logs.push("Structured job logs with job IDs and correlation IDs");
  plan.runbooks.push("Worker runbook: pause, rollback, drain backlog, validate");
  return plan;
};

export const criteriaPack = () => [
  "Idempotency is explicit and tested for retries and at-least-once delivery",
  "Retry/backoff policy and DLQ strategy are explicit; poison messages handled",
  "Concurrency/ordering/scheduling constraints are explicit and validated",
  "Operational signals exist (queue depth, retries, DLQ rate, processing latency)",
];
