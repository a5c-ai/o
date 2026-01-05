import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "gcp_firestore",
  sections: [
    {
      title: "Data Model And Queries",
      prompts: [
        "Collections/documents affected and key access patterns",
        "Query constraints and required composite indexes",
        "Consistency needs and transaction/batch usage",
      ],
    },
    {
      title: "Security Rules",
      prompts: [
        "Security rules changes and principle of least privilege",
        "Tenant scoping and object-level access rules",
        "Validation in rules vs application-level validation",
      ],
    },
    {
      title: "Cost And Performance Guardrails",
      prompts: [
        "Read/write counts and cost impact; prevent accidental N+1 reads",
        "Hot document/collection risks and sharding strategy if needed",
        "TTL/retention policies and backfill/migration steps",
      ],
    },
    {
      title: "Observability And Operations",
      prompts: [
        "Monitoring: latency, error rates, quota usage, billable ops",
        "Rollout and rollback plan for rules and indexes",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Missing index causing production query failures",
  "Overly permissive rules causing data exposure",
  "Overly restrictive rules breaking critical user flows",
  "Cost spike due to query shape change or accidental N+1 reads",
  "Hotspotting causing latency and quota issues",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Firestore queries and rules behave correctly for intended access patterns");
  plan.invariants.push("Security rules enforce least privilege and tenant scoping");
  plan.testPlan.integration.push("Query tests for key access patterns and boundary cases");
  plan.testPlan.contract.push("Rules tests for allow/deny across roles and tenants");
  plan.checks.preDeploy.push("Verify required indexes exist before enabling new queries");
  plan.checks.preDeploy.push("Review rules changes with deny-by-default mindset");
  plan.checks.postDeploy.push("Monitor errors, latency, and billable ops for affected queries");
  plan.rollbackReadiness.push("Rollback plan can revert rules and query changes safely");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "feature-flag";
  plan.plan.phases.push("Create indexes first, then enable query changes for small cohort");
  plan.plan.phases.push("Expand cohort gradually with guardrails");
  plan.plan.guardrails.push("Query errors, latency, and billable ops");
  plan.plan.abortSignals.push("Query failures or cost spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Query failures, permission regressions, or cost spike");
  plan.steps.push("Disable feature flag or revert query path");
  plan.steps.push("Revert security rules to last known good version");
  plan.validationAfterRollback.push("Confirm key flows work and error rates normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Firestore: latency, error rate, quota usage, billable ops");
  plan.alerts.push("Alert on sustained increase in Firestore errors");
  plan.alerts.push("Alert on unusual spike in billable ops");
  plan.runbooks.push("Firestore runbook: rollback rules, disable feature, investigate index/query");
  return plan;
};

export const criteriaPack = () => [
  "Indexes and query constraints are verified for all critical access patterns",
  "Security rules enforce least privilege and are tested (allow/deny cases)",
  "Cost and performance risks are addressed with guardrails and monitoring",
];

