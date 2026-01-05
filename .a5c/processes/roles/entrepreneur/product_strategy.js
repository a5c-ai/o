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

export const needFraming = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Need framing (canonical: need_framing)",
      prompt:
        "Return ONLY valid JSON for the canonical Need Framing artifact.\n\n" +
        "Requirements:\n" +
        '- `type` MUST be exactly \"need_framing\".\n' +
        "- `id` MUST be globally unique and stable; if an existing Need Framing artifact is provided in input/context, reuse its `id`.\n" +
        "- If an existing Need Framing artifact is provided, reuse stable child item ids for items that are the same (in `success_metrics`, `constraints`, `open_unknowns`); only mint new ids for truly new items.\n" +
        "- Required fields: `id`, `type`, `title`, `need_statement`, `links`.\n" +
        "- Include (when available): `success_metrics` (each {id,name,definition,target[,baseline]}), `constraints` (each {id,constraint}), `open_unknowns` (each {id,unknown}).\n" +
        "- `links` MUST be present (may be empty). Each link: {rel, target}. Allowed rel values: " +
        "\"source\"|\"context\"|\"stakeholder\"|\"metric\"|\"constraint\"|\"related_need\"|\"prior_artifact\"|\"external\".\n" +
        "- If a `links[].target` is an internal artifact id (not a URL), it MUST match the `id` of an artifact provided in input/context.\n" +
        "- If a prior Need Framing artifact is provided and you revise it, `links` SHOULD include {rel:\"prior_artifact\", target:<prior_need_id>}.\n" +
        "- If `schema_version` is present it MUST be \"1.0\".\n",
      input,
    },
    ctx,
    [
      "Returns ONLY valid JSON",
      "Matches canonical Need Framing shape (`type: need_framing`)",
      "Required fields present and correct types",
      "Reuses prior artifact IDs when provided",
    ],
    opts
  );
};

export const researchPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Research plan (canonical: research_plan)",
      prompt:
        "Return ONLY valid JSON for the canonical Research Plan artifact.\n\n" +
        "Upstream requirements (must be present in input/context):\n" +
        "- A Need Framing artifact (type: need_framing) with `id`.\n" +
        "- If present, `open_unknowns` (each {id, unknown}) MUST be used to derive research questions.\n\n" +
        "Artifact requirements:\n" +
        '- `type` MUST be exactly \"research_plan\".\n' +
        "- `id` MUST be globally unique and stable; if an existing Research Plan artifact is provided in input/context, reuse its `id`.\n" +
        "- `need_id` MUST equal the `id` of a Need Framing artifact provided in input/context. Do not invent IDs.\n" +
        "- Required fields: `id`, `type`, `need_id`, `research_questions`, `participant_profile`, `methods`, `deliverables`, `timeline_days`, `links`.\n" +
        "- `research_questions` MUST be derived from Need Framing `open_unknowns`:\n" +
        "  - Include one question per `open_unknowns[]` item when available.\n" +
        "  - Each question MUST include `id`, `question`, and `source_unknown_id` referencing `open_unknowns[].id`.\n" +
        "  - If an existing Research Plan artifact is provided, reuse stable `research_questions[].id` for questions with the same `source_unknown_id`; only mint new ids for truly new unknowns.\n" +
        "- `participant_profile` MUST be an object with: `who`, `sample_size_target`, `recruiting_sources`, `inclusion_criteria`, `exclusion_criteria`.\n" +
        "- `methods` MUST be an array of objects with: `id`, `method`, `purpose`, `sample_size`, `duration_minutes`, `notes`.\n" +
        "- `deliverables` MUST be an array of objects with: `id`, `deliverable`, `format`, `audience`, `due_in_days`.\n" +
        "- `timeline_days` MUST be an integer >= 1.\n" +
        "- `links` MUST be present (may be empty). Each link: {rel, target}. Allowed rel values: " +
        "\"source\"|\"context\"|\"stakeholder\"|\"metric\"|\"constraint\"|\"related_need\"|\"prior_artifact\"|\"external\".\n" +
        "- `links` MUST include {rel:\"prior_artifact\", target:<need_id>} to the Need Framing artifact id.\n" +
        "- Optional: `schema_version` (if present it MUST be \"1.0\").\n" +
        "- Optional: `errors` (array of {code,message}); if upstream IDs are missing, populate `errors` and keep arrays empty where needed.\n",
      input,
    },
    ctx,
    [
      "Returns ONLY valid JSON",
      "Matches canonical Research Plan shape (`type: research_plan`)",
      "`need_id` references an existing Need Framing artifact from context",
      "`research_questions` are derived from `open_unknowns` and reference their ids",
    ],
    opts
  );
};

