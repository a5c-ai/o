import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "stripe_integration",
  sections: [
    {
      title: "Payment Flows And Objects",
      prompts: [
        "Which Stripe objects are used (PaymentIntent, SetupIntent, Charge, Subscription, Invoice)?",
        "Idempotency keys for all write operations and retry behavior",
        "Edge cases: partial payments, disputes, refunds, cancellations",
      ],
    },
    {
      title: "Webhooks And Security",
      prompts: [
        "Webhook event types and handler idempotency strategy",
        "Signature verification, replay protection, and secret rotation",
        "PII handling and logging/redaction policy",
      ],
    },
    {
      title: "Reconciliation And Correctness",
      prompts: [
        "Source of truth and reconciliation strategy (Stripe vs internal ledger)",
        "Handling out-of-order events and eventual consistency",
        "Backfills and recovery procedures for missing events",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Monitoring: webhook success rate, processing lag, retries, DLQ/backlog",
        "Runbooks for Stripe outages and webhook delivery issues",
        "Rollout plan and abort signals; rollback plan",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Double-charging due to missing idempotency keys or retry handling bugs",
  "Webhook signature verification missing or incorrect",
  "Out-of-order events cause inconsistent internal state",
  "Webhook backlog grows without alerting; customers see delays",
  "Sensitive payment data leaks into logs or analytics",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Stripe integration is correct, secure, and resilient to retries and webhook delivery patterns");
  plan.invariants.push("Idempotency holds for all write operations and webhook handlers");
  plan.testPlan.contract.push("Contract tests for webhook payload shapes and signature verification");
  plan.testPlan.integration.push("End-to-end flow in Stripe test mode (charges, refunds, subscription changes)");
  plan.checks.preDeploy.push("Verify signature verification and secret rotation plan");
  plan.checks.preDeploy.push("Verify reconciliation strategy and recovery/backfill procedures");
  plan.checks.postDeploy.push("Monitor webhook processing lag and error rate during rollout");
  plan.rollbackReadiness.push("Rollback plan includes disabling new flows and safe recovery of in-flight payments");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "feature-flag";
  plan.plan.phases.push("Enable for internal accounts first; validate end-to-end");
  plan.plan.phases.push("Gradually expand cohort with guardrails");
  plan.plan.guardrails.push("Payment success rate, webhook lag, error rate, duplicate detection");
  plan.plan.abortSignals.push("Duplicate charges, webhook failures, or backlog growth");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Duplicate charges, webhook failures, or backlog growth");
  plan.steps.push("Disable feature flag and revert to previous flow");
  plan.dataRecovery.push("Reconcile impacted payments; issue refunds if required");
  plan.validationAfterRollback.push("Confirm webhook lag stabilizes and payment success rate recovers");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Payments: success rate, declines, refunds, dispute rate");
  plan.dashboards.push("Webhooks: delivery success, processing lag, retries, DLQ/backlog");
  plan.alerts.push("Alert on webhook backlog growth or signature verification failures");
  plan.alerts.push("Alert on duplicate charge detection or payment success rate drops");
  plan.runbooks.push("Stripe runbook: disable flag, reconcile, communicate, validate");
  return plan;
};

export const criteriaPack = () => [
  "Idempotency keys are used for all Stripe writes; webhook handlers are idempotent",
  "Webhook signature verification and replay protection are implemented and tested",
  "Reconciliation and recovery/backfill strategy is explicit for missing/out-of-order events",
  "Monitoring includes webhook lag/backlog and payment success guardrails with runbooks",
];

