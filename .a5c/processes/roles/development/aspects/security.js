import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";

export const withSecurityReview =
  ({ prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);
    const normalized = normalizeTask(task);

    const securityReview = act(
      prompt ??
        "Perform a security review: threat model, input validation, authz/authn, secrets, logging, and dependency risks. Return short bullets.",
      { ...ctx, task: normalized }
    );

    return next(task, { ...ctx, securityReview });
  };

