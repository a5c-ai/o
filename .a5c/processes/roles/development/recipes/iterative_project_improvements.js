import { checkpoint } from "../../../core/checkpoints.js";
import { enhancement } from "./enhancement.js";
import { requireAct } from "./_shared.js";

const determineIterationBacklog = (ctx) => {
  const act = requireAct(ctx);
  return act(
    [
      "Review the current repo and propose a prioritized backlog for this iteration.",
      "Return a JSON array of items; each item should include:",
      "- title (string)",
      "- rationale (string)",
      "- domain (one of: frontend, backend, data, infra, workers, integration, sdk, package)",
      "- acceptance_criteria (array of strings)",
      "- scope (one of: web, tui, shared, docs, tooling)",
      "- expected_effort (one of: S, M, L)",
      "- suggested_files (array of strings; may be empty)",
      "",
      "Prefer small, shippable items with crisp acceptance criteria.",
    ].join("\n"),
    ctx
  );
};

const runIteration = (ctx, opts = {}) => {
  const act = requireAct(ctx);

  const backlog = determineIterationBacklog(ctx);
  const items = Array.isArray(backlog) ? backlog.slice(0, opts.itemsPerIteration ?? 3) : [];

  checkpoint("iterative_project_improvements_backlog", ctx, { backlog, items });

  let nextCtx = ctx;
  const iterationRuns = [];
  for (const item of items) {
    nextCtx = { ...nextCtx, lastIterationItem: item };
    const result = enhancement(item, nextCtx, { domain: item.domain, quality: opts.quality });
    iterationRuns.push({ item, result });
  }

  const summary = act(
    "Summarize what changed and propose the next iteration focus (1-3 bullets).",
    nextCtx
  );
  checkpoint("iterative_project_improvements_iteration_complete", nextCtx, { summary });

  return { ...nextCtx, iterationRuns, summary };
};

export const iterativeProjectImprovements = (task, ctx = {}, opts = {}) => {
  const maxIterations = opts.maxIterations ?? 3;
  const baseCtx = { ...ctx, task };

  let current = baseCtx;
  for (let i = 1; i <= maxIterations; i++) {
    current = runIteration({ ...current, iteration: i }, opts);
  }

  return current;
};

export const iterativeProjectImprove = iterativeProjectImprovements;

