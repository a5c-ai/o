import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "gcp_cloudrun",
  sections: [
    {
      title: "Service Shape And Traffic",
      prompts: [
        "Ingress/auth model (public vs authenticated) and IAM bindings",
        "Revision traffic splitting strategy and rollback approach",
        "Concurrency, timeouts, and request size constraints",
      ],
    },
    {
      title: "Networking And Dependencies",
      prompts: [
        "VPC connector/egress requirements and private dependency access",
        "Secrets handling (Secret Manager) and config management",
        "Dependency timeouts/retries to avoid retry storms",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Cloud Logging structure and correlation IDs",
        "Cloud Monitoring dashboards/alerts for errors/latency/concurrency",
        "Runbooks for traffic rollback and incident mitigation",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "IAM misconfiguration causing unintended public access or outages",
  "Bad revision rollout causing 5xx spikes across traffic",
  "Concurrency/timeouts misconfiguration causing latency and errors",
  "Networking misconfig blocking private dependency access",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Cloud Run revisions behave correctly under traffic splitting and concurrency");
  plan.invariants.push("Auth/ingress settings match intended exposure");
  plan.checks.preDeploy.push("Validate IAM, ingress, and traffic splitting configuration");
  plan.checks.postDeploy.push("Monitor 5xx rate and latency during progressive rollout");
  plan.rollbackReadiness.push("Rollback uses traffic shift to prior revision and config rollback if needed");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy new revision; start with small traffic percentage");
  plan.plan.phases.push("Increase traffic gradually with guardrails");
  plan.plan.guardrails.push("5xx rate, latency, concurrency saturation");
  plan.plan.abortSignals.push("Sustained 5xx increase or latency regression");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained 5xx increase or latency regression");
  plan.steps.push("Shift traffic back to previous revision");
  plan.steps.push("Revert config/IAM changes if they contributed");
  plan.validationAfterRollback.push("Confirm error rate and latency return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Cloud Run: request latency, 5xx rate, instance count, concurrency");
  plan.alerts.push("Alert on sustained 5xx increase or latency regression");
  plan.runbooks.push("Cloud Run runbook: shift traffic, rollback, validate");
  return plan;
};

export const criteriaPack = () => [
  "Traffic splitting and rollback to prior revision are explicit and practiced",
  "IAM/ingress exposure is correct and least-privilege",
  "Concurrency/timeouts are set with realistic load assumptions",
];

