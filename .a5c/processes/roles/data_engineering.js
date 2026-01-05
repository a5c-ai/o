import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";

const gate = (task, ctx, criteria, opts = {}) =>
  runQualityGate({
    task,
    ctx,
    develop: defaultDevelop,
    criteria,
    threshold: opts.threshold ?? 0.92,
    maxIters: opts.maxIters ?? 5,
    checkpoint: opts.checkpoint ?? false,
  });

export const pipelineSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Pipeline specification",
      prompt:
        "Write a data pipeline spec. Output JSON: " +
        "{\"sources\": string[], \"sinks\": string[], \"schedule\": string, \"sla\": string, " +
        "\"contracts\": {\"name\": string, \"schema\": string, \"constraints\": string[]}[], " +
        "\"transformations\": {\"name\": string, \"inputs\": string[], \"outputs\": string[], \"notes\": string[]}[], " +
        "\"failureHandling\": {\"retries\": string, \"deadLetter\": string, \"backfill\": string}, " +
        "\"observability\": {\"metrics\": string[], \"alerts\": string[], \"dashboards\": string[]}, " +
        "\"runbook\": {\"triage\": string[], \"recovery\": string[]}}",
      input,
    },
    ctx,
    [
      "Spec defines contracts, constraints, and expected SLAs",
      "Failure handling and backfill strategy are explicit and realistic",
      "Observability and runbook steps are actionable",
    ],
    opts
  );
};

export const warehouseModelReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Warehouse model review",
      prompt:
        "Review the warehouse model or schema design in the input. Output JSON: " +
        "{\"strengths\": string[], \"risks\": string[], \"namingIssues\": string[], \"grainIssues\": string[], " +
        "\"dimFactNotes\": string[], \"performanceNotes\": string[], \"governanceNotes\": string[], \"recommendations\": string[]}",
      input,
    },
    ctx,
    [
      "Identifies grain/joins and modeling risks that affect correctness",
      "Calls out performance and cost risks with concrete mitigations",
      "Recommendations are prioritized and implementable",
    ],
    opts
  );
};

export const dataQualityChecksPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Data quality checks plan",
      prompt:
        "Create a data quality checks plan. Output JSON: " +
        "{\"scope\": string, \"checks\": {\"name\": string, \"type\": string, \"target\": string, \"queryOrRule\": string, " +
        "\"severity\": \"low\"|\"medium\"|\"high\", \"owner\": string}[], " +
        "\"freshness\": string[], \"anomalyDetection\": string[], \"alerting\": {\"channels\": string[], \"oncall\": string}}",
      input,
    },
    ctx,
    [
      "Checks cover correctness, completeness, freshness, and schema drift where relevant",
      "Alerting is actionable with clear severity and ownership",
      "Plan is scoped and avoids noisy or redundant checks",
    ],
    opts
  );
};

export const backfillRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Backfill runbook",
      prompt:
        "Write a backfill runbook. Output JSON: " +
        "{\"prechecks\": string[], \"execution\": {\"phases\": string[], \"throttling\": string, \"monitoring\": string[]}, " +
        "\"dataValidation\": string[], \"rollback\": {\"triggers\": string[], \"steps\": string[]}, \"postchecks\": string[]}",
      input,
    },
    ctx,
    [
      "Runbook includes safe prechecks, throttling, and monitoring",
      "Data validation steps are concrete and map to expected invariants",
      "Rollback triggers and steps are explicit and realistic",
    ],
    opts
  );
};

