import { runQualityGate } from "../../core/loops/quality_gate.js";
import { defaultDevelop } from "../../core/primitives.js";
import { normalizeTask } from "../../core/task.js";

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

export const founderOperatingSystem = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Founder operating system",
      prompt:
        "Create a founder operating system for the startup. Output JSON:\n" +
        "{\n" +
        "  \"northStar\": {\"metric\": string, \"definition\": string, \"cadence\": string},\n" +
        "  \"goals_90d\": [{\"goal\": string, \"success_metric\": string, \"owner\": string}],\n" +
        "  \"weekly_rhythm\": [{\"day\": string, \"blocks\": [{\"name\": string, \"purpose\": string, \"duration_minutes\": number}]}],\n" +
        "  \"meetings\": [{\"name\": string, \"cadence\": string, \"attendees\": string[], \"agenda\": string[], \"outputs\": string[]}],\n" +
        "  \"decision_rules\": [{\"decision\": string, \"rule\": string, \"owner\": string, \"checklist\": string[]}],\n" +
        "  \"scorecard\": [{\"metric\": string, \"definition\": string, \"target\": string, \"owner\": string}],\n" +
        "  \"constraints\": string[],\n" +
        "  \"open_questions\": string[]\n" +
        "}\n\n" +
        "Be concrete, operational, and stage-appropriate. Do not invent facts; use input/context where provided.",
      input,
    },
    ctx,
    [
      "Operating system is actionable and specific (cadences, owners, outputs)",
      "Metrics are defined precisely with cadence and targets",
      "Constraints and open questions are explicit and honest",
    ],
    opts
  );
};

export const founderNarrative = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Founder narrative",
      prompt:
        "Draft a founder narrative for investors/customers. Output JSON:\n" +
        "{\n" +
        "  \"one_liner\": string,\n" +
        "  \"problem\": string,\n" +
        "  \"insight\": string,\n" +
        "  \"why_now\": string,\n" +
        "  \"wedge\": string,\n" +
        "  \"icp\": string,\n" +
        "  \"differentiation\": string,\n" +
        "  \"proof_points\": string[],\n" +
        "  \"risks\": [{\"risk\": string, \"mitigation\": string}],\n" +
        "  \"story_arc\": [string],\n" +
        "  \"objections\": [{\"objection\": string, \"response\": string}]\n" +
        "}\n\n" +
        "Keep it crisp, high-trust, and free of hype. Do not invent facts; label assumptions explicitly in proof_points when needed.",
      input,
    },
    ctx,
    [
      "Narrative is clear and coherent (problem -> insight -> why now -> wedge)",
      "Claims are credible and supported by proof points or explicit assumptions",
      "Risks and objections are addressed without hand-waving",
    ],
    opts
  );
};

export { productStrategyFlow } from "./product_strategy.js";
export { investorDeckProcess } from "./investor_deck_process.js";

