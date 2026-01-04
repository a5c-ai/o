import { applyMiddlewares } from "../../core/compose.js";
import { defaultDevelop } from "../../core/primitives.js";
import { withSpec } from "../aspects/spec.js";
import { withTests } from "../aspects/tests.js";
import { withQualityGate } from "../aspects/quality.js";
import { requireAct } from "./_shared.js";

export const qualityGatedChange = (
  task,
  ctx = {},
  { threshold = 0.9, maxIters = 5, checkpoint = false } = {}
) => {
  const act = requireAct(ctx);

  const develop = applyMiddlewares(
    ctx.develop ?? defaultDevelop,
    withSpec({ checkpoint }),
    withTests({ checkpoint }),
    withQualityGate({ threshold, maxIters })
  );

  const work = develop(task, ctx);
  const summary = act("Write a short summary and verification checklist.", { ...ctx, work });
  return { work, summary };
};

