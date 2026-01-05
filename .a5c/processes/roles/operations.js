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

export const operatingCadence = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Operating cadence",
      prompt:
        "Design an operating cadence for the business. Output JSON: " +
        "{ \"time_horizons\": {\"daily\": string, \"weekly\": string, \"monthly\": string, \"quarterly\": string}, " +
        "\"meetings\": [{\"name\": string, \"cadence\": string, \"duration\": string, \"purpose\": string, " +
        "\"ownerRole\": string, \"requiredAttendees\": string[], \"optionalAttendees\": string[], " +
        "\"prework\": string[], \"agenda\": string[], \"inputs\": string[], \"outputs\": string[], " +
        "\"decisions\": string[], \"notes_template\": string}], " +
        "\"decision_log\": {\"where\": string, \"fields\": string[]}, " +
        "\"reporting\": [{\"artifact\": string, \"ownerRole\": string, \"cadence\": string, \"audience\": string, \"format\": string}], " +
        "\"communication_norms\": string[], \"risks\": [{\"risk\": string, \"mitigation\": string}] }",
      input,
    },
    ctx,
    [
      "Cadence includes clear rhythms across daily/weekly/monthly/quarterly horizons",
      "Meetings have explicit purpose, prework, agenda, and outputs/decisions",
      "Defines ownership, reporting artifacts, and communication norms that reduce ambiguity",
    ],
    opts
  );
};

export const operationalKpiTree = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Operational KPI tree",
      prompt:
        "Create an operational KPI tree that connects outcomes to drivers. Output JSON: " +
        "{ \"north_star\": {\"name\": string, \"definition\": string, \"formula\": string, \"cadence\": string, \"ownerRole\": string}, " +
        "\"kpis\": [{\"name\": string, \"type\": \"leading\"|\"lagging\", \"definition\": string, \"formula\": string, " +
        "\"source\": string, \"cadence\": string, \"ownerRole\": string, \"target\": string, \"thresholds\": {\"green\": string, \"yellow\": string, \"red\": string}, " +
        "\"drivers\": string[], \"notes\": string}], " +
        "\"relationships\": [{\"parent\": string, \"child\": string, \"direction\": \"increases\"|\"decreases\", \"rationale\": string}], " +
        "\"dashboards\": [{\"audience\": string, \"questions\": string[], \"tiles\": string[]}], " +
        "\"data_quality_checks\": string[] }",
      input,
    },
    ctx,
    [
      "KPI definitions are measurable with explicit formulas, sources, and owners",
      "Tree includes leading/lagging indicators and defensible parent-child relationships",
      "Includes targets/thresholds and data quality checks suitable for ongoing operations",
    ],
    opts
  );
};

export const processMapRaci = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Process map + RACI",
      prompt:
        "Map core operational processes and define RACI. Output JSON: " +
        "{ \"processes\": [{\"name\": string, \"scope\": string, \"trigger\": string, " +
        "\"steps\": [{\"step\": string, \"ownerRole\": string, \"system\": string, \"inputs\": string[], \"outputs\": string[], \"sla\": string}], " +
        "\"raci\": {\"R\": string[], \"A\": string[], \"C\": string[], \"I\": string[]}, " +
        "\"controls\": [{\"control\": string, \"frequency\": string, \"evidence\": string}], " +
        "\"metrics\": [{\"name\": string, \"definition\": string, \"target\": string}], " +
        "\"risks\": [{\"risk\": string, \"mitigation\": string}], \"sop_links\": string[] }], " +
        "\"roles\": string[], \"open_questions\": string[] }",
      input,
    },
    ctx,
    [
      "Processes are end-to-end with clear triggers, steps, and outputs (no gaps)",
      "RACI is unambiguous and matches step ownership and decision points",
      "Includes controls, metrics, and risks with concrete mitigations and evidence",
    ],
    opts
  );
};

export const vendorSelectionMemo = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Vendor selection memo",
      prompt:
        "Write a vendor selection memo for an operational need. Output JSON: " +
        "{ \"problem\": string, \"context\": string, \"requirements\": {\"must_have\": string[], \"nice_to_have\": string[]}, " +
        "\"stakeholders\": string[], " +
        "\"options\": [{\"name\": string, \"overview\": string, \"pros\": string[], \"cons\": string[], \"risks\": string[]}], " +
        "\"evaluation\": {\"criteria\": [{\"name\": string, \"weight\": number, \"how_measured\": string}], " +
        "\"scores\": [{\"vendor\": string, \"criterion\": string, \"score\": number, \"notes\": string}]}, " +
        "\"tco\": [{\"vendor\": string, \"one_time\": string, \"monthly\": string, \"assumptions\": string[]}], " +
        "\"security_legal\": {\"data_handling\": string, \"access\": string, \"contract_notes\": string, \"open_items\": string[]}, " +
        "\"implementation_plan\": {\"phases\": [{\"phase\": string, \"tasks\": string[], \"ownerRole\": string, \"when\": string}], \"rollout_risks\": string[]}, " +
        "\"recommendation\": {\"vendor\": string, \"why\": string, \"decision\": string, \"next_steps\": string[]} }",
      input,
    },
    ctx,
    [
      "Requirements and evaluation criteria are explicit and weighted",
      "Memo compares realistic options with TCO and security/legal considerations",
      "Recommendation is justified and includes an executable implementation plan",
    ],
    opts
  );
};

export const execBusinessReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Executive business review",
      prompt:
        "Prepare an executive business review (EBR) for leadership. Output JSON: " +
        "{ \"period\": string, \"audience\": string, " +
        "\"one_page_summary\": {\"wins\": string[], \"misses\": string[], \"key_metrics\": [{\"name\": string, \"value\": string, \"delta\": string, \"notes\": string}], " +
        "\"top_risks\": [{\"risk\": string, \"impact\": string, \"mitigation\": string}], \"asks\": string[]}, " +
        "\"narrative\": {\"what_happened\": string, \"why\": string, \"what_changes\": string}, " +
        "\"deep_dives\": [{\"topic\": string, \"insights\": string[], \"data\": string[], \"decisions_needed\": string[]}], " +
        "\"action_plan\": [{\"action\": string, \"ownerRole\": string, \"due\": string, \"success_criteria\": string}], " +
        "\"appendix\": {\"definitions\": string[], \"assumptions\": string[], \"open_questions\": string[]} }",
      input,
    },
    ctx,
    [
      "EBR highlights outcomes, drivers, and deltas with specific metrics and notes",
      "Calls out risks and decisions/asks clearly with proposed mitigations",
      "Includes an owned action plan with due dates and measurable success criteria",
    ],
    opts
  );
};

