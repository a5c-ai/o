import { primitivesFrom, requirePrimitive } from "../primitives.js";
import { checkpointPlan } from "../checkpoints.js";
import { normalizeTask } from "../task.js";

export const runPlanExecute = ({
  task,
  ctx = {},
  develop,
  checkpoint = true,
  planPrompt,
  maxSteps = 20,
  perStepGate,
}) => {
  const primitives = primitivesFrom(ctx);
  const act = primitives.act;
  requirePrimitive("act", act);

  develop = develop ?? primitives.develop;
  requirePrimitive("develop", develop);

  const normalized = normalizeTask(task);

  const plan =
    act(
      planPrompt ??
        "Produce an ordered plan as an array of steps. " +
          "Each step: {\"title\": string, \"task\": string}. Keep steps small and verifiable.",
      { ...ctx, task: normalized }
    ) ?? [];

  const steps = Array.isArray(plan) ? plan.slice(0, maxSteps) : [];
  if (checkpoint) checkpointPlan(ctx, { task: normalized, steps });

  const results = [];
  for (let idx = 0; idx < steps.length; idx++) {
    const step = steps[idx] ?? {};
    const stepTask = step.task ?? step.title ?? `Step ${idx + 1}`;
    const stepCtx = { ...ctx, plan: steps, step, stepIndex: idx };

    const output = perStepGate
      ? perStepGate({ task: stepTask, ctx: stepCtx, develop })
      : develop(stepTask, stepCtx);

    results.push({ step, output });
  }

  return { task: normalized, plan: steps, results };
};

