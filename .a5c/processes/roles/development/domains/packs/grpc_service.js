import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate, sloSketchTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "grpc_service",
  sections: [
    {
      title: "IDL And Compatibility",
      prompts: [
        "Proto changes: fields added, reserved fields, oneofs, enums, package names",
        "Compatibility policy and client rollout sequencing",
        "Error model: status codes and typed error details if used",
      ],
    },
    {
      title: "Reliability And Performance",
      prompts: [
        "Deadlines/timeouts and retry policy; avoid retry storms",
        "Streaming semantics (ordering, backpressure, cancellation)",
        "Load profile and hot paths; resource sizing and saturation risks",
      ],
    },
    {
      title: "Security And Auth",
      prompts: [
        "mTLS/auth requirements and authorization model",
        "Input validation and size limits; abuse prevention",
        "Audit logging and sensitive data redaction",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Observability: per-method latency/errors, saturation, retries",
        "Rollout plan and abort signals; rollback plan",
        "Runbooks for partial outages and overload",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Proto incompatibility breaks older clients (enum changes, removed fields)",
  "Retry storms amplify outages due to misconfigured deadlines and retries",
  "Streaming backpressure bugs cause memory growth or timeouts",
  "Auth gaps allow unauthorized method access",
  "Large payloads or abuse cause resource exhaustion without limits",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("gRPC service is compatible, reliable under deadlines, and observable");
  plan.invariants.push("Backward compatible proto evolution for supported clients");
  plan.invariants.push("Timeouts and retries are safe and do not amplify outages");
  plan.testPlan.contract.push("Proto compatibility tests and client stubs integration checks");
  plan.testPlan.integration.push("End-to-end method calls with deadlines, cancellations, and retries");
  plan.checks.preDeploy.push("Load sanity check for hot methods and streaming paths where relevant");
  plan.checks.postDeploy.push("Monitor per-method latency/errors and retry rates during rollout");
  plan.rollbackReadiness.push("Rollback includes server and client sequencing plan");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Deploy server changes first, ensuring proto compatibility");
  plan.plan.phases.push("Canary traffic and then increase with guardrails");
  plan.plan.phases.push("Roll out clients after server is stable (if applicable)");
  plan.plan.guardrails.push("Per-method latency/errors, saturation, retry rate");
  plan.plan.abortSignals.push("Sustained error increase or retry amplification");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained error increase or retry amplification");
  plan.steps.push("Rollback server deployment and reduce client rollouts");
  plan.steps.push("Disable risky behavior via feature flag if available");
  plan.validationAfterRollback.push("Confirm per-method metrics return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("gRPC: per-method latency/error rate, retry rate, saturation");
  plan.alerts.push("Alert on sustained error increases for critical methods");
  plan.alerts.push("Alert on retry amplification or saturation");
  plan.logs.push("Structured logs include method name, status code, correlation IDs");
  plan.traces.push("Traces for critical methods and downstream calls");
  plan.runbooks.push("gRPC runbook: mitigate overload, rollback, validate");
  return plan;
};

export const defaultSloSketch = () => {
  const slo = sloSketchTemplate();
  slo.service = "grpc_service";
  slo.indicators.push("Availability for critical methods");
  slo.indicators.push("Latency p95 for critical methods");
  slo.objectives.push("Availability meets agreed target for critical methods");
  slo.objectives.push("Latency p95 meets agreed target for critical methods");
  slo.alerting.push("Burn-rate alerts for method availability");
  return slo;
};

export const criteriaPack = () => [
  "Proto changes follow compatibility rules (reserved fields, safe enum evolution)",
  "Deadlines/timeouts and retries are defined to avoid retry storms",
  "Streaming semantics are explicit (backpressure, cancellation, ordering)",
  "Observability is per-method and includes retry and saturation signals",
];

