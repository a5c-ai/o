import { applyMiddlewares } from "../../../core/compose.js";
import { withDomainContext } from "../domains/_domain_utils.js";
import { withDomainPlanning } from "../aspects/domain_planning.js";

const noopDevelop = (task, ctx = {}) => {
  return { planningOnly: true, task, domain: ctx.domain, domainPlanning: ctx.domainPlanning };
};

export const domainPlanning = (task, ctx = {}, { domain = ctx.domain ?? "backend", checkpoint = true } = {}) => {
  const develop = applyMiddlewares(
    noopDevelop,
    withDomainContext({ domain, aspects: { planning: true } }),
    withDomainPlanning({ domain, checkpoint })
  );

  const output = develop(task, ctx);
  return { output, domainPlanning: output?.domainPlanning ?? ctx.domainPlanning };
};

