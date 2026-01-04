import { primitivesFrom, requirePrimitive } from "../primitives.js";
import { checkpointStuck } from "../checkpoints.js";
import { normalizeTask } from "../task.js";

export const runTriageFixVerify = ({
  task,
  ctx = {},
  develop,
  maxHypotheses = 5,
  checkpointOnUnclear = true,
}) => {
  const primitives = primitivesFrom(ctx);
  const act = primitives.act;
  requirePrimitive("act", act);

  develop = develop ?? primitives.develop;
  requirePrimitive("develop", develop);

  const normalized = normalizeTask(task);

  const repro = act(
    "Write a crisp bug report: expected vs actual, repro steps, environment, and impact.",
    { ...ctx, task: normalized }
  );

  const hypotheses = act(
    `List up to ${maxHypotheses} root-cause hypotheses, ordered by likelihood, and what evidence would confirm each.`,
    { ...ctx, task: normalized, repro }
  );

  if (
    checkpointOnUnclear &&
    (repro == null || hypotheses == null || (Array.isArray(hypotheses) && hypotheses.length === 0))
  ) {
    checkpointStuck(ctx, { reason: "insufficient_triage", repro, hypotheses });
  }

  const diagnosis = develop(
    {
      title: "Diagnose bug",
      prompt:
        "Narrow the hypotheses to the most likely root cause. " +
        "Identify the exact change needed and any risky side effects.",
      repro,
      hypotheses,
    },
    { ...ctx, task: normalized, repro, hypotheses }
  );

  const fix = develop(
    {
      title: "Implement minimal fix",
      prompt:
        "Implement the smallest safe fix for the identified root cause. " +
        "Prefer localized changes and avoid refactors unless necessary.",
      diagnosis,
    },
    { ...ctx, task: normalized, repro, diagnosis }
  );

  const verify = act(
    "Define verification steps (tests, manual checks) and regressions to prevent. Return a short checklist.",
    { ...ctx, task: normalized, repro, diagnosis, fix }
  );

  const prevention = develop(
    {
      title: "Add regression coverage",
      prompt:
        "Add or update automated coverage (tests or checks) to prevent regression. " +
        "If tests are infeasible, add a lightweight alternative (assertions, logs, docs).",
      verify,
    },
    { ...ctx, task: normalized, fix, verify }
  );

  return { task: normalized, repro, hypotheses, diagnosis, fix, verify, prevention };
};

