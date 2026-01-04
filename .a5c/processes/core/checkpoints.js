import { safeBreakpoint } from "./primitives.js";

export const checkpoint = (name, ctx = {}, details = {}) => {
  return safeBreakpoint(
    {
      checkpoint: name,
      details,
    },
    ctx
  );
};

export const checkpointPlan = (ctx, details) => checkpoint("plan", ctx, details);
export const checkpointSpec = (ctx, details) => checkpoint("spec", ctx, details);
export const checkpointTests = (ctx, details) => checkpoint("tests", ctx, details);
export const checkpointRelease = (ctx, details) => checkpoint("release", ctx, details);
export const checkpointStuck = (ctx, details) => checkpoint("stuck", ctx, details);

