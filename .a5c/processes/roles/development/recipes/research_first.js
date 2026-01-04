import { applyMiddlewares } from "../../../core/compose.js";
import { defaultDevelop } from "../../../core/primitives.js";
import { withResearch } from "../aspects/research.js";
import { withSpec } from "../aspects/spec.js";
import { runPlanExecute } from "../../../core/loops/plan_execute.js";
import { requireAct } from "./_shared.js";

export const researchFirst = (task, ctx = {}, { checkpoint = true } = {}) => {
  const act = requireAct(ctx);

  const develop = applyMiddlewares(
    ctx.develop ?? defaultDevelop,
    withResearch({
      mode: "always",
      checkpointName: checkpoint ? "research" : "research_no_checkpoint",
    }),
    withSpec({ checkpoint })
  );

  const planRun = runPlanExecute({ task, ctx, develop, checkpoint });
  const decisions = act("Extract key decisions made and list them as short bullets.", {
    ...ctx,
    planRun,
  });

  return { planRun, decisions };
};
