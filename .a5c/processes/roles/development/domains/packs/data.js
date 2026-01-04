import { migrationPlanTemplate } from "../shared/migrations.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";
import { rollbackPlanTemplate } from "../shared/rollout.js";

export const planningBreakdownTemplate = () => ({
  domain: "data",
  sections: [
    {
      title: "Schema And Data Model",
      prompts: [
        "What tables/schemas change and what invariants must hold?",
        "Compatibility approach (expand/contract) across versions",
        "Indexing and query patterns impacted",
      ],
    },
    {
      title: "Pipelines And Backfills",
      prompts: [
        "Any backfill required: chunking, throttling, resumability, idempotency",
        "Validation strategy: counts, checksums, invariants, sampling",
        "Retry and failure handling for long-running jobs",
      ],
    },
    {
      title: "Data Quality And Governance",
      prompts: [
        "Freshness, completeness, and correctness checks",
        "Privacy/PII classification and retention controls",
        "Lineage and auditability expectations",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Observability for pipeline health and data quality signals",
        "Rollout/rollback plan for schema and data separately",
        "Runbooks for backfill pauses, retries, and incident response",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Breaking schema change causing application errors",
  "Backfill overload impacting production databases",
  "Silent data corruption or correctness drift",
  "Pipeline retries causing duplicate writes or inconsistent results",
  "Privacy/PII leakage through logs or storage",
];

export const defaultMigrationPlan = () => {
  const plan = migrationPlanTemplate();
  plan.changes.push("Describe schema evolution and compatibility (expand/contract)");
  plan.backfillPlan.push("Chunked, throttled, resumable backfill with progress tracking");
  plan.validation.push("Counts/invariants checks; sampling for correctness");
  plan.rollback.push("Rollback schema and application versions safely; stop backfill if needed");
  plan.runbook.push("Runbook: pause/resume backfill, validate, recover");
  return plan;
};

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Data is correct, reproducible, and meets quality expectations");
  plan.invariants.push("Key invariants hold and no privacy constraints are violated");
  plan.testPlan.integration.push("End-to-end pipeline execution on representative data");
  plan.checks.preDeploy.push("Query plan review for hot paths where relevant");
  plan.checks.postDeploy.push("Validate data quality checks and freshness signals");
  plan.dataValidation.push("Pre/post counts, checksums, and sampled correctness checks");
  plan.rollbackReadiness.push("Backfill can be paused and rolled back safely");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Detected correctness drift or invariant violations");
  plan.steps.push("Stop backfill/pipeline; revert application/schema version if required");
  plan.dataRecovery.push("Restore from snapshot or run compensating backfill if needed");
  plan.validationAfterRollback.push("Re-run validations and confirm invariants");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Pipeline health: throughput, latency, errors, retries");
  plan.dashboards.push("Data quality: freshness, completeness, correctness signals");
  plan.alerts.push("Alert on freshness breach, error spikes, or validation failures");
  plan.logs.push("Structured pipeline logs with job IDs and progress checkpoints");
  plan.runbooks.push("Data incident runbook: pause, validate, rollback, recover");
  return plan;
};

export const criteriaPack = () => [
  "Schema evolution strategy is safe (expand/contract) and supports concurrent versions",
  "Backfills are chunked, throttled, resumable, and validated against invariants",
  "Data quality checks exist (freshness, completeness, correctness)",
  "Lineage, privacy, and retention are addressed where applicable",
];
