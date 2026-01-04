import { applyMiddlewares } from "../../../core/compose.js";

export const applyOptionalMiddlewares = (baseDevelop, ...maybeMiddlewares) => {
  const middlewares = maybeMiddlewares.filter((mw) => typeof mw === "function");
  return applyMiddlewares(baseDevelop, ...middlewares);
};

export const normalizeFeature = (value, defaults = {}) => {
  if (value === false) return { enabled: false, ...defaults };
  if (value === true || value == null) return { enabled: true, ...defaults };
  if (typeof value === "object") {
    const { enabled = true, ...rest } = value;
    return { enabled, ...defaults, ...rest };
  }
  return { enabled: true, ...defaults };
};

export const normalizeQuality = (value, defaults = {}) => {
  const q = normalizeFeature(value, defaults);
  if (!q.enabled) return { enabled: false };
  if (typeof q.threshold === "number" && q.threshold <= 0) return { enabled: false };
  return q;
};

export const withDomainContext =
  ({ domain, aspects } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    return next(task, {
      ...ctx,
      domain: ctx.domain ?? domain,
      domainAspects: ctx.domainAspects ?? aspects,
    });
  };

