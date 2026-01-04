import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "azure_functions",
  sections: [
    {
      title: "Triggers And Contracts",
      prompts: [
        "Trigger types (HTTP, queue, timer, event) and payload contracts",
        "Idempotency and deduplication strategy for at-least-once delivery",
        "Timeouts, retries, and backoff behavior per trigger",
      ],
    },
    {
      title: "Security And Access",
      prompts: [
        "Identity model (managed identity) and least-privilege access",
        "Secrets management and configuration sources",
        "Inbound exposure and abuse prevention for HTTP triggers",
      ],
    },
    {
      title: "Reliability And Performance",
      prompts: [
        "Concurrency settings and throttling behavior",
        "Cold start impact and mitigation strategy",
        "Downstream dependency timeouts and circuit breakers",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Monitoring: function failures, retries, queue depth, latency",
        "Alerting and runbooks for stuck backlogs and poison messages",
        "Rollout and rollback: slots, staged deploys, disable triggers",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Retry amplification overloads downstream dependencies",
  "Poison messages block progress without DLQ strategy",
  "Managed identity permissions misconfigured causing failures or exposure",
  "Cold starts cause latency spikes and timeouts",
  "Trigger contract change breaks producers/consumers",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Functions behave correctly under retries, throttling, and partial failures");
  plan.invariants.push("Idempotency holds for at-least-once delivery");
  plan.testPlan.contract.push("Payload contract tests and negative cases");
  plan.testPlan.integration.push("End-to-end flow with retries and DLQ behavior");
  plan.checks.preDeploy.push("Permissions review for managed identity and secrets");
  plan.checks.postDeploy.push("Monitor failures, retries, and backlog metrics during rollout");
  plan.rollbackReadiness.push("Rollback includes slot swap reversion and disabling triggers if needed");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Deploy to slot and route small traffic first (if HTTP)");
  plan.plan.phases.push("Increase traffic gradually with guardrails");
  plan.plan.guardrails.push("Failures, retries, timeouts, backlog depth/age");
  plan.plan.abortSignals.push("Sustained failure increase or backlog growth");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained failure increase or backlog growth");
  plan.steps.push("Swap back to previous slot or redeploy previous version");
  plan.steps.push("Disable triggers/event sources if needed to stop damage");
  plan.validationAfterRollback.push("Confirm backlog drains and failures return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Functions: failures, retries, latency, timeouts");
  plan.dashboards.push("Queues/events: backlog depth/age, DLQ, processing latency");
  plan.alerts.push("Alert on sustained failures, timeouts, or backlog growth");
  plan.runbooks.push("Functions runbook: disable triggers, rollback, drain backlog, validate");
  return plan;
};

export const criteriaPack = () => [
  "Triggers and payload contracts are explicit; idempotency is defined and tested",
  "Retry/backoff and DLQ strategy exist to handle poison messages safely",
  "Identity and secrets management are least-privilege and reviewed",
  "Rollout/rollback via slots and disable-trigger actions are documented",
];

