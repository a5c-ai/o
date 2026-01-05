import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "gcp_cloud",
  sections: [
    {
      title: "Organization And Projects",
      prompts: [
        "Org/folder/project structure and environment separation (prod/stage/dev)",
        "Billing setup, budgets, and guardrails to prevent cost surprises",
        "Required APIs/services enabled and policy constraints",
      ],
    },
    {
      title: "IAM, Secrets, And Encryption",
      prompts: [
        "IAM model (service accounts, workload identity, least privilege)",
        "Secrets handling (Secret Manager) and key management policy (KMS)",
        "Audit logging posture and sensitive data handling expectations",
      ],
    },
    {
      title: "Networking And Reliability",
      prompts: [
        "VPC, subnets, private access, and egress requirements",
        "Service perimeters (VPC-SC) and connectivity to on-prem if needed",
        "Multi-region strategy and failure domain assumptions",
      ],
    },
    {
      title: "Operations And Delivery",
      prompts: [
        "Deployment pipeline, promotion strategy, and rollback approach",
        "Observability: Cloud Logging/Monitoring dashboards, alerts, and runbooks",
        "Quota/limit management for key services",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "IAM misconfiguration causes outages or unintended access",
  "Networking misconfig blocks private dependency access",
  "Missing budgets/guardrails leads to unexpected cost growth",
  "Quota/limits prevent deploys or scaling",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("GCP policies, IAM, and networking match intended posture");
  plan.invariants.push("Access is least-privilege and auditable");
  plan.checks.preDeploy.push("Verify APIs enabled, IAM bindings, and network paths");
  plan.checks.preDeploy.push("Validate budgets/alerts and quota headroom");
  plan.checks.postDeploy.push("Confirm logging/monitoring and alerts are live");
  plan.rollbackReadiness.push("Rollback includes reverting IaC and policy/IAM changes safely");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Roll out changes to lower env; validate access and deploy paths");
  plan.plan.guardrails.push("IAM auth errors, deploy failures, quota alarms, cost anomalies");
  plan.plan.abortSignals.push("Sustained auth failures, quota exhaustion, or cost spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Repeated deploy failures, security risk, or access outages");
  plan.steps.push("Revert IaC; rollback IAM/network/policy changes");
  plan.validationAfterRollback.push("Confirm access and system health return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Project baseline: auth errors, service health, quotas, cost");
  plan.alerts.push("Alert on sustained auth failures or quota exhaustion");
  plan.runbooks.push("GCP cloud runbook: rollback IaC/policies, validate IAM/network, verify logs");
  return plan;
};

export const criteriaPack = () => [
  "Project/IAM structure is explicit with guardrails and auditability",
  "Networking and quotas are validated for deploy and runtime paths",
  "Delivery and observability are ready with rollback procedures",
];

