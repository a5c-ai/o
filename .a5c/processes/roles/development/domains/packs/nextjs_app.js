import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "nextjs_app",
  sections: [
    {
      title: "App Router And Rendering Model",
      prompts: [
        "Which routes (app/...) change, and what is their rendering mode (SSR/SSG/ISR)?",
        "Any server actions, route handlers, middleware, or edge runtime concerns?",
        "Caching strategy: fetch cache, revalidate, tags, and invalidation behavior",
      ],
    },
    {
      title: "UX States And Data Boundaries",
      prompts: [
        "Loading and error UI at route and component boundaries",
        "Suspense boundaries and fallbacks for partial data",
        "Client/server component split and data ownership",
      ],
    },
    {
      title: "Performance And SEO",
      prompts: [
        "Route-level performance budgets and largest content elements",
        "Image optimization, streaming, and bundle impact",
        "SEO metadata, structured data, and robots/index behavior (if relevant)",
      ],
    },
    {
      title: "Operational Concerns",
      prompts: [
        "Rollout strategy (flag, progressive, canary) and safe rollback",
        "Monitoring: route errors, web vitals, and user-impact indicators",
        "CDN/cache purge or invalidation steps if needed",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Caching bug causing stale content or incorrect personalization",
  "Server action misuse causing auth bypass or CSRF-like behaviors",
  "Route handler regression causing 5xx spikes",
  "Hydration mismatch or client/server component boundary issues",
  "ISR revalidation storms or backend load amplification",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Next.js routes render correctly under the intended rendering model");
  plan.invariants.push("Caching and revalidation rules preserve correctness");
  plan.testPlan.integration.push("Route handler behavior (errors, auth, caching headers)");
  plan.testPlan.e2e.push("Critical routes with SEO and auth states");
  plan.checks.preDeploy.push("Verify route-level caching/revalidate configuration");
  plan.checks.preDeploy.push("Verify bundle and route performance budgets where applicable");
  plan.checks.postDeploy.push("Monitor route 5xx, web vitals, and user impact metrics during rollout");
  plan.rollbackReadiness.push("Rollback plan includes cache invalidation and flag disable if applicable");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "feature-flag";
  plan.plan.phases.push("Enable for internal users or small cohort first");
  plan.plan.phases.push("Increase cohort gradually with guardrails");
  plan.plan.guardrails.push("Route 5xx, JS errors, LCP/INP for key routes");
  plan.plan.abortSignals.push("Sustained route 5xx or web vitals regression");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Route 5xx increase or rendering regressions on key routes");
  plan.triggers.push("Caching correctness regressions (stale content or wrong users)");
  plan.steps.push("Disable feature flag and redeploy previous build if needed");
  plan.steps.push("Invalidate relevant caches/tags if applicable");
  plan.validationAfterRollback.push("Confirm key routes render correctly and error rates normalize");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Next.js routes: 5xx, latency, cache hit rates");
  plan.dashboards.push("Client: JS errors, LCP/INP for key routes");
  plan.alerts.push("Alert on sustained route 5xx increase");
  plan.alerts.push("Alert on sustained web vitals regression for key routes");
  plan.runbooks.push("Next.js rollback runbook: disable flag, revert, invalidate caches");
  return plan;
};

export const criteriaPack = () => [
  "Routes and rendering mode are explicit (SSR/SSG/ISR) and tested",
  "Caching and revalidation behavior is correct and has rollback steps",
  "Error and loading boundaries exist at the right levels (route and component)",
];
