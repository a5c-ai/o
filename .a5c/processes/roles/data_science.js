import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";

const gate = (task, ctx, criteria, opts = {}) =>
  runQualityGate({
    task,
    ctx,
    develop: defaultDevelop,
    criteria,
    threshold: opts.threshold ?? 0.85,
    maxIters: opts.maxIters ?? 4,
    checkpoint: opts.checkpoint ?? false,
  });

export const modelSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Model spec",
      prompt:
        "Write a model spec. Output JSON: " +
        "{\"problem\": string, \"users\": string[], \"inputs\": string[], \"outputs\": string[], " +
        "\"constraints\": string[], \"baseline\": string, \"risks\": string[], \"successMetrics\": string[]}",
      input,
    },
    ctx,
    [
      "Spec is concrete about inputs/outputs and constraints",
      "Risks include quality, privacy, and reliability",
      "Success metrics are measurable and tied to user impact",
    ],
    opts
  );
};

export const offlineEvaluationPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Offline evaluation plan",
      prompt:
        "Create an offline evaluation plan. Output JSON: " +
        "{\"datasets\": string[], \"splits\": string, \"metrics\": string[], " +
        "\"errorAnalysis\": string[], \"fairnessChecks\": string[], \"robustness\": string[], " +
        "\"acceptanceCriteria\": string[]}",
      input,
    },
    ctx,
    [
      "Evaluation includes metrics, error analysis, and robustness",
      "Acceptance criteria are explicit and testable",
      "Covers fairness/privacy constraints where relevant",
    ],
    opts
  );
};

export const modelMonitoringPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Model monitoring plan",
      prompt:
        "Create a model monitoring plan. Output JSON: " +
        "{\"signals\": string[], \"drift\": string[], \"quality\": string[], \"latency\": string[], " +
        "\"alerts\": string[], \"rollback\": string[], \"runbooks\": string[]}",
      input,
    },
    ctx,
    [
      "Monitoring covers drift, quality, and system health",
      "Alerts are actionable with runbooks",
      "Rollback and safety controls are explicit",
    ],
    opts
  );
};

