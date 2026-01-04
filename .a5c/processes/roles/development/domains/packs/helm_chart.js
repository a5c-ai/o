import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "helm_chart",
  sections: [
    {
      title: "Chart Interface And Values",
      prompts: [
        "Values schema and defaults; compatibility expectations",
        "Config changes that affect behavior (resources, env vars, probes)",
        "Secrets and config sourcing strategy",
      ],
    },
    {
      title: "Rollout And Safety",
      prompts: [
        "Upgrade strategy (helm upgrade, hooks) and rollback approach",
        "Readiness/liveness/probes and safe startup behavior",
        "Blast radius controls (canary namespaces, progressive rollout)",
      ],
    },
    {
      title: "Security",
      prompts: [
        "Service accounts, RBAC, and least-privilege permissions",
        "Network policies and inbound/outbound restrictions",
        "Image policy and supply chain controls",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Dashboards/alerts for service and k8s signals",
        "Runbooks for upgrade failures and rollbacks",
        "Validation steps post-upgrade",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Chart upgrade changes values and breaks runtime behavior",
  "Bad probes cause rollout stalls or traffic blackholes",
  "RBAC misconfiguration breaks dependencies or exposes privileges",
  "Rollback fails due to hooks or stateful changes",
  "Resource sizing regression causes OOMKills or throttling",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Helm upgrade is safe and application remains healthy");
  plan.invariants.push("Values and templates render deterministically and safely");
  plan.checks.preDeploy.push("Template render/diff reviewed; values schema validated");
  plan.checks.preDeploy.push("Verify probes and resource limits are sane");
  plan.checks.postDeploy.push("Monitor restarts, OOMKills, latency/errors during rollout");
  plan.rollbackReadiness.push("Helm rollback procedure is documented and tested");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Upgrade in canary namespace/cluster first");
  plan.plan.phases.push("Roll out progressively with guardrails");
  plan.plan.guardrails.push("Error rate, latency, restarts, OOMKills, saturation");
  plan.plan.abortSignals.push("Crash loops, probe failures, or sustained error spikes");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Crash loops, probe failures, or sustained error spikes");
  plan.steps.push("helm rollback to previous revision; revert values changes");
  plan.validationAfterRollback.push("Confirm pods stabilize and guardrails return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("K8s: restarts, OOMKills, probe failures, CPU/memory");
  plan.dashboards.push("Service: latency, errors, saturation");
  plan.alerts.push("Alert on crash loops, OOMKills, probe failures");
  plan.runbooks.push("Helm runbook: rollback, validate, mitigate");
  return plan;
};

export const criteriaPack = () => [
  "Values interface is explicit, compatible, and validated",
  "Upgrade and rollback procedures are documented and rehearsable",
  "RBAC/network policies and secrets/config handling are least-privilege and correct",
  "Post-upgrade validation and guardrails exist before widening rollout",
];

