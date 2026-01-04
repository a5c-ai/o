import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "kubernetes_service",
  sections: [
    {
      title: "Workload And Deployment Shape",
      prompts: [
        "What workload type (Deployment/StatefulSet/Job/CronJob) and why?",
        "Resource requests/limits and autoscaling (HPA/KEDA) expectations",
        "Readiness/liveness/startup probes and graceful shutdown behavior",
      ],
    },
    {
      title: "Traffic And Rollout Strategy",
      prompts: [
        "Ingress/service routing, canary strategy, and blast radius constraints",
        "Rollback approach (previous ReplicaSet/Helm rollback) and config rollback",
        "Config and secrets management (ConfigMap/Secret/external secret manager)",
      ],
    },
    {
      title: "Reliability And Security",
      prompts: [
        "Pod disruption handling and node failures; PDBs where needed",
        "Network policies, service accounts, and least-privilege RBAC",
        "Image policy and supply chain controls (pinning, scanning, provenance)",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Dashboards/alerts: latency, errors, saturation, restarts, OOMKills",
        "Logging and tracing integration; correlation IDs",
        "Runbooks for rollout failures, crash loops, and scaling events",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Bad probe config causing rollout stalls or traffic blackholes",
  "Resource mis-sizing leading to OOMKills or throttling",
  "Rollout without blast radius controls causing widespread outage",
  "RBAC or network policy misconfig breaking service connectivity",
  "Crash loop due to missing config/secrets or runtime mismatch",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Kubernetes rollout is safe and service remains healthy");
  plan.invariants.push("Probes are correct and represent real readiness");
  plan.checks.preDeploy.push("Validate manifests/helm diff matches intent");
  plan.checks.preDeploy.push("Validate resource requests/limits and probe configuration");
  plan.checks.postDeploy.push("Monitor restarts, OOMKills, latency/errors during rollout");
  plan.rollbackReadiness.push("Rollback procedure (helm rollback or replica set revert) is documented");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Canary small percentage of pods; validate probes and guardrails");
  plan.plan.phases.push("Increase gradually; pause on any guardrail breach");
  plan.plan.guardrails.push("Error rate, latency, restarts, OOMKills, saturation");
  plan.plan.abortSignals.push("Probe failures, crash loops, or sustained error rate increase");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Crash loops, probe failures, or sustained user-impacting errors");
  plan.steps.push("Rollback to previous ReplicaSet or helm rollback to prior revision");
  plan.steps.push("Revert config changes and secrets references if needed");
  plan.validationAfterRollback.push("Confirm pods stabilize and guardrails return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Service: latency, errors, saturation, traffic");
  plan.dashboards.push("K8s: restarts, OOMKills, CPU/memory, probe failures");
  plan.alerts.push("Alert on crash loops, OOMKills, or sustained error rate increases");
  plan.runbooks.push("K8s runbook: rollback, scale, inspect events, validate");
  return plan;
};

export const criteriaPack = () => [
  "Probes, resource sizing, and autoscaling assumptions are explicit and validated",
  "Rollout uses a safe strategy (canary/progressive) with clear abort signals",
  "RBAC/network policies and secrets/config handling are least-privilege and correct",
];

