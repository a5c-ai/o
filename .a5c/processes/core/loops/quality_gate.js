import { primitivesFrom, requirePrimitive } from "../primitives.js";
import { checkpointStuck } from "../checkpoints.js";
import { normalizeTask } from "../task.js";

const coerceScore = (scoreResult) => {
  if (scoreResult == null) return null;
  if (typeof scoreResult === "number") return scoreResult;
  if (typeof scoreResult === "object") {
    const card = scoreResult.scoreCard ?? scoreResult.scorecard ?? scoreResult;
    const reward = card.reward_total ?? card.rewardTotal ?? card.score ?? null;
    return typeof reward === "number" ? reward : null;
  }
  return null;
};

export const runQualityGate = ({
  task,
  ctx = {},
  develop,
  criteria,
  buildCriteria,
  threshold = 0.8,
  maxIters = 5,
}) => {
  const primitives = primitivesFrom(ctx);
  const act = primitives.act;
  const score = primitives.score;

  requirePrimitive("act", act);
  develop = develop ?? primitives.develop;
  requirePrimitive("develop", develop);

  const qualityCriteria =
    criteria ??
    (buildCriteria
      ? buildCriteria(task, ctx)
      : act(
          "Determine quality criteria for this task (array of strings). If none needed, return [].",
          { ...ctx, task: normalizeTask(task) }
        ));

  if (!Array.isArray(qualityCriteria) || qualityCriteria.length === 0) {
    return develop(task, ctx);
  }

  let currentTask = task;
  let last = null;

  for (let iter = 1; iter <= maxIters; iter++) {
    const iterCtx = { ...ctx, qualityCriteria, qualityGateIter: iter };
    const work = develop(currentTask, iterCtx);
    const scoreResult =
      typeof score === "function" ? score({ ...iterCtx, work, qualityCriteria }) : null;
    const numericScore = coerceScore(scoreResult);

    last = { iter, work, scoreResult, numericScore, qualityCriteria };
    if (numericScore != null && numericScore >= threshold) return work;

    currentTask = {
      title: "Improve work to meet quality criteria",
      prompt:
        "Improve the previous work to better satisfy the quality criteria. " +
        "Use the score/feedback to identify gaps, then revise accordingly.",
      qualityCriteria,
      previous: { work, scoreResult },
    };
  }

  checkpointStuck(ctx, {
    reason: "quality_gate_exhausted",
    threshold,
    maxIters,
    last,
  });

  return last?.work ?? develop(task, ctx);
};
