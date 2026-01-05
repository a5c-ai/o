import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "azure_cosmosdb",
  sections: [
    {
      title: "Partitioning And Data Model",
      prompts: [
        "Partition key choice and how it maps to access patterns",
        "Hot partition risk and mitigation strategy",
        "Document schema changes and versioning/backfill plan",
      ],
    },
    {
      title: "Throughput And Consistency",
      prompts: [
        "RU budget and autoscale settings; expected RU cost of key queries",
        "Consistency level and implications for correctness",
        "Indexing policy changes and query constraints",
      ],
    },
    {
      title: "Operational Concerns",
      prompts: [
        "Multi-region replication and failover behavior if used",
        "Backup/restore and retention requirements",
        "Rollout/rollback plan for schema/index changes",
      ],
    },
    {
      title: "Observability And Security",
      prompts: [
        "Monitoring: RU consumption, throttles (429), latency, errors",
        "Access control, network exposure, and secrets management",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Hot partition causing sustained 429 throttling and latency spikes",
  "RU budget underestimated causing cost spikes or throttling",
  "Consistency level mismatch causing unexpected stale reads",
  "Indexing policy change breaking queries or increasing RU cost",
  "Schema change without backfill plan causing mixed-version bugs",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Cosmos DB changes preserve correctness and stay within RU budget");
  plan.invariants.push("Partitioning avoids hotspots for expected access patterns");
  plan.testPlan.integration.push("Read/write tests for key access patterns and boundary cases");
  plan.checks.preDeploy.push("Estimate RU cost for key queries and verify indexing policy");
  plan.checks.preDeploy.push("Verify partition key supports scaling and avoids hotspots");
  plan.checks.postDeploy.push("Monitor 429 throttles, latency, and RU consumption during rollout");
  plan.rollbackReadiness.push("Rollback plan covers reverting schema/index changes and backfill");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Validate changes in staging with representative load where possible");
  plan.plan.phases.push("Enable new access patterns gradually and monitor throttling");
  plan.plan.guardrails.push("429 throttles, RU consumption, latency, error rate");
  plan.plan.abortSignals.push("Sustained throttling or unexpected RU/cost spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Throttling surge, query failures, or correctness issues");
  plan.steps.push("Disable new access path or revert application changes");
  plan.steps.push("Revert indexing policy or throughput settings if needed");
  plan.validationAfterRollback.push("Confirm throttling and errors return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Cosmos DB: RU consumption, 429 throttles, latency, errors");
  plan.alerts.push("Alert on sustained 429 throttling increase");
  plan.alerts.push("Alert on unexpected RU consumption increase");
  plan.runbooks.push("Cosmos DB runbook: mitigate hotspots, adjust RU, rollback query/index changes");
  return plan;
};

export const criteriaPack = () => [
  "Partition key and access patterns avoid hotspots and scale predictably",
  "RU budget and indexing policy changes are measured and guarded",
  "Consistency level and replication/failover behavior are explicit and verified",
];