export const conceptHypotheses = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Concepts & hypotheses (canonical: concept_hypotheses)",
      prompt:
        "Return ONLY valid JSON for the canonical Concept/Hypotheses artifact.\n\n" +
        "Requirements:\n" +
        '- `type` MUST be exactly \"concept_hypotheses\".\n' +
        "- `id` MUST be globally unique and stable; if an existing Concept/Hypotheses artifact is provided in input/context, reuse its `id`.\n" +
        "- `need_id` MUST equal the `id` of a Need Framing artifact provided in input/context. Do not invent IDs.\n" +
        "- Required top-level fields: `id`, `type`, `need_id`, `links`, `hypotheses`, `concepts`.\n" +
        "- `links` MUST be present (may be empty). Include traceability links:\n" +
        "  - MUST include {rel:\"prior_artifact\", target:<need_id>} to the Need Framing artifact id.\n" +
        "  - If a Research Plan artifact (type: research_plan) is provided in input/context, include {rel:\"prior_artifact\", target:<research_plan_id>}.\n" +
        "- Each hypothesis and concept MUST include: `id` (stable within this artifact), `assumptions` (array), `evidence` (array), `confidence` ({score_0_1, rationale}), `next_test` (object).\n" +
        "- If an existing Concept/Hypotheses artifact is provided, reuse stable `concepts[].id` and `hypotheses[].id` for items that are the same; only mint new ids for truly new concepts/hypotheses.\n" +
        "- If `schema_version` is present it MUST be \"1.0\".\n",
      input,
    },
    ctx,
    [
      "Returns ONLY valid JSON",
      "Matches canonical Concept/Hypotheses shape (`type: concept_hypotheses`)",
      "`need_id` references an existing Need Framing artifact from context",
      "Concept/hypothesis item IDs are stable and unique within the artifact",
    ],
    opts
  );
};

export const ranking = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Rank opportunities (canonical: ranking)",
      prompt:
        "Return ONLY valid JSON for the canonical Ranking artifact.\n\n" +
        "Input requirements (must be present in context):\n" +
        "- `need_id` (string): MUST equal the `id` of a Need Framing artifact provided in input/context. Do not invent IDs.\n" +
        "- `candidates` (array): each candidate references upstream IDs:\n" +
        "  - `item_id`: MUST equal an existing `concept.id` from a Concept/Hypotheses artifact in context.\n" +
        "  - `hypothesis_ids`: array of hypothesis IDs from the same Concept/Hypotheses artifact (may be empty).\n\n" +
        "Referential integrity rules:\n" +
        "- All `item_id` values MUST be unique within `candidates`.\n" +
        "- If any ID is missing/unknown, DO NOT guess; return a Ranking artifact with `errors` populated and an empty `ranking.items` array.\n\n" +
        "Artifact requirements:\n" +
        '- `type` MUST be exactly \"ranking\".\n' +
        "- `id` MUST be globally unique and stable; if an existing Ranking artifact is provided in input/context, reuse its `id`.\n" +
        "- Required fields: `id`, `type`, `need_id`, `links`, `candidates`, `rubric_used`, `scored_items`, `ranking`, `errors`.\n" +
        "- `links` MUST be present (may be empty) and MUST include traceability links:\n" +
        "  - MUST include {rel:\"prior_artifact\", target:<concept_hypotheses_id>} to the Concept/Hypotheses artifact used for candidates.\n" +
        "  - SHOULD include {rel:\"prior_artifact\", target:<need_id>} to the Need Framing artifact id.\n" +
        "  - If a Research Plan artifact (type: research_plan) is provided in input/context, include {rel:\"prior_artifact\", target:<research_plan_id>}.\n" +
        "- Optional field: `decision_record` (include when you have enough info to populate it without guessing; otherwise omit).\n" +
        "- If present, `decision_record` MUST be machine-readable with keys: `decision_item_id`, `alternatives`, `rationale`, `evidence_ids`, `assumption_ids`, `test_ids`, `risks`, `recorded_at`, `recorded_by`.\n" +
        "  - `decision_item_id` MUST equal `ranking.recommendation.item_id`.\n" +
        "  - `alternatives` MUST contain only non-chosen alternatives (do not include `decision_item_id`).\n" +
        "  - `alternatives` MUST correspond to actual non-chosen candidates and any included `rank`/`total_score_0_5` MUST match `ranking.items`/`scored_items`.\n" +
        "- `rubric_used` MUST be explicit (scale, dimensions, aggregation) and `scored_items` MUST align to it.\n" +
        "- `scored_items[].total_score_0_5` is REQUIRED (number).\n" +
        "- `ranking.items[].total_score_0_5` is REQUIRED (number).\n" +
        "- `scored_items[].rationale` MUST be a typed object and SHOULD reference upstream IDs when available:\n" +
        "  - `key_assumptions`: array of `a_...` IDs (do not invent)\n" +
        "  - `key_evidence`: array of `e_...` IDs (do not invent)\n" +
        "  - `next_tests`: array of `t_...` IDs (do not invent)\n" +
        "- Deterministic ordering: sort by `total_score_0_5` desc; tie-break by `confidence` dimension desc; final tie-break lexicographic `item_id` asc.\n" +
        "- If `schema_version` is present it MUST be \"1.0\".\n",
      input,
    },
    ctx,
    [
      "Returns ONLY valid JSON",
      "Matches canonical Ranking shape (`type: ranking`)",
      "`need_id` references an existing Need Framing artifact from context",
      "Preserves referential integrity and threads upstream IDs",
      "Ranking ordering is deterministic per rubric and tie-breakers",
    ],
    opts
  );
};

