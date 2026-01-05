import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "aws_eventbridge",
  sections: [
    {
      title: "Event Contracts And Routing",
      prompts: [
        "Event schema (detail-type/source/detail) and versioning strategy",
        "Routing rules and matching patterns; any cross-account routing?",
        "Target selection and permissions (IAM, resource policies)",
      ],
    },
    {
      title: "Retries, DLQ, And Replay",
      prompts: [
        "Retry behavior and target error handling expectations",
        "DLQ configuration (SQS) and replay/backfill strategy",
        "Event archive and replay (if used) and retention",
      ],
    },
    {
      title: "Idempotency And Ordering",
      prompts: [
        "Idempotency expectations for consumers and duplicate event handling",
        "Any ordering assumptions and how to avoid relying on them",
      ],
    },
    {
      title: "Observability And Operations",
      prompts: [
        "Monitoring: rule match counts, failed invocations, target errors",
        "Rollout approach (shadow rule, canary target) and rollback steps",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Rule pattern mismatch causing silent drops or misroutes",
  "Permission errors preventing target delivery",
  "Target throttling causing retries and downstream load amplification",
  "Consumer not idempotent causing duplicate processing corruption",
  "Lack of replay strategy making recovery slow after outage",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("EventBridge rules route events correctly and targets receive them safely");
  plan.invariants.push("Consumers tolerate duplicates and handle failures with DLQ/replay");
  plan.testPlan.integration.push("Emit sample events and verify rule match and target delivery");
  plan.testPlan.integration.push("Induce target failure and verify retries and DLQ behavior");
  plan.checks.preDeploy.push("Verify rule patterns with representative samples");
  plan.checks.preDeploy.push("Verify permissions for event bus, rule, and targets");
  plan.checks.postDeploy.push("Monitor failed invocations and DLQ depth during rollout");
  plan.rollbackReadiness.push("Rollback can disable new rules/targets and replay DLQ safely");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "feature-flag";
  plan.plan.phases.push("Create shadow rule/target to validate routing without user impact");
  plan.plan.phases.push("Enable primary rule for small subset or limited sources");
  plan.plan.phases.push("Expand routing gradually with guardrails");
  plan.plan.guardrails.push("Failed invocations and target error rate");
  plan.plan.abortSignals.push("DLQ growth or sustained target failures");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Misrouting, target failures, or DLQ growth");
  plan.steps.push("Disable or remove new rules/targets");
  plan.steps.push("Replay DLQ to known-good target if needed");
  plan.validationAfterRollback.push("Confirm events route correctly and failures stop");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("EventBridge: matched events, failed invocations, target errors");
  plan.alerts.push("Alert on sustained failed invocations");
  plan.alerts.push("Alert on DLQ depth growth for EventBridge targets");
  plan.runbooks.push("EventBridge runbook: disable rule, fix target permissions, replay DLQ");
  return plan;
};

export const criteriaPack = () => [
  "Event schema and routing rules are explicit and validated with samples",
  "DLQ/replay strategy exists and consumers handle duplicates safely",
  "Permissions and target failure modes are monitored with actionable alerts",
];

