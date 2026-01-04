import { runPlanExecute } from "../../../core/loops/plan_execute.js";
import { buildDevelopForDomain, requireAct } from "./_shared.js";

export const migration = (task, ctx = {}, { domain = "backend" } = {}) => {
  const act = requireAct(ctx);
  const develop = buildDevelopForDomain(domain, {
    baseDevelop: ctx.develop,
    planning: { enabled: true, checkpoint: true },
  });

  const planRun = runPlanExecute({
    task: {
      title: "Plan migration",
      prompt:
        "Plan a safe migration: inventory, sequencing, expand/contract compatibility approach, rollout/rollback, " +
        "verification, data validation, and runbooks. Include checkpoints for risky steps.",
    },
    ctx,
    develop,
    checkpoint: true,
  });

  const execution = runPlanExecute({ task, ctx: { ...ctx, migrationPlan: planRun }, develop });
  const summary = act("Summarize migration steps and rollback strategy.", { ...ctx, planRun, execution });
  return { planRun, execution, summary };
};
