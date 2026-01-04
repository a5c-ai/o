import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate, sloSketchTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "graphql_api",
  sections: [
    {
      title: "Schema And Contracts",
      prompts: [
        "What schema changes (types, fields, directives) and what is the compatibility strategy?",
        "Deprecation plan and client migration window",
        "Nullability changes and error behavior expectations",
      ],
    },
    {
      title: "Performance And Safety",
      prompts: [
        "N+1 risks and batching strategy (dataloaders) where relevant",
        "Query complexity limits, depth limits, and timeouts",
        "Caching strategy and invalidation boundaries",
      ],
    },
    {
      title: "Authz And Data Access",
      prompts: [
        "Authz model at resolver level; least-privilege data access",
        "Field-level authorization and sensitive data handling",
        "Rate limiting and abuse prevention strategy",
      ],
    },
    {
      title: "Operability",
      prompts: [
        "Observability: per-operation latency/errors, resolver hotspots",
        "Rollout plan and abort signals; safe rollback plan",
        "Runbooks for query abuse, latency spikes, and partial outages",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Breaking schema change causes client failures (nullability, removed fields)",
  "N+1 query patterns cause latency spikes and DB overload",
  "Query abuse causes resource exhaustion without complexity limits",
  "Authz gaps at resolver/field level expose sensitive data",
  "Caching bugs cause stale or inconsistent data views",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("GraphQL schema changes are compatible and resolvers are correct");
  plan.invariants.push("Authz enforced for all sensitive fields and mutations");
  plan.testPlan.contract.push("Schema compatibility and operation contract tests");
  plan.testPlan.integration.push("Resolver integration tests with representative queries");
  plan.checks.preDeploy.push("Query complexity and depth limits validated");
  plan.checks.preDeploy.push("Performance smoke test for top operations");
  plan.checks.postDeploy.push("Monitor per-operation latency/errors and DB saturation during rollout");
  plan.rollbackReadiness.push("Rollback includes schema compatibility strategy and deploy/flag revert");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Deploy backwards-compatible schema first (additive changes)");
  plan.plan.phases.push("Roll out resolver changes behind flags if risky");
  plan.plan.phases.push("Deprecate old fields; remove only after migration window");
  plan.plan.guardrails.push("Per-operation error rate and latency; DB saturation");
  plan.plan.abortSignals.push("Sustained latency regression or client error spikes");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Client errors spike due to schema change");
  plan.triggers.push("Per-operation latency spikes due to resolver changes");
  plan.steps.push("Disable risky resolver changes via feature flag if available");
  plan.steps.push("Rollback deployment; revert schema changes if necessary and safe");
  plan.validationAfterRollback.push("Confirm per-operation errors/latency return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("GraphQL: per-operation latency/error rate, top resolvers");
  plan.alerts.push("Alert on sustained error spikes for top operations");
  plan.alerts.push("Alert on sustained latency regression for top operations");
  plan.logs.push("Structured logs include operation name and correlation IDs");
  plan.traces.push("Trace resolver hotspots for slow operations");
  plan.runbooks.push("GraphQL runbook: mitigate query abuse, rollback, validate");
  return plan;
};

export const defaultSloSketch = () => {
  const slo = sloSketchTemplate();
  slo.service = "graphql_api";
  slo.indicators.push("Availability for top operations");
  slo.indicators.push("Latency p95 for top operations");
  slo.objectives.push("Availability meets agreed target for top operations");
  slo.objectives.push("Latency p95 meets agreed target for top operations");
  slo.alerting.push("Burn-rate alerts for top operation availability");
  return slo;
};

export const criteriaPack = () => [
  "Schema evolution is compatible (deprecations before removals; nullability changes considered)",
  "Query complexity/depth limits exist to prevent abuse and resource exhaustion",
  "Resolver performance is assessed (N+1 risks mitigated with batching)",
  "Authz is enforced at resolver/field level for sensitive data",
];

