import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";

export const withRefactorGuardrails =
  ({ prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);
    const normalized = normalizeTask(task);

    const refactorGuardrails = act(
      prompt ??
        "Set refactor guardrails: what NOT to change, allowed scope, and how to keep diffs minimal while still correct.",
      { ...ctx, task: normalized }
    );

    return next(task, { ...ctx, refactorGuardrails });
  };

