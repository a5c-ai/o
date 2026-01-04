import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";

export const withDocs =
  ({ prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);
    const normalized = normalizeTask(task);

    const docsPlan = act(
      prompt ??
        "Identify doc updates required (README, inline docs, changelog, examples). Return a short actionable plan.",
      { ...ctx, task: normalized }
    );

    ctx.docsPlan = docsPlan;
    return next(task, ctx);
  };
