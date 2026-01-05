import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "express_service",
  sections: [
    {
      title: "Routing And Middleware",
      prompts: [
        "Which routes change and what is the request/response shape?",
        "Middleware order: auth, logging, validation, rate limiting, error handling",
        "Any streaming, file upload, or long-polling behaviors?",
      ],
    },
    {
      title: "Validation And Auth",
      prompts: [
        "Input validation strategy (schema, types, defaults, rejected inputs)",
        "Authentication and authorization checks per route",
        "Any tenant scoping or object-level access rules?",
      ],
    },
    {
      title: "Error Handling And Reliability",
      prompts: [
        "Error model: which errors map to which status codes and bodies?",
        "Timeouts, retries (if calling downstream), and cancellation behavior",
        "Idempotency for unsafe operations and safe retry semantics",
      ],
    },
    {
      title: "Observability And Operations",
      prompts: [
        "Logging fields and correlation IDs; PII redaction",
        "Metrics: request rate, latency, errors per route, downstream dependencies",
        "Rollout plan (flag/canary) and rollback triggers",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Middleware order bug causing authz bypass or missing validation",
  "Unhandled async errors leading to process instability",
  "Missing timeouts causing request pileups under partial outage",
  "Incorrect status code mapping causing clients to retry unsafely",
  "Log/trace gaps making incidents hard to diagnose",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Express routes behave correctly with validation and auth");
  plan.invariants.push("Error responses are consistent and do not leak sensitive data");
  plan.testPlan.integration.push("Route-level tests for status codes, bodies, and authz outcomes");
  plan.testPlan.integration.push("Negative tests for invalid inputs and boundary values");
  plan.checks.preDeploy.push("Verify middleware order and error handler registration");
  plan.checks.postDeploy.push("Monitor per-route 5xx and latency during rollout");
  plan.rollbackReadiness.push("Rollback disables feature flag or reverts deploy cleanly");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Deploy to canary and validate per-route metrics");
  plan.plan.phases.push("Progressively increase traffic with guardrails");
  plan.plan.guardrails.push("Route 5xx and p95 latency for changed endpoints");
  plan.plan.abortSignals.push("Sustained 5xx increase or latency regression");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained 5xx increase or incorrect responses for key routes");
  plan.steps.push("Roll back to previous version or disable feature flag");
  plan.validationAfterRollback.push("Confirm key routes recover and metrics normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Express API: RPS, latency, 4xx/5xx per route");
  plan.alerts.push("Alert on sustained 5xx increase for key routes");
  plan.logs.push("Structured request logs with requestId, route, status, latency");
  plan.traces.push("Trace the critical request path including downstream calls");
  plan.runbooks.push("Rollback runbook: revert deploy or disable flag");
  return plan;
};

export const criteriaPack = () => [
  "Routes and middleware order are explicit and tested",
  "Validation and authz behavior is correct and consistent",
  "Error handling includes timeouts and safe retries for downstream calls",
];

