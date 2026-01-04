import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";

export const withDataDrivenWork =
  ({ prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);
    const normalized = normalizeTask(task);

    const dataNotes = act(
      prompt ??
        "Make this change data-driven: identify key metrics, logging, experiments, and how to validate via data.",
      { ...ctx, task: normalized }
    );

    return next(task, { ...ctx, dataNotes });
  };
