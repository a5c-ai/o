import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "gcp_pubsub",
  sections: [
    {
      title: "Subscription Model",
      prompts: [
        "Push vs pull subscriptions and delivery guarantees expected",
        "Ack deadline and lease extension behavior; max outstanding settings",
        "Ordering keys usage and impact on throughput",
      ],
    },
    {
      title: "Retries And Dead Lettering",
      prompts: [
        "Retry behavior and idempotency strategy for consumers",
        "Dead letter topic and max delivery attempts configuration",
        "Replay strategy for DLQ/backlog and safe backfill steps",
      ],
    },
    {
      title: "Security And Compliance",
      prompts: [
        "IAM roles for publishers/subscribers and service accounts",
        "Encryption and data sensitivity considerations",
        "Audit/logging requirements and retention",
      ],
    },
    {
      title: "Observability And Operations",
      prompts: [
        "Metrics/alerts: oldest unacked age, throughput, NACKs, DLQ depth",
        "Rollout plan and rollback triggers",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Ack deadline too short causing redelivery and duplicates",
  "Ordering keys misused causing unexpected throughput collapse",
  "No DLQ leading to infinite redelivery and backlog growth",
  "Consumer not idempotent causing data corruption on duplicates",
  "Push subscription endpoint instability causing delivery storms",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Pub/Sub consumers handle retries, duplicates, and DLQ safely");
  plan.invariants.push("Processing is idempotent and ordering assumptions are explicit");
  plan.testPlan.integration.push("Publish -> consume -> ack path under normal conditions");
  plan.testPlan.integration.push("Induce failure and verify redelivery and DLQ behavior");
  plan.checks.preDeploy.push("Verify ack deadlines and retry/DLQ config");
  plan.checks.postDeploy.push("Monitor oldest unacked age and DLQ depth during rollout");
  plan.rollbackReadiness.push("Rollback plan can revert consumer deploy and pause publishing if needed");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy consumer with low concurrency and validate metrics");
  plan.plan.phases.push("Increase concurrency gradually with guardrails");
  plan.plan.guardrails.push("Oldest unacked age, error rate, DLQ depth");
  plan.plan.abortSignals.push("Backlog growth or DLQ surge");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Backlog growth, DLQ surge, or data integrity issues");
  plan.steps.push("Roll back consumer deployment and reduce concurrency");
  plan.steps.push("Pause publishing or route to safe fallback if possible");
  plan.validationAfterRollback.push("Confirm backlog drains and error rate normalizes");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Pub/Sub: oldest unacked age, throughput, ack/nack rates, DLQ depth");
  plan.alerts.push("Alert on oldest unacked age above threshold");
  plan.alerts.push("Alert on DLQ depth growth");
  plan.logs.push("Consumer logs include messageId (or key), delivery attempt, outcome");
  plan.runbooks.push("Pub/Sub runbook: pause consumer, replay DLQ, adjust ack deadline");
  return plan;
};

export const criteriaPack = () => [
  "Ack deadline and concurrency settings match processing time and variability",
  "DLQ and replay strategy exists and is documented",
  "Ordering key usage is explicit and validated against throughput needs",
];

