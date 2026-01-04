import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";

const gate = (task, ctx, criteria, opts = {}) =>
  runQualityGate({
    task,
    ctx,
    develop: defaultDevelop,
    criteria,
    threshold: opts.threshold ?? 0.85,
    maxIters: opts.maxIters ?? 4,
    checkpoint: opts.checkpoint ?? false,
  });

export const uxReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "UX review",
      prompt:
        "Perform a UX review. Include: target users, key journeys, key states " +
        "(loading/empty/error/success), accessibility notes, copy tone, " +
        "edge cases, and top usability risks with fixes.",
      input,
    },
    ctx,
    [
      "Covers key journeys and all major UI states",
      "Accessibility and usability risks are concrete and prioritized",
      "Recommendations are actionable and testable",
    ],
    opts
  );
};

export const designSystemAudit = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Design system audit",
      prompt:
        "Audit design system usage and propose improvements. Include: " +
        "token usage, component consistency, interaction patterns, " +
        "naming conventions, and migration steps. Output JSON: " +
        "{\"findings\": string[], \"recommendedTokens\": string[], \"components\": string[], " +
        "\"migrationPlan\": string[], \"risks\": string[]}",
      input,
    },
    ctx,
    [
      "Findings are specific and map to consistent patterns",
      "Migration steps are incremental and feasible",
      "Risks and edge cases are explicit (a11y, responsiveness, theming)",
    ],
    opts
  );
};

export const accessibilityReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Accessibility review",
      prompt:
        "Perform an accessibility review. Include: keyboard navigation, focus order, " +
        "semantics, ARIA where needed, contrast, motion preferences, and screen reader notes. " +
        "Output JSON: {\"issues\": [{\"issue\": string, \"severity\": \"high\"|\"med\"|\"low\", \"fix\": string}], " +
        "\"checks\": string[], \"regressionsToWatch\": string[]}",
      input,
    },
    ctx,
    [
      "Issues are concrete with fixes and severities",
      "Checks are executable and scoped to the change",
      "Covers keyboard, focus, semantics, and contrast consistently",
    ],
    opts
  );
};

export const contentReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Content review",
      prompt:
        "Review and improve UX copy/content. Include: tone, clarity, error messages, " +
        "empty states, and microcopy for actions. Output JSON: " +
        "{\"principles\": string[], \"revisions\": [{\"where\": string, \"before\": string, \"after\": string}], " +
        "\"glossary\": string[], \"risks\": string[]}",
      input,
    },
    ctx,
    [
      "Copy is clear, consistent, and user-centered",
      "Error and empty states are actionable and non-blaming",
      "Revisions are specific with rationale implied by principles",
    ],
    opts
  );
};

