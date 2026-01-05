import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "azure_servicebus",
  sections: [
    {
      title: "Entity Model And Semantics",
      prompts: [
        "Queue vs topic/subscription and fanout expectations",
        "Sessions/ordering needs and duplicate detection policy",
        "Lock duration, max delivery count, and message TTL",
      ],
    },
    {
      title: "Retries, Dead Lettering, And Idempotency",
      prompts: [
        "Dead-letter conditions and replay process",
        "Idempotency strategy for consumers and safe retry semantics",
        "Backpressure behavior under downstream saturation",
      ],
    },
    {
      title: "Security And Operations",
      prompts: [
        "Auth model (RBAC/SAS) and least-privilege access for apps",
        "Monitoring: active/dead-lettered messages, lock lost, throttles",
        "Rollout and rollback plan",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Lock duration too short causing lock lost and duplicate processing",
  "No DLQ workflow leading to backlog and repeated failures",
  "Session misconfiguration causing ordering violations or throughput collapse",
  "Consumer scaling misconfig causing backlog and SLA misses",
  "Missing idempotency causing data corruption on retries",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Service Bus consumers handle retries, duplicates, and DLQ safely");
  plan.invariants.push("Processing is idempotent and lock semantics are respected");
  plan.testPlan.integration.push("End-to-end send -> receive -> complete flow");
  plan.testPlan.integration.push("Poison message -> DLQ path and replay");
  plan.checks.preDeploy.push("Verify lock duration, max delivery count, and TTL settings");
  plan.checks.postDeploy.push("Monitor active messages, DLQ depth, and lock lost during rollout");
  plan.rollbackReadiness.push("Rollback plan can revert consumer deploy and pause producers if needed");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy consumers first and validate telemetry");
  plan.plan.phases.push("Increase concurrency gradually with guardrails");
  plan.plan.guardrails.push("DLQ depth, lock lost, processing error rate");
  plan.plan.abortSignals.push("DLQ growth or lock lost spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("DLQ growth, lock lost spike, or data integrity issues");
  plan.steps.push("Roll back consumer deployment and reduce concurrency");
  plan.steps.push("Pause producers or route to safe fallback if possible");
  plan.validationAfterRollback.push("Confirm backlog drains and error rate normalizes");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Service Bus: active messages, DLQ depth, lock lost, errors");
  plan.alerts.push("Alert on DLQ depth growth");
  plan.alerts.push("Alert on lock lost spike");
  plan.logs.push("Consumer logs include messageId, delivery count, and outcome");
  plan.runbooks.push("Service Bus runbook: pause consumer, replay DLQ, adjust lock duration");
  return plan;
};

export const criteriaPack = () => [
  "DLQ handling and replay procedure exist and are documented",
  "Lock duration and delivery count settings align with processing time",
  "Sessions/ordering and duplicate handling are explicit and verified",
];

