import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";

export const withGitHygiene =
  ({ prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);
    const normalized = normalizeTask(task);

    const gitNotes = act(
      prompt ??
        "Suggest git hygiene for this change: commit breakdown, commit message(s), and what files to avoid touching.",
      { ...ctx, task: normalized }
    );

    return next(task, { ...ctx, gitNotes });
  };

