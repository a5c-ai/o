export const observabilityPlanTemplate = () => ({
  schema: "observability_plan/v1",
  goldenSignals: {
    latency: [],
    traffic: [],
    errors: [],
    saturation: [],
  },
  dashboards: [],
  alerts: [],
  logs: [],
  traces: [],
  runbooks: [],
});

export const sloSketchTemplate = () => ({
  schema: "slo_sketch/v1",
  service: "service-name",
  indicators: [],
  objectives: [],
  alerting: [],
  errorBudgetPolicy: [],
});

export const observabilityChecklist = () => [
  "Identify the primary user-visible failure modes",
  "Add dashboards for golden signals tied to the new/changed component",
  "Add alerts with actionable thresholds and runbooks",
  "Ensure logs include correlation IDs and key decision points",
  "Add traces for the critical path if distributed",
];

export const OBSERVABILITY_PROMPT = [
  "Create an observability plan for the task.",
  "Return short bullets grouped by: dashboards, alerts, logs, traces, runbooks.",
  "Make alerts actionable and link to a runbook step or owner.",
].join("\n");

export const SLO_PROMPT = [
  "Sketch an SLO plan for the task.",
  "Return short bullets grouped by: indicators, objectives, alerting, error budget policy.",
  "Keep it concrete and measurable; do not write prose paragraphs.",
].join("\n");

