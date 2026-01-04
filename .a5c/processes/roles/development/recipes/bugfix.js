import { runTriageFixVerify } from "../../core/loops/triage_fix_verify.js";
import { buildDevelopForDomain, requireAct } from "./_shared.js";

export const bugfix = (task, ctx = {}, { domain = "backend", quality = true } = {}) => {
  const act = requireAct(ctx);

  const develop = buildDevelopForDomain(domain, {
    baseDevelop: ctx.develop,
    quality: quality ? { threshold: 0.9, maxIters: 4 } : { threshold: 0, maxIters: 1, criteria: [] },
  });

  const result = runTriageFixVerify({ task, ctx, develop });

  const post = act("Summarize the fix and verification in a short changelog-style note.", {
    ...ctx,
    result,
  });

  return { ...result, post };
};

