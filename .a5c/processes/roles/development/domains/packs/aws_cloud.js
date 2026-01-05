import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "aws_cloud",
  sections: [
    {
      title: "Landing Zone And Accounts",
      prompts: [
        "Account structure (prod/stage/dev), SCPs, and role/permission boundaries",
        "Region strategy and data residency constraints",
        "Shared services: DNS, CI/CD, logging, security tooling",
      ],
    },
    {
      title: "Identity, Security, And Compliance",
      prompts: [
        "IAM strategy (roles, least privilege, permissions boundaries)",
        "Secrets and encryption (KMS keys, rotation, access patterns)",
        "Audit and threat detection (CloudTrail, GuardDuty, config rules)",
      ],
    },
    {
      title: "Networking And Reliability",
      prompts: [
        "VPC design, routing, egress, and private connectivity requirements",
        "Service quotas and limits that can block scaling or deploys",
        "Multi-AZ / multi-region needs and failure domain assumptions",
      ],
    },
    {
      title: "Service Selection And Integration",
      prompts: [
        "Which AWS services are involved and why (tradeoffs vs alternatives)",
        "Integration patterns (events/queues/streams) and retry/backpressure behavior",
        "IaC approach (CDK/SAM/Terraform) and environment promotion strategy",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "IAM policy mistakes cause outages or unintended access",
  "Networking misconfiguration blocks dependency access or increases latency",
  "Service quota/limit causes deploy failures or scaling incidents",
  "Missing audit/logging prevents incident investigation and compliance proof",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("AWS configuration matches intended security, networking, and reliability posture");
  plan.invariants.push("Access is least-privilege and auditable");
  plan.checks.preDeploy.push("Review IAM, encryption, and network changes for blast radius");
  plan.checks.preDeploy.push("Validate quotas/limits and required service enablement");
  plan.checks.postDeploy.push("Verify logs/metrics are present and alerts are wired");
  plan.rollbackReadiness.push("Rollback includes reverting IaC changes and access controls safely");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Validate in lower environment; apply changes progressively");
  plan.plan.guardrails.push("AccessDenied errors, deploy failures, service health, cost anomalies");
  plan.plan.abortSignals.push("Sustained auth errors, health regressions, or unexpected cost spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Access outages, security risk, or repeated deploy failures");
  plan.steps.push("Revert IaC to last known good; rollback IAM/network changes");
  plan.validationAfterRollback.push("Confirm access and service health return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Account baseline: CloudTrail, auth failures, service health, cost");
  plan.alerts.push("Alert on sustained AccessDenied spikes or deploy failures");
  plan.runbooks.push("AWS cloud runbook: rollback IaC, validate identity/network, verify logging");
  return plan;
};

export const criteriaPack = () => [
  "Account/IAM strategy is explicit and least-privilege with auditability",
  "Networking and quotas/limits are accounted for before rollout",
  "IaC promotion, rollback, and observability are operationally ready",
];

