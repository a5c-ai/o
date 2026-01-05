import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "rust_service",
  sections: [
    {
      title: "API And Runtime",
      prompts: [
        "Which endpoints and contracts change?",
        "Async runtime choice and any blocking risks on async threads",
        "Error types and mapping to user-visible responses",
      ],
    },
    {
      title: "State And Concurrency",
      prompts: [
        "Shared state ownership model and synchronization strategy",
        "Connection pooling and client reuse for dependencies",
        "Backpressure and request limits under load",
      ],
    },
    {
      title: "Testing And Verification",
      prompts: [
        "Unit tests for core logic and error handling",
        "Integration tests for handlers and downstream calls",
        "Load or perf checks if the change is performance-sensitive",
      ],
    },
    {
      title: "Observability And Operations",
      prompts: [
        "Tracing spans and log fields; correlation IDs",
        "Metrics for latency, errors, and saturation/backpressure",
        "Rollout and rollback plan with abort signals",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Blocking work on async threads causing latency spikes",
  "Error mapping mistakes leaking internal details or wrong status codes",
  "Shared state deadlocks or contention under load",
  "Unbounded buffering leading to memory growth",
  "Missing tracing spans making incidents hard to debug",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Rust service changes are correct, safe, and observable");
  plan.invariants.push("Error mapping is consistent and avoids sensitive leaks");
  plan.testPlan.unit.push("Unit tests for error paths and boundary conditions");
  plan.testPlan.integration.push("Integration tests for key routes and dependencies");
  plan.checks.preDeploy.push("Verify no blocking operations on async runtime threads");
  plan.checks.postDeploy.push("Monitor latency, errors, and memory during rollout");
  plan.rollbackReadiness.push("Rollback reverts deploy and confirms health checks");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Deploy canary and validate health and telemetry");
  plan.plan.phases.push("Progressively increase traffic with guardrails");
  plan.plan.guardrails.push("p95 latency, 5xx, memory, and saturation indicators");
  plan.plan.abortSignals.push("Latency spike, memory growth, or sustained error increase");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Latency spike, memory growth, or sustained error increase");
  plan.steps.push("Roll back to previous version");
  plan.validationAfterRollback.push("Confirm health checks pass and telemetry normalizes");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Rust service: latency, errors, RPS, memory, saturation/backpressure");
  plan.alerts.push("Alert on sustained error rate or latency regression");
  plan.logs.push("Structured logs with requestId, route, status, latency");
  plan.traces.push("Tracing spans for handlers and downstream calls");
  plan.runbooks.push("Rollback runbook: revert deploy, verify memory/latency stabilize");
  return plan;
};

export const criteriaPack = () => [
  "Async runtime usage avoids blocking and handles backpressure",
  "Error types and mapping are consistent and tested",
  "Telemetry includes traces/metrics for critical paths and failures",
];

