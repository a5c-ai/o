import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "flask_service",
  sections: [
    {
      title: "App Structure And Configuration",
      prompts: [
        "App factory pattern or global app? What changes and why?",
        "Configuration sources (env, files) and validation of required settings",
        "Extension initialization order (db, auth, caching, tracing)",
      ],
    },
    {
      title: "Request Lifecycle",
      prompts: [
        "Routes and blueprints affected; request/response formats",
        "Before/after request hooks and error handlers",
        "WSGI vs ASGI deployment expectations and concurrency model",
      ],
    },
    {
      title: "Security And Data Handling",
      prompts: [
        "Authn/authz approach; CSRF handling if browser-based",
        "Input validation and output encoding where relevant",
        "Secrets management and safe logging (no PII leakage)",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Health checks and readiness; dependency probes if needed",
        "Logging/metrics/tracing for routes and failures",
        "Rollout plan and rollback triggers",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Global mutable state causing cross-request leakage under concurrency",
  "Missing error handlers leading to inconsistent status codes",
  "WSGI/ASGI mismatch causing unexpected behavior in production",
  "Input validation gaps causing 500s or security issues",
  "Missing timeouts for downstream calls leading to request pileups",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Flask endpoints behave correctly under the expected deployment model");
  plan.invariants.push("Error handling is consistent and avoids sensitive data leaks");
  plan.testPlan.integration.push("Route tests for status codes, authz outcomes, and validation");
  plan.testPlan.integration.push("Negative tests for invalid inputs and boundary values");
  plan.checks.preDeploy.push("Verify error handlers are registered and config validation runs");
  plan.checks.postDeploy.push("Monitor 5xx and latency for changed endpoints during rollout");
  plan.rollbackReadiness.push("Rollback reverts deploy and validates critical routes");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Deploy to canary and run smoke checks");
  plan.plan.phases.push("Increase traffic gradually with guardrails");
  plan.plan.guardrails.push("5xx rate and p95 latency for key endpoints");
  plan.plan.abortSignals.push("Sustained 5xx increase or latency regression");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained 5xx increase or incorrect responses for key routes");
  plan.steps.push("Roll back to previous version");
  plan.validationAfterRollback.push("Confirm key routes recover and metrics normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Flask API: RPS, latency, 4xx/5xx per route");
  plan.alerts.push("Alert on sustained 5xx increase for key endpoints");
  plan.logs.push("Request logs with requestId, route, status, latency");
  plan.traces.push("Trace critical request path and downstream calls");
  plan.runbooks.push("Rollback runbook: revert deploy, validate smoke checks");
  return plan;
};

export const criteriaPack = () => [
  "App structure and configuration are explicit and validated",
  "Request lifecycle hooks and error handlers are correct and tested",
  "Deployment model assumptions (WSGI/ASGI, concurrency) are documented and verified",
];

