import { rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate, sloSketchTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "frontend",
  sections: [
    {
      title: "UX And UI Structure",
      prompts: [
        "What is the user journey and key states (loading/empty/error/success)?",
        "Which pages/routes/components are impacted?",
        "Any design system or token changes required?",
      ],
    },
    {
      title: "State And Data Fetching",
      prompts: [
        "What data is needed and where does it come from (API/cache/local state)?",
        "How is caching/invalidation handled?",
        "How do we handle retries/timeouts and user-visible errors?",
      ],
    },
    {
      title: "Accessibility And Internationalization",
      prompts: [
        "Keyboard navigation, focus management, semantics, ARIA where needed",
        "Color contrast and motion preferences",
        "Copy and formatting: locale, dates, numbers (if applicable)",
      ],
    },
    {
      title: "Performance And Resilience",
      prompts: [
        "Performance budgets (bundle size, key route LCP/INP targets)",
        "Error boundaries and fallbacks for partial failure",
        "Analytics and logging for key user actions and errors",
      ],
    },
    {
      title: "Release Strategy",
      prompts: [
        "Feature flag / progressive release strategy",
        "Rollout guardrails and rollback triggers",
        "Monitoring plan for user impact (errors, latency, conversion)",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Broken route navigation or rendering regression",
  "Unhandled promise rejection causing blank screens",
  "API contract mismatch causing runtime failures",
  "Accessibility regressions (focus traps, missing labels)",
  "Performance regression due to bundle size or heavy rendering",
  "Incorrect caching leading to stale or inconsistent UI",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("User-visible behavior is correct across key states");
  plan.invariants.push("No blank screens; errors render actionable messages");
  plan.testPlan.unit.push("Component behavior for loading/empty/error states");
  plan.testPlan.integration.push("Data fetching and caching/invalidation flows");
  plan.testPlan.e2e.push("Critical user journeys across supported browsers");
  plan.checks.manual.push("Keyboard navigation and screen reader spot-check");
  plan.checks.preDeploy.push("Bundle size and performance budget check");
  plan.checks.postDeploy.push("Smoke test key routes and analytics events");
  plan.rollbackReadiness.push("Rollback plan for feature flag or deploy reversion exists");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Spike in JS errors or blank screens");
  plan.triggers.push("Sustained performance regression on key routes");
  plan.steps.push("Disable feature flag or revert release to previous build");
  plan.steps.push("Invalidate affected caches/CDN if necessary");
  plan.validationAfterRollback.push("Confirm error rates return to baseline");
  plan.validationAfterRollback.push("Confirm key routes and flows work");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.goldenSignals.errors.push("JS error rate and unhandled rejection rate");
  plan.goldenSignals.latency.push("Page load (LCP) and interaction latency (INP)");
  plan.dashboards.push("Frontend health: errors, core web vitals, conversion");
  plan.alerts.push("Alert on sustained error rate or blank-screen detection");
  plan.logs.push("Client-side error logging with correlation IDs");
  plan.runbooks.push("Frontend incident runbook: disable flag, rollback, validate");
  return plan;
};

export const defaultSloSketch = () => {
  const slo = sloSketchTemplate();
  slo.service = "frontend";
  slo.indicators.push("LCP on key routes");
  slo.indicators.push("JS error rate");
  slo.objectives.push("LCP p75 under agreed budget for key routes");
  slo.objectives.push("JS error rate under agreed threshold");
  slo.alerting.push("Page experience alerting tied to user impact");
  return slo;
};

export const criteriaPack = () => [
  "Plan covers pages/routes/components and key UX states (loading/empty/error/success)",
  "Accessibility checks are included (keyboard, focus, semantics)",
  "Performance budget and regressions are addressed (bundle size, LCP/INP where relevant)",
];
