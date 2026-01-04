import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate, sloSketchTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "infra",
  sections: [
    {
      title: "Environments And Blast Radius",
      prompts: [
        "What environments are impacted (dev/stage/prod) and how does promotion work?",
        "What is the blast radius and how do we constrain it (canary, progressive, feature flags)?",
        "What is the rollback path (previous version, config reversion, traffic shift)?",
      ],
    },
    {
      title: "IaC And Change Safety",
      prompts: [
        "IaC structure and state management (plan/apply workflow, drift detection)",
        "Idempotency and safe re-apply behavior",
        "Dependency ordering and failure recovery steps",
      ],
    },
    {
      title: "Security And Access",
      prompts: [
        "Secrets management and rotation strategy",
        "IAM/permissions are least-privilege and auditable",
        "Network exposure and inbound/outbound controls (allowlists, egress)",
      ],
    },
    {
      title: "Operability And Cost",
      prompts: [
        "Monitoring and alerts for critical services and dependencies",
        "Runbooks and oncall readiness",
        "Cost impact and guardrails (budgets, quotas, scaling limits)",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Misconfigured IAM policy causing outage or security exposure",
  "Rollout blast radius too large leading to widespread failure",
  "Irreversible IaC change without safe rollback path",
  "Secrets leakage via logs or misconfigured storage",
  "Cost runaway due to scaling misconfiguration",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Infrastructure change is safe, repeatable, and observable");
  plan.invariants.push("Least-privilege access and no unintended exposure");
  plan.checks.preDeploy.push("IaC plan reviewed; diff matches intent");
  plan.checks.preDeploy.push("Smoke test in lower environment where possible");
  plan.checks.postDeploy.push("Validate health checks, error rates, and key dashboards");
  plan.rollbackReadiness.push("Rollback procedure is documented and feasible");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Apply in lower env first; validate; then promote");
  plan.plan.phases.push("Progressively enable traffic or capacity if applicable");
  plan.plan.guardrails.push("Service health checks, error rate, and saturation");
  plan.plan.abortSignals.push("Health checks fail or error rate spikes");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Health checks fail or user-impacting errors spike");
  plan.steps.push("Revert to previous known-good configuration/deployment");
  plan.steps.push("Scale down or disable impacted components if needed");
  plan.validationAfterRollback.push("Verify service health and dashboards return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.goldenSignals.errors.push("Health check failures and error rates");
  plan.goldenSignals.saturation.push("CPU/memory, quota exhaustion, scaling limits");
  plan.dashboards.push("Infra health: capacity, errors, saturation, dependency health");
  plan.alerts.push("Alert on sustained health check failures or quota exhaustion");
  plan.runbooks.push("Infra incident runbook: mitigate, rollback, validate");
  return plan;
};

export const defaultSloSketch = () => {
  const slo = sloSketchTemplate();
  slo.service = "infra";
  slo.indicators.push("Availability of critical infrastructure services");
  slo.objectives.push("Availability meets agreed target for critical services");
  slo.alerting.push("Burn-rate alerts for infrastructure availability");
  return slo;
};

export const criteriaPack = () => [
  "Changes are safe to apply repeatedly (idempotent) and are reviewable (diff/plan)",
  "Blast radius controls are explicit (rollout, canary, progressive exposure)",
  "Secrets and access controls are least-privilege and audited",
  "Rollback and disaster recovery steps are explicit and rehearsable",
];
