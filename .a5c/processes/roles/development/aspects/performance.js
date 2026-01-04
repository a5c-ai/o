import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";

export const withPerformanceReview =
  ({ prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);
    const normalized = normalizeTask(task);

    const performanceNotes = act(
      prompt ??
        "Perform a performance review: complexity, hot paths, caching, and measurement/benchmarks. Return short bullets.",
      { ...ctx, task: normalized }
    );

    return next(task, { ...ctx, performanceNotes });
  };

