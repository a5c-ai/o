import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "aws_rds_postgres",
  sections: [
    {
      title: "Instance Topology And Operations",
      prompts: [
        "Single-AZ vs Multi-AZ, read replicas, and failover expectations",
        "Maintenance window and engine version/parameter group changes",
        "Backup, PITR, and snapshot strategy; restore objectives",
      ],
    },
    {
      title: "Schema And Migrations",
      prompts: [
        "Schema changes and migration strategy (online vs downtime)",
        "Backfill plan and performance impact; lock risks",
        "Rollback strategy for schema (expand/contract) and data recovery",
      ],
    },
    {
      title: "Performance And Connections",
      prompts: [
        "Connection pooling strategy and max connections budget",
        "Query performance considerations and index changes",
        "Parameter tuning implications (work_mem, autovacuum) if touched",
      ],
    },
    {
      title: "Security And Compliance",
      prompts: [
        "Network exposure, security groups, and IAM auth if used",
        "Encryption at rest and in transit; secrets rotation",
        "Audit/logging requirements and data retention",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Migration locks causing elevated latency or outages",
  "Failover causing connection storms and cascading timeouts",
  "Parameter group change causing performance regression",
  "Backup/restore assumptions wrong causing slow recovery",
  "Connection exhaustion due to missing pooling or bad limits",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("RDS Postgres changes are safe, observable, and recoverable");
  plan.invariants.push("Migrations do not cause unsafe locks and rollback is possible");
  plan.testPlan.integration.push("Migration run in staging with representative data volume where feasible");
  plan.testPlan.integration.push("Failover simulation plan or operational rehearsal if risk is high");
  plan.checks.preDeploy.push("Verify backup/PITR settings and restore runbook");
  plan.checks.preDeploy.push("Verify connection pool settings and max connections budget");
  plan.checks.postDeploy.push("Monitor locks, latency, replication lag, and error rate during rollout");
  plan.rollbackReadiness.push("Rollback plan covers schema rollback and data recovery steps");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Run migrations in staging and validate performance");
  plan.plan.phases.push("Apply production change during low-traffic window with guardrails");
  plan.plan.guardrails.push("DB latency, lock waits, error rate, replication lag");
  plan.plan.abortSignals.push("Lock contention spike or sustained latency regression");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Lock contention spike, latency regression, or data integrity issues");
  plan.steps.push("Revert app deploy and stop new writes if needed");
  plan.steps.push("Apply expand/contract rollback migration or restore from snapshot/PITR if needed");
  plan.validationAfterRollback.push("Confirm app health and DB metrics normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("RDS: CPU, memory, storage, connections, latency, replication lag");
  plan.alerts.push("Alert on high connection utilization or lock waits");
  plan.alerts.push("Alert on sustained latency regression or replication lag");
  plan.runbooks.push("RDS runbook: failover handling, restore, and rollback migration steps");
  return plan;
};

export const criteriaPack = () => [
  "Backups/PITR and restore runbook are verified and meet recovery objectives",
  "Migrations are online-safe (or downtime is explicit) with rollback strategy",
  "Connection and performance risks are addressed with monitoring guardrails",
];

