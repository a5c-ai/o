import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate, sloSketchTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "fastapi_service",
  sections: [
    {
      title: "API Surface And Contracts",
      prompts: [
        "Endpoint changes and response models; error shapes and status codes",
        "Auth dependencies and least-privilege enforcement",
        "Pagination, rate limits, and caching behavior (if relevant)",
      ],
    },
    {
      title: "Runtime And Concurrency Model",
      prompts: [
        "Async vs sync endpoints and blocking IO risks",
        "Worker/process model (uvicorn/gunicorn) and timeouts",
        "Dependency timeouts, retries, and circuit breakers",
      ],
    },
    {
      title: "Data And Migrations",
      prompts: [
        "ORM/raw SQL usage and transaction boundaries",
        "Migration strategy (expand/contract) and rollback",
        "Validation and data invariants",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Structured logging and correlation IDs",
        "Metrics and alerting (latency, 5xx, saturation)",
        "Rollout strategy and abort signals",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Blocking IO in async path causes event loop stalls and latency spikes",
  "Auth dependency misapplied leads to access control gaps",
  "Unhandled exceptions cause 5xx spikes without good logs",
  "Pydantic/model mismatch breaks clients or hides errors",
  "Timeout/retry misconfiguration causes retry storms",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("FastAPI service behaves correctly and is observable under load");
  plan.invariants.push("Authz is enforced for protected endpoints");
  plan.testPlan.unit.push("Business logic edge cases and error mapping");
  plan.testPlan.contract.push("Request/response model contract tests and negative cases");
  plan.testPlan.integration.push("DB interactions and transaction boundaries");
  plan.checks.preDeploy.push("Load sanity check and event loop stall risk review");
  plan.checks.postDeploy.push("Monitor latency, 5xx, and saturation during rollout");
  plan.rollbackReadiness.push("Rollback plan is documented and feasible under load");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Canary small traffic percentage with guardrails");
  plan.plan.phases.push("Increase gradually if stable");
  plan.plan.guardrails.push("Latency, 5xx rate, saturation, dependency errors");
  plan.plan.abortSignals.push("Sustained latency regression or 5xx increase");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained latency regression or 5xx increase");
  plan.steps.push("Revert deploy or disable feature flag");
  plan.validationAfterRollback.push("Confirm metrics return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("FastAPI health: latency, 5xx, saturation, dependency health");
  plan.alerts.push("Alert on sustained 5xx increase or SLO burn");
  plan.logs.push("Structured logs with correlation IDs and auth failures");
  plan.runbooks.push("FastAPI runbook: mitigate, rollback, validate");
  return plan;
};

export const defaultSloSketch = () => {
  const slo = sloSketchTemplate();
  slo.service = "fastapi_service";
  slo.indicators.push("Availability for critical endpoints");
  slo.indicators.push("Latency p95 for critical endpoints");
  slo.objectives.push("Availability meets agreed target for critical endpoints");
  slo.objectives.push("Latency p95 meets agreed target for critical endpoints");
  slo.alerting.push("Multi-window burn-rate alerts tied to user impact");
  return slo;
};

export const criteriaPack = () => [
  "Async vs sync boundaries are correct and event loop stalls are mitigated",
  "API contract tests cover request/response models and negative cases",
  "Timeouts/retries are defined to avoid retry storms and partial failure loops",
];

