import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "integration",
  sections: [
    {
      title: "Contracts And Versioning",
      prompts: [
        "What is the contract (schema, fields, error handling, status codes)?",
        "Compatibility window and versioning strategy",
        "Consumer expectations and rollout sequencing",
      ],
    },
    {
      title: "Failure Handling And Safety",
      prompts: [
        "Timeouts, retries, backoff/jitter, and circuit breakers",
        "Rate limits and backpressure behavior",
        "Idempotency and dedup for webhooks/events",
      ],
    },
    {
      title: "Security",
      prompts: [
        "Webhook verification (signatures), replay protection, allowlists",
        "Secrets handling and rotation; avoid logging sensitive payloads",
        "Partner risk and least-privilege access",
      ],
    },
    {
      title: "Testing And Operability",
      prompts: [
        "Sandbox/test harness and contract tests",
        "Observability: logs/metrics/traces for integration flows",
        "Runbook for partner outages and partial failure modes",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Breaking contract change causing partner failures",
  "Retry storms amplifying partner or downstream outages",
  "Webhook signature verification missing or incorrect",
  "Replay attacks or duplicate deliveries without idempotency",
  "Silent partial failures without observability or alerting",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Integration contract is correct, stable, and secure");
  plan.invariants.push("Signature verification and replay protection works where applicable");
  plan.testPlan.contract.push("Contract tests for payload shapes and error cases");
  plan.testPlan.integration.push("Sandboxed end-to-end flow with retries and timeouts");
  plan.checks.preDeploy.push("Partner coordination and rollback plan confirmed where needed");
  plan.checks.postDeploy.push("Monitor integration success rate and partner error responses");
  plan.rollbackReadiness.push("Rollback includes contract compatibility or feature flag disable");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Enable for a limited set of partners/accounts first");
  plan.plan.phases.push("Expand partner set gradually with guardrails");
  plan.plan.guardrails.push("Success rate, latency, timeouts, partner error rates");
  plan.plan.abortSignals.push("Partner failures or sustained success rate degradation");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Partner failures or sustained success rate degradation");
  plan.steps.push("Disable integration feature flag or revert config");
  plan.steps.push("Fallback to previous contract or compatibility mode if available");
  plan.validationAfterRollback.push("Confirm partner success rate returns to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Integration health: success rate, latency, retries, timeouts");
  plan.alerts.push("Alert on sustained success rate drop or timeout spike");
  plan.logs.push("Structured logs with partner IDs and correlation IDs");
  plan.traces.push("Traces across integration boundaries where possible");
  plan.runbooks.push("Integration runbook: mitigate, rollback, partner comms, validate");
  return plan;
};

export const criteriaPack = () => [
  "Contracts and versioning strategy are explicit (schema, compatibility window)",
  "Timeouts/retries/circuit breakers are defined to avoid retry storms",
  "Webhook or partner security is addressed (signatures, replay protection, allowlists)",
  "Sandboxing/test harness exists for partner/integration verification",
];
