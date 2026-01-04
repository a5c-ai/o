import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { checkpointSpec } from "../../../core/checkpoints.js";
import { normalizeTask } from "../../../core/task.js";

export const withSpec =
  ({ checkpoint = false } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);

    const normalized = normalizeTask(task);

    const spec = act(
      "Write or update a concise spec: behavior, acceptance criteria, edge cases, and non-goals.",
      { ...ctx, task: normalized }
    );

    ctx.spec = spec;
    if (checkpoint) checkpointSpec(ctx, { task: normalized, spec });
    return next(task, ctx);
  };
