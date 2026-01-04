import { runPlanExecute } from "../../core/loops/plan_execute.js";
import { buildPackageDevelop } from "../domains/package.js";
import { requireAct } from "./_shared.js";

export const dependencyUpgrade = (
  task,
  ctx = {},
  { quality = { threshold: 0.9, maxIters: 4 } } = {}
) => {
  const act = requireAct(ctx);
  const develop = buildPackageDevelop({ baseDevelop: ctx.develop, quality });

  const planRun = runPlanExecute({
    task: {
      title: "Plan dependency upgrade",
      prompt:
        "Plan a dependency upgrade: target versions, breaking changes, upgrade steps, tests, and rollback. " +
        "Prefer incremental upgrades and verification after each.",
    },
    ctx,
    develop,
    checkpoint: true,
  });

  const execution = runPlanExecute({ task, ctx: { ...ctx, upgradePlan: planRun }, develop });
  const wrapUp = act("Write a concise upgrade summary and verification checklist.", { ...ctx, planRun, execution });
  return { planRun, execution, wrapUp };
};

