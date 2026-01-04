import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";

export const withErrorHandlingReview =
  ({ prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);
    const normalized = normalizeTask(task);

    const errorHandlingNotes = act(
      prompt ??
        "Perform an error-handling review: failure modes, retries/timeouts, user-facing messages, and logging. Return short bullets.",
      { ...ctx, task: normalized }
    );

    ctx.errorHandlingNotes = errorHandlingNotes;
    return next(task, ctx);
  };
