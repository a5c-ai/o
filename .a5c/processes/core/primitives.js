export const primitivesFrom = (ctx = {}) => {
  const act = ctx.act ?? globalThis.act;
  const score = ctx.score ?? globalThis.score;
  const breakpoint = ctx.breakpoint ?? globalThis.breakpoint;
  const develop = ctx.develop ?? globalThis.develop;

  return { act, score, breakpoint, develop };
};

export const requirePrimitive = (name, value) => {
  if (typeof value !== "function") {
    throw new Error(
      `Missing primitive '${name}'. Provide it on ctx.${name} or globalThis.${name}.`
    );
  }
  return value;
};

export const safeBreakpoint = (message, ctx = {}) => {
  const { breakpoint } = primitivesFrom(ctx);
  if (typeof breakpoint !== "function") return null;
  return breakpoint(message, ctx);
};

export const defaultDevelop = (task, ctx = {}) => {
  const { act } = primitivesFrom(ctx);
  requirePrimitive("act", act);

  if (typeof task === "string") return act(task, ctx);
  if (task && typeof task === "object") {
    const prompt = task.prompt ?? task.title ?? JSON.stringify(task);
    return act(prompt, { ...ctx, task });
  }

  return act(String(task), ctx);
};

