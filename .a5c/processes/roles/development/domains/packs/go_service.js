import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "go_service",
  sections: [
    {
      title: "API And Handlers",
      prompts: [
        "Endpoints and request/response contracts that change",
        "Context propagation for deadlines and cancellation",
        "Input validation and error mapping conventions",
      ],
    },
    {
      title: "Concurrency And Resource Safety",
      prompts: [
        "Goroutine lifetimes and shutdown behavior",
        "Connection pooling and client reuse for dependencies",
        "Timeouts/retries for downstream calls and how they compose",
      ],
    },
    {
      title: "Testing",
      prompts: [
        "Unit tests for pure logic and helpers",
        "Integration tests for HTTP handlers and dependencies",
        "Race detector and leak checks where applicable",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Structured logging and trace propagation",
        "Health/readiness checks and graceful shutdown",
        "Rollout plan and rollback triggers",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Context not propagated causing requests to ignore timeouts and cancellation",
  "Goroutine leaks under error paths or timeouts",
  "Retry storms due to unbounded retries or missing jitter/backoff",
  "Improper connection reuse causing resource exhaustion",
  "Missing graceful shutdown causing dropped in-flight requests",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Go service changes preserve correctness and resource safety");
  plan.invariants.push("Requests honor deadlines and cancellation");
  plan.testPlan.unit.push("Unit tests for business logic and helpers");
  plan.testPlan.integration.push("Handler tests for status codes and error mapping");
  plan.checks.preDeploy.push("Run race detector where feasible");
  plan.checks.preDeploy.push("Verify timeouts and client reuse are configured");
  plan.checks.postDeploy.push("Monitor latency, errors, and saturation during rollout");
  plan.rollbackReadiness.push("Rollback reverts deploy and validates key routes");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy canary, run smoke checks, validate resource metrics");
  plan.plan.phases.push("Increase traffic gradually with guardrails");
  plan.plan.guardrails.push("p95 latency, 5xx, and CPU/memory under load");
  plan.plan.abortSignals.push("Sustained latency regression or resource saturation");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Latency regression, saturation, or sustained error increase");
  plan.steps.push("Roll back to previous version");
  plan.validationAfterRollback.push("Confirm metrics normalize and smoke checks pass");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Go service: latency, errors, RPS, CPU/memory, goroutines");
  plan.alerts.push("Alert on sustained error rate or latency regression");
  plan.logs.push("Structured logs with requestId, route, status, latency");
  plan.traces.push("Distributed tracing with context propagation");
  plan.runbooks.push("Rollback runbook: revert deploy, verify saturation clears");
  return plan;
};

export const criteriaPack = () => [
  "Context, timeouts, and cancellation are used consistently",
  "Concurrency is safe (no goroutine leaks) with graceful shutdown",
  "Error mapping and retry behavior are explicit and tested",
];

