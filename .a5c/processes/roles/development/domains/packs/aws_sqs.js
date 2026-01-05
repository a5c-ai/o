import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "aws_sqs",
  sections: [
    {
      title: "Queue Semantics And Contracts",
      prompts: [
        "Standard vs FIFO and the ordering/dedup expectations",
        "Message schema and versioning strategy",
        "Visibility timeout, long polling, and batching configuration",
      ],
    },
    {
      title: "Retries, DLQ, And Idempotency",
      prompts: [
        "Retry policy (max receives) and DLQ/redrive plan",
        "Idempotency strategy for consumers and safe retry semantics",
        "Poison message handling and replay procedures",
      ],
    },
    {
      title: "Scaling And Cost",
      prompts: [
        "Consumer concurrency model and autoscaling signals",
        "Backpressure and rate limiting under downstream saturation",
        "Cost guardrails (polling patterns, payload size)",
      ],
    },
    {
      title: "Security And Observability",
      prompts: [
        "IAM policies for producers/consumers and encryption settings",
        "Metrics/alerts: age of oldest, inflight, DLQ depth",
        "Rollout strategy and rollback triggers",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Visibility timeout too short causing duplicate processing",
  "No DLQ leading to infinite retries and backlog growth",
  "Poison messages causing hot loops and throttling",
  "Consumer scaling misconfig causing backlog and SLA misses",
  "Missing idempotency leading to data corruption on retries",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("SQS producers/consumers behave correctly with retries and DLQ");
  plan.invariants.push("Consumers are idempotent and can handle duplicates safely");
  plan.testPlan.integration.push("End-to-end enqueue -> process -> ack flow");
  plan.testPlan.integration.push("Poison message path (max receives -> DLQ) and replay");
  plan.checks.preDeploy.push("Verify visibility timeout, batch size, and long polling settings");
  plan.checks.preDeploy.push("Verify DLQ/redrive policy and runbook for replay");
  plan.checks.postDeploy.push("Monitor age of oldest message, inflight, and DLQ depth during rollout");
  plan.rollbackReadiness.push("Rollback plan can revert consumer deploy and pause producers if needed");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy consumers first with processing disabled or low concurrency");
  plan.plan.phases.push("Enable processing gradually and monitor queue metrics");
  plan.plan.guardrails.push("Age of oldest message, DLQ depth, error rate");
  plan.plan.abortSignals.push("Backlog growth or DLQ surge");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Backlog growth, DLQ surge, or data integrity issues");
  plan.steps.push("Roll back consumer deployment and reduce concurrency");
  plan.steps.push("Pause producers or route to safe fallback if possible");
  plan.validationAfterRollback.push("Confirm backlog drains and error rate normalizes");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("SQS: age of oldest, visible/inflight, receive/delete rates, DLQ depth");
  plan.alerts.push("Alert on age of oldest above threshold");
  plan.alerts.push("Alert on DLQ depth growth");
  plan.logs.push("Consumer logs include messageId, attempt count, and outcome");
  plan.runbooks.push("SQS runbook: pause consumer, replay DLQ, adjust visibility timeout");
  return plan;
};

export const criteriaPack = () => [
  "DLQ/redrive policy exists and replay is documented",
  "Visibility timeout and consumer idempotency are aligned and verified",
  "Scaling and observability cover backlog and failure modes",
];

