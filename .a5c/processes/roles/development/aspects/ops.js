import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";

export const withOpsReview =
  ({ prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);
    const normalized = normalizeTask(task);

    const opsNotes = act(
      prompt ??
        "Perform an ops review: monitoring/alerts, runbooks, rollback, config, migrations, and safe deploy strategy. Return short bullets.",
      { ...ctx, task: normalized }
    );

    return next(task, { ...ctx, opsNotes });
  };
