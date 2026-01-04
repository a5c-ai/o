import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { checkpoint } from "../../../core/checkpoints.js";
import { normalizeTask } from "../../../core/task.js";

export const withResearch =
  ({ mode = "auto", checkpointName = "research" } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);

    const normalized = normalizeTask(task);

    const shouldResearch =
      mode === "always"
        ? true
        : mode === "never"
          ? false
          : act(
              "Should this task be research-driven first (true/false)? Consider uncertainty, risk, and unfamiliar tech.",
              { ...ctx, task: normalized }
            );

    if (shouldResearch) {
      const research = act(
        "Research the task and options. Capture key decisions, tradeoffs, and recommended approach.",
        { ...ctx, task: normalized }
      );
      checkpoint(checkpointName, ctx, { task: normalized, research });
      ctx.research = research;
      return next(task, ctx);
    }

    return next(task, ctx);
  };