// Verb-aligned exports (match `.a5c/functions/*.md`):
// - `research()` => canonical Need Framing (`type: need_framing`)
// - `research_plan()` => canonical Research Plan (`type: research_plan`)
// - `hypothesize()` => canonical Concept/Hypotheses (`type: concept_hypotheses`)
// - `rank()` => canonical Ranking (`type: ranking`)
export const research = (task, ctx = {}, opts = {}) => needFraming(task, ctx, opts);
export const research_plan = (task, ctx = {}, opts = {}) =>
  researchPlan(task, ctx, opts);
export const hypothesize = (task, ctx = {}, opts = {}) =>
  conceptHypotheses(task, ctx, opts);
export const rank = (task, ctx = {}, opts = {}) => ranking(task, ctx, opts);

export const productStrategyFlow = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title:
        "Product strategy flow (need_framing -> research_plan -> concept_hypotheses -> ranking)",
      prompt:
        "Return ONLY valid JSON for an object containing these canonical artifacts:\n" +
        "{\n" +
        "  \"need\": <Need Framing artifact (type: need_framing)>,\n" +
        "  \"research_plan\": <Research Plan artifact (type: research_plan)>,\n" +
        "  \"concept_hypotheses\": <Concept/Hypotheses artifact (type: concept_hypotheses)>,\n" +
        "  \"ranking\": <Ranking artifact (type: ranking)>\n" +
        "}\n\n" +
        "Flow rule (requirement changes):\n" +
        "- If prior artifacts are provided and the current task introduces new information or constraints, first update/reframe the Need Framing artifact (`need_statement`, `constraints`, `success_metrics`, `open_unknowns`) and then derive `research_plan` / `concept_hypotheses` / `ranking` from the updated Need (do not blindly reuse stale `open_unknowns`/research questions/hypotheses).\n\n" +
        "Alignment requirements:\n" +
        "- Preserve IDs across artifacts:\n" +
        "  - `research_plan.need_id` MUST equal `need.id`.\n" +
        "  - `concept_hypotheses.need_id` MUST equal `need.id`.\n" +
        "  - `ranking.need_id` MUST equal `need.id`.\n" +
        "- `research_plan.research_questions[*].source_unknown_id` MUST reference `need.open_unknowns[*].id` when `open_unknowns` is present.\n" +
        "- `ranking.candidates[].item_id` MUST reference `concept_hypotheses.concepts[].id`; `hypothesis_ids` MUST reference `concept_hypotheses.hypotheses[].id`.\n" +
        "- If prior artifacts are provided in input/context:\n" +
        "  - Reuse their artifact `id`s.\n" +
        "  - Reuse stable child item ids where the item is the same (Need: `success_metrics`/`constraints`/`open_unknowns`; Research Plan: `research_questions`; Concept/Hypotheses: `hypotheses`/`concepts`); only mint new ids for truly new items.\n" +
        "  - Ensure `links` include {rel:\"prior_artifact\", target:<upstream_artifact_id>} for each downstream artifact to preserve the chain Need -> Research Plan -> Concept/Hypotheses -> Ranking.\n" +
        "- All artifacts must satisfy their canonical required fields and types; `links` must be present (may be empty).\n",
      input,
    },
    ctx,
    [
      "Returns ONLY valid JSON",
      "Each nested artifact matches canonical schemas and types",
      "IDs are preserved and correctly referenced across artifacts",
    ],
    opts
  );
};
