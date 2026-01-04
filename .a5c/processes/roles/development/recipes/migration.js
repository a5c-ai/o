import { runPlanExecute } from "../../core/loops/plan_execute.js";
import { buildDevelopForDomain, requireAct } from "./_shared.js";

export const migration = (task, ctx = {}, { domain = "backend" } = {}) => {
  const act = requireAct(ctx);
  const develop = buildDevelopForDomain(domain, { baseDevelop: ctx.develop });

  const planRun = runPlanExecute({
    task: {
      title: "Plan migration",
      prompt:
        "Plan a safe migration: inventory, sequencing, backward-compat strategy, rollout/rollback, and validation. " +
        "Include checkpoints for risky steps.",
    },
    ctx,
    develop,
    checkpoint: true,
  });

  const execution = runPlanExecute({ task, ctx: { ...ctx, migrationPlan: planRun }, develop });
  const summary = act("Summarize migration steps and rollback strategy.", { ...ctx, planRun, execution });
  return { planRun, execution, summary };
};

