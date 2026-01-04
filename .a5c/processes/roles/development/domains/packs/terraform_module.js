import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "terraform_module",
  sections: [
    {
      title: "Change Scope And Blast Radius",
      prompts: [
        "What resources are created/changed/destroyed and what is the blast radius?",
        "Environment promotion strategy (dev/stage/prod) and gating",
        "Rollback strategy (state, config reversion, traffic shift)",
      ],
    },
    {
      title: "State And Safety",
      prompts: [
        "State backend and locking; safe apply and drift handling",
        "Idempotency and safe re-apply behavior",
        "Provider limits, quotas, and error recovery steps",
      ],
    },
    {
      title: "Security And Access",
      prompts: [
        "IAM and least-privilege; avoid broad permissions",
        "Secrets handling and encryption at rest/in transit",
        "Network exposure and guardrails",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Plan/apply workflow and review gates",
        "Observability and alerts for impacted services",
        "Runbooks for rollback and incident response",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Terraform apply destroys or recreates critical resources unexpectedly",
  "State drift or locking issues cause partial changes",
  "IAM misconfiguration exposes resources or causes outages",
  "Rollback is not feasible due to state mismatches",
  "Quota limits cause partial failure without recovery plan",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Terraform change is safe, reviewable, and rollbackable");
  plan.invariants.push("No unintended resource destruction in critical environments");
  plan.checks.preDeploy.push("Plan diff reviewed; apply is gated");
  plan.checks.preDeploy.push("Verify state backend, locking, and environment targeting");
  plan.checks.postDeploy.push("Validate impacted services and dashboards after apply");
  plan.rollbackReadiness.push("Rollback plan includes state considerations and safe reversion steps");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Apply in lower env; validate; then promote");
  plan.plan.phases.push("Limit blast radius per apply (small diffs)");
  plan.plan.guardrails.push("Service health checks, error rate, saturation, cost signals");
  plan.plan.abortSignals.push("Service health regresses or unexpected diffs appear");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Service health regresses or unintended resource changes detected");
  plan.steps.push("Revert config and apply; restore from backups/snapshots if needed");
  plan.validationAfterRollback.push("Confirm service health returns to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Infra change impact: service health and dependency health");
  plan.alerts.push("Alert on sustained health regressions during rollout window");
  plan.runbooks.push("Terraform rollback runbook: revert, restore, validate");
  return plan;
};

export const criteriaPack = () => [
  "Plan/apply workflow is gated and blast radius is controlled",
  "State backend/locking and drift handling are considered",
  "IAM/network exposure is least-privilege and reviewed",
  "Rollback includes state and restore strategy where needed",
];

