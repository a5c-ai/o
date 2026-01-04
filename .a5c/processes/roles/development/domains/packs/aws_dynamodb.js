import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "aws_dynamodb",
  sections: [
    {
      title: "Data Model And Access Patterns",
      prompts: [
        "Primary access patterns (reads/writes/queries) and expected scale",
        "Partition key and sort key design; avoid hot partitions",
        "Secondary indexes (GSI/LSI) and consistency requirements",
      ],
    },
    {
      title: "Correctness And Concurrency",
      prompts: [
        "Conditional writes, idempotency keys, and concurrency control",
        "TTL and deletion behavior; backfills and reprocessing strategy",
        "Streams and event processing (if used): ordering and retries",
      ],
    },
    {
      title: "Capacity, Cost, And Limits",
      prompts: [
        "Provisioned vs on-demand; autoscaling strategy",
        "Cost risks: large items, GSI write amplification, scan usage",
        "Size and throughput limits; pagination and query patterns",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Monitoring: throttles, latency, errors, capacity utilization",
        "Runbook for hot partitions, throttling, and partial outages",
        "Rollout and rollback for key/index changes and item shape changes",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Hot partition causes throttling and latency spikes",
  "GSI write amplification causes unexpected cost and throttling",
  "Conditional write logic bugs cause lost updates or duplicates",
  "Access pattern changes lead to scans and poor performance",
  "Stream consumer retries cause duplicate processing without idempotency",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("DynamoDB access patterns are correct, performant, and cost-aware");
  plan.invariants.push("Conditional writes preserve invariants under retries and concurrency");
  plan.testPlan.unit.push("Key construction, idempotency, and conditional write logic");
  plan.testPlan.integration.push("Representative access patterns (queries) and pagination behavior");
  plan.checks.preDeploy.push("Review partition key design against expected scale and hotspots");
  plan.checks.preDeploy.push("Cost sanity check for GSI usage and item sizes");
  plan.checks.postDeploy.push("Monitor throttles, latency, and error rates during rollout");
  plan.rollbackReadiness.push("Rollback plan exists for index/key shape changes");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy code changes compatible with old and new item shapes");
  plan.plan.phases.push("Backfill or dual-write where needed; verify with guardrails");
  plan.plan.phases.push("Switch reads; then remove old paths after validation");
  plan.plan.guardrails.push("Throttles, latency, error rate, cost signals");
  plan.plan.abortSignals.push("Throttling spikes, latency spikes, or correctness regressions");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Throttling spikes, latency spikes, or correctness regressions");
  plan.steps.push("Revert to old read path or disable feature flag");
  plan.steps.push("Stop backfill/dual-write if causing overload");
  plan.validationAfterRollback.push("Confirm throttles and latency return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("DynamoDB: throttles, latency, errors, capacity utilization");
  plan.alerts.push("Alert on sustained throttling or latency regression");
  plan.runbooks.push("DynamoDB runbook: mitigate hotspots, adjust capacity, rollback, validate");
  return plan;
};

export const criteriaPack = () => [
  "Access patterns are explicit and partition key design avoids hotspots",
  "Conditional writes/idempotency are explicit and tested for retries/concurrency",
  "Cost and limits are considered (GSI amplification, scans, item sizes)",
  "Observability includes throttles/latency/capacity with runbooks",
];

