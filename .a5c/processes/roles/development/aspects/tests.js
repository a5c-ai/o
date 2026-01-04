import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { checkpointTests } from "../../../core/checkpoints.js";
import { normalizeTask } from "../../../core/task.js";

export const withTests =
  ({ checkpoint = false } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);

    const normalized = normalizeTask(task);

    const testPlan = act(
      "Define a test/verification plan: what to test, where, and how to run it. Keep it actionable.",
      { ...ctx, task: normalized }
    );

    ctx.testPlan = testPlan;
    if (checkpoint) checkpointTests(ctx, { task: normalized, testPlan });
    return next(task, ctx);
  };
