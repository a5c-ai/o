import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "nestjs_service",
  sections: [
    {
      title: "Module Boundaries And DI",
      prompts: [
        "Which modules/providers change and what are their responsibilities?",
        "Any provider scope changes (singleton vs request) and lifecycle concerns?",
        "Any circular dependency risk and how to avoid it?",
      ],
    },
    {
      title: "Controllers, Pipes, Guards, Interceptors",
      prompts: [
        "Controllers and DTOs affected; validation pipeline (pipes)",
        "Authn/authz rules (guards) and rate limiting if applicable",
        "Interceptors/filters for logging, errors, and response shaping",
      ],
    },
    {
      title: "Testing Strategy",
      prompts: [
        "Unit tests for providers and pure logic",
        "E2E tests using Nest testing module and real HTTP stack",
        "Mocking boundaries vs integration coverage for dependencies",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Configuration and secrets; env validation and defaults",
        "Health checks and readiness; dependency checks where appropriate",
        "Metrics/logging/tracing and rollout/rollback plan",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "DI misconfiguration causing runtime injection errors",
  "Request-scoped provider misuse causing memory growth or performance issues",
  "Global pipe/guard changes breaking endpoints unexpectedly",
  "Exception filter mismatch leaking internal errors or wrong status codes",
  "E2E tests missing critical wiring issues (interceptors/guards)",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("NestJS module wiring and endpoint behavior are correct");
  plan.invariants.push("DTO validation and authz rules hold across endpoints");
  plan.testPlan.unit.push("Provider unit tests for core business logic");
  plan.testPlan.e2e.push("E2E tests for critical routes including auth and validation");
  plan.checks.preDeploy.push("Verify module imports/exports and provider scopes");
  plan.checks.postDeploy.push("Monitor injection errors and per-route 5xx during rollout");
  plan.rollbackReadiness.push("Rollback path is ready (revert deploy or disable flag)");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy and validate health checks and E2E smoke");
  plan.plan.phases.push("Increase traffic gradually with per-route guardrails");
  plan.plan.guardrails.push("Injection errors, 5xx, and latency for key endpoints");
  plan.plan.abortSignals.push("Sustained injection errors or 5xx increase");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Injection errors, authz regressions, or sustained 5xx increase");
  plan.steps.push("Roll back deployment to previous version");
  plan.validationAfterRollback.push("Confirm health checks pass and errors normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("NestJS API: request rate, latency, errors per controller");
  plan.alerts.push("Alert on injection/runtime errors and 5xx spikes");
  plan.logs.push("Structured logs with requestId, route, controller, status");
  plan.traces.push("Trace request flow through interceptors and downstream calls");
  plan.runbooks.push("NestJS rollback runbook: revert deploy, validate health");
  return plan;
};

export const criteriaPack = () => [
  "Module boundaries and DI wiring are explicit and avoid circular dependencies",
  "Validation (pipes) and authz (guards) are correct and tested",
  "Exception filters and logging/telemetry behave consistently",
];

