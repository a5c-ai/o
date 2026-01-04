import { runQualityGate } from "../../../core/loops/quality_gate.js";

export const withQualityGate =
  ({ threshold = 0.8, maxIters = 5, criteria, buildCriteria } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    return runQualityGate({
      task,
      ctx,
      develop: next,
      criteria,
      buildCriteria,
      threshold,
      maxIters,
    });
  };

