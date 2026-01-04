import { runPlanExecute } from "../../core/loops/plan_execute.js";
import { runQualityGate } from "../../core/loops/quality_gate.js";
import { buildDevelopForDomain, requireAct } from "./_shared.js";

export const enhancement = (
  task,
  ctx = {},
  { domain = "frontend", quality = { threshold: 0.85, maxIters: 4 } } = {}
) => {
  const act = requireAct(ctx);
  const develop = buildDevelopForDomain(domain, { baseDevelop: ctx.develop, quality });

  const planRun = runPlanExecute({
    task,
    ctx,
    develop,
    perStepGate:
      quality && quality.threshold
        ? ({ task: stepTask, ctx: stepCtx, develop: stepDevelop }) =>
            runQualityGate({
              task: stepTask,
              ctx: stepCtx,
              develop: stepDevelop,
              threshold: quality.threshold,
              maxIters: Math.max(1, Math.min(3, quality.maxIters ?? 3)),
            })
        : null,
  });

  const wrapUp = act("Write a short wrap-up: what changed, risks, and how to verify.", {
    ...ctx,
    planRun,
  });

  return { planRun, wrapUp };
};

