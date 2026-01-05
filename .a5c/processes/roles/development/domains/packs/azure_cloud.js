import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "azure_cloud",
  sections: [
    {
      title: "Subscriptions And Resource Layout",
      prompts: [
        "Subscription strategy and environment separation (prod/stage/dev)",
        "Resource group structure, naming, tagging, and policy conventions",
        "Budgeting and cost alerts; ownership and chargeback model",
      ],
    },
    {
      title: "Identity, Access, And Secrets",
      prompts: [
        "RBAC model (AAD groups, managed identities) and least privilege",
        "Key Vault usage, secret rotation, and access patterns",
        "Audit logs and compliance expectations",
      ],
    },
    {
      title: "Networking And Reliability",
      prompts: [
        "VNet/subnet design, private endpoints, and egress control",
        "DNS strategy and connectivity to on-prem or other clouds",
        "Availability zones/regions, DR posture, and failure domain assumptions",
      ],
    },
    {
      title: "Operations And Delivery",
      prompts: [
        "IaC and deploy approach (Bicep/Terraform) and promotion strategy",
        "Observability: Azure Monitor/Log Analytics dashboards, alerts, runbooks",
        "Quotas/limits and service availability constraints",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "RBAC or identity misconfig causes outages or unintended access",
  "Network/private endpoint misconfig blocks dependencies",
  "Missing budgets/guardrails causes unexpected cost growth",
  "Quotas/region constraints block deploys or scaling",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Azure policies, identity, and networking match intended posture");
  plan.invariants.push("Access is least-privilege and auditable");
  plan.checks.preDeploy.push("Validate RBAC/managed identities and Key Vault access");
  plan.checks.preDeploy.push("Validate VNet routing, private endpoints, and DNS resolution");
  plan.checks.postDeploy.push("Confirm Azure Monitor dashboards/alerts are live");
  plan.rollbackReadiness.push("Rollback includes reverting IaC and policy/RBAC changes safely");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Roll out changes to non-prod; validate access and networking");
  plan.plan.guardrails.push("Auth failures, deploy failures, service health, cost anomalies");
  plan.plan.abortSignals.push("Sustained auth failures, health regressions, or cost spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Repeated deploy failures, security risk, or access outages");
  plan.steps.push("Revert IaC; rollback RBAC/network/policy changes");
  plan.validationAfterRollback.push("Confirm access and system health return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Subscription baseline: auth failures, service health, quotas, cost");
  plan.alerts.push("Alert on sustained auth failures or deploy failures");
  plan.runbooks.push("Azure cloud runbook: rollback IaC/policies, validate identity/network, verify logs");
  return plan;
};

export const criteriaPack = () => [
  "Subscription/resource layout is explicit with tagging/policy guardrails",
  "Identity and network posture are validated with rollback procedures",
  "Delivery and observability are ready for production operations",
];

