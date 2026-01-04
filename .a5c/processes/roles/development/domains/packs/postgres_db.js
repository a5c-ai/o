import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";
import { migrationPlanTemplate } from "../shared/migrations.js";

export const planningBreakdownTemplate = () => ({
  domain: "postgres_db",
  sections: [
    {
      title: "Schema And Compatibility",
      prompts: [
        "What schema objects change (tables, columns, indexes, constraints)?",
        "Compatibility strategy (expand/contract) and concurrent app versions",
        "Locking risk and migration execution window constraints",
      ],
    },
    {
      title: "Data Migration And Backfill",
      prompts: [
        "Is a backfill required? chunking, throttling, resumability, idempotency",
        "Validation strategy: invariants, counts, sampling, checksums where practical",
        "Rollback strategy for schema vs data separately",
      ],
    },
    {
      title: "Performance And Capacity",
      prompts: [
        "Query plan impact, index strategy, and hot path changes",
        "Connection pooling and limits; expected load impact",
        "Bloat/maintenance considerations (vacuum/analyze) where relevant",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Backups, restore testing, and point-in-time recovery expectations",
        "Monitoring: replication lag, locks, slow queries, CPU/IO",
        "Runbook for migration pause/resume and incident handling",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Migration causes blocking locks and application timeouts",
  "Index change causes severe query regression or IO amplification",
  "Backfill overload causes saturation and cascading failures",
  "Rollback is not feasible due to data shape changes",
  "Silent data corruption due to incorrect transform logic",
];

export const defaultMigrationPlan = () => {
  const plan = migrationPlanTemplate();
  plan.changes.push("Expand/contract schema steps with concurrency safety");
  plan.backfillPlan.push("Chunked, throttled, resumable backfill with progress tracking");
  plan.validation.push("Counts/invariants and sampled correctness checks");
  plan.rollback.push("Separate rollback plan for schema and data; include PITR if needed");
  plan.runbook.push("Runbook: pause/resume backfill, monitor locks/latency, rollback");
  return plan;
};

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Schema/data change is correct and safe under production load");
  plan.invariants.push("Key data invariants hold before and after migration");
  plan.testPlan.integration.push("Migration and backfill executed on representative dataset");
  plan.checks.preDeploy.push("Review query plans for hot queries; ensure indexes are correct");
  plan.checks.preDeploy.push("Verify lock risk and migration strategy for zero downtime");
  plan.checks.postDeploy.push("Monitor slow queries, lock waits, timeouts, and replication lag");
  plan.rollbackReadiness.push("Restore and rollback procedure is documented and feasible");
  plan.dataValidation.push("Counts/invariants and sampled correctness checks post-migration");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Apply expand step; deploy compatible app version");
  plan.plan.phases.push("Run backfill in controlled batches with guardrails");
  plan.plan.phases.push("Switch reads/writes; remove old schema in contract step");
  plan.plan.guardrails.push("DB latency, lock waits, slow queries, error rates");
  plan.plan.abortSignals.push("Lock waits spike, DB latency spikes, or error rate increases");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Lock waits spike, DB latency spikes, or error rate increases");
  plan.steps.push("Pause backfill and revert application to compatible version");
  plan.steps.push("Rollback schema changes where safe, otherwise switch to PITR/restore strategy");
  plan.validationAfterRollback.push("Confirm DB health and application errors return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("DB health: latency, CPU/IO, slow queries, lock waits, replication lag");
  plan.alerts.push("Alert on lock waits, slow query spikes, or replication lag breaches");
  plan.runbooks.push("DB migration runbook: pause backfill, mitigate locks, rollback/restore");
  return plan;
};

export const criteriaPack = () => [
  "Migration uses expand/contract with concurrent app version safety",
  "Lock risk and query plan impact are assessed for hot paths",
  "Backfill is chunked/throttled/resumable with concrete validation steps",
  "Rollback includes schema rollback and data recovery strategy (PITR if needed)",
];

