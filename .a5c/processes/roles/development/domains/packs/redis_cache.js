import { rollbackPlanTemplate, rolloutPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "redis_cache",
  sections: [
    {
      title: "Cache Semantics",
      prompts: [
        "What is cached (keys, values, sizes) and what is the TTL strategy?",
        "Correctness model: cache-aside, write-through, write-behind, or read-through",
        "Invalidation strategy and consistency expectations",
      ],
    },
    {
      title: "Failure Modes And Protection",
      prompts: [
        "Cache stampede protection (single-flight, jitter, request coalescing)",
        "Degradation behavior when cache is unavailable or slow",
        "Hot keys and eviction behavior under memory pressure",
      ],
    },
    {
      title: "Operational Readiness",
      prompts: [
        "Metrics: hit rate, latency, evictions, memory usage, connection saturation",
        "Alert thresholds and runbooks for evictions and latency spikes",
        "Rollout and rollback steps for key format changes and TTL changes",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Cache stampede causes backend overload",
  "Incorrect invalidation leads to stale or inconsistent reads",
  "Key format change causes widespread misses or collisions",
  "Evictions under memory pressure cause thrash and latency spikes",
  "Cache becomes a hidden dependency and single point of failure",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Caching improves performance without harming correctness");
  plan.invariants.push("Fallback behavior works when cache is slow or unavailable");
  plan.testPlan.unit.push("Key construction and TTL behavior tests");
  plan.testPlan.integration.push("Fallback behavior and invalidation under updates");
  plan.checks.preDeploy.push("Load test or targeted benchmark for cached endpoints");
  plan.checks.postDeploy.push("Monitor hit rate, latency, evictions, and backend load during rollout");
  plan.rollbackReadiness.push("Rollback includes disabling cache usage or reverting key strategy");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "feature-flag";
  plan.plan.phases.push("Enable caching for a small cohort or limited endpoints first");
  plan.plan.phases.push("Increase gradually while monitoring guardrails");
  plan.plan.guardrails.push("Hit rate, cache latency, backend load, error rate, evictions");
  plan.plan.abortSignals.push("Backend load spikes, cache latency spikes, or correctness regressions");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Backend load spikes or correctness regressions");
  plan.steps.push("Disable cache feature flag or revert to previous key/TTL strategy");
  plan.validationAfterRollback.push("Confirm backend load and correctness return to baseline");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Cache health: hit rate, latency, evictions, memory, connections");
  plan.alerts.push("Alert on sustained eviction spikes or cache latency regressions");
  plan.runbooks.push("Cache runbook: mitigate stampede, adjust TTL, disable cache, validate");
  return plan;
};

export const criteriaPack = () => [
  "Caching semantics and invalidation strategy are explicit and testable",
  "Stampede protection and degradation behavior are explicit",
  "Key versioning and rollback strategy exist for cache format changes",
];

