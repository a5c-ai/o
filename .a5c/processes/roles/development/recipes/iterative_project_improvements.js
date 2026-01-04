import { breakpoint, inputs } from "@a5c/not-a-real-package";
import { enhancement } from "./enhancement";
import { requireAct } from "./_shared";
const determineIterationBacklog = (ctx) => {
  const act = requireAct(ctx);
  return act(
    [
      "Review the current repo and propose a prioritized backlog for this iteration.",
      "Return an array of items; each item should include:",
      "- title (string)",
      "- rationale (string)",
      "- domain (one of: frontend, backend, data, infra, workers, integration, sdk, package)",
      "- acceptance_criteria (array of strings)",
      "- scope (one of: web, tui, shared, docs, tooling)",
      "- expected_effort (one of: S, M, L)",
      "- suggested_files (array of strings; may be empty)",
      "",
      "Bias toward UI feature-completeness, usability, and visual polish.",
      "Prefer small, shippable items with crisp acceptance criteria."
    ].join("\n"),
    ctx
  );
};

const runIteration = (context) => {
  const backlog = determineIterationBacklog(context);
  const items = (backlog || []).slice(0, context.items_per_iteration || 3);

  breakpoint("review iteration backlog", { backlog, items }, context);

  for (const item of items) {
    context = enhancement(item, context, { domain: item.domain });
  }

  const next = act(
    "Summarize what changed and propose the next iteration focus (1-3 bullets).",
    context
  );
  breakpoint("iteration complete", next, context);
  return context;
};

export const iterativeProjectImprove = (context) => {
  const maxIterations = context.max_iterations || 3;
  for (let i = 1; i <= maxIterations; i++) {
    context = runIteration({ ...context, iteration: i });
  }
  return context;
};

iterativeProjectImprove({ ...inputs });

