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

export const trackingPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Tracking plan",
      prompt:
        "Create a tracking plan. Output JSON: " +
        "{\"events\": [{\"name\": string, \"when\": string, \"properties\": object, \"pii\": boolean}], " +
        "\"userProperties\": object, \"guardrails\": string[], \"validation\": string[], \"owners\": string[]}",
      input,
    },
    ctx,
    [
      "Events are tied to product goals and user actions",
      "Properties are defined precisely and avoid unnecessary PII",
      "Validation plan ensures data quality and consistency",
    ],
    opts
  );
};

export const metricDefinitions = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Metric definitions",
      prompt:
        "Define metrics and guardrails. Output JSON: " +
        "{\"metrics\": [{\"name\": string, \"definition\": string, \"ownerRole\": string, \"cadence\": string}], " +
        "\"guardrails\": [{\"name\": string, \"definition\": string, \"threshold\": string}], " +
        "\"dataSources\": string[], \"knownBiases\": string[]}",
      input,
    },
    ctx,
    [
      "Definitions are unambiguous and measurable",
      "Guardrails prevent harm and are monitorable",
      "Data sources and biases are explicit",
    ],
    opts
  );
};

export const dashboardSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Dashboard spec",
      prompt:
        "Create a dashboard spec. Output JSON: " +
        "{\"audience\": string, \"questions\": string[], " +
        "\"charts\": [{\"title\": string, \"metric\": string, \"breakdowns\": string[], \"filters\": string[]}], " +
        "\"refreshCadence\": string, \"alerts\": string[], \"dataQualityChecks\": string[]}",
      input,
    },
    ctx,
    [
      "Dashboard answers specific questions for an audience",
      "Charts map to defined metrics and include useful breakdowns",
      "Includes data quality checks and alerting where appropriate",
    ],
    opts
  );
};

