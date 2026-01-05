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

export const headcountPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Headcount plan",
      prompt:
        "Create a headcount plan aligned to goals and budget. Output JSON: " +
        "{ \"time_horizon_months\": number, \"as_of\": string, \"goals\": string[], " +
        "\"current_org\": [{\"role\": string, \"team\": string, \"count\": number, \"location\": string, \"notes\": string}], " +
        "\"assumptions\": {\"growth\": string[], \"constraints\": string[], \"budget\": string[], \"product_milestones\": string[]}, " +
        "\"plan\": [{\"month\": string, \"hires\": [{\"role\": string, \"team\": string, \"level\": string, \"count\": number, \"start_date\": string, \"rationale\": string}], " +
        "\"exits_or_backfills\": [{\"role\": string, \"count\": number, \"notes\": string}], \"net_headcount\": number, \"notes\": string}], " +
        "\"critical_roles\": [{\"role\": string, \"why_critical\": string, \"success_definition\": string}], " +
        "\"cost_model\": {\"currency\": string, \"fully_loaded_by_role\": [{\"role\": string, \"level\": string, \"monthly_cost\": string, \"notes\": string}], " +
        "\"monthly_people_cost\": [{\"month\": string, \"cost\": string, \"notes\": string}]}, " +
        "\"risks\": [{\"risk\": string, \"impact\": string, \"mitigation\": string}], " +
        "\"next_actions\": [{\"action\": string, \"ownerRole\": string, \"due\": string}] }",
      input,
    },
    ctx,
    [
      "Plan ties hires to clear goals, constraints, and milestones",
      "Includes a credible cost model with explicit assumptions",
      "Risks and next actions are concrete with owners and due dates",
    ],
    opts
  );
};

export const orgDesignProposal = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Org design proposal",
      prompt:
        "Propose an org design that fits the stage and goals. Output JSON: " +
        "{ \"design_principles\": string[], \"time_horizon\": string, " +
        "\"org_chart\": {\"root\": string, \"nodes\": [{\"id\": string, \"title\": string, \"reports_to\": string|null, \"team\": string, \"scope\": string}]}, " +
        "\"teams\": [{\"name\": string, \"mission\": string, \"responsibilities\": string[], \"interfaces\": string[], \"kpis\": string[]}], " +
        "\"roles_needed\": [{\"title\": string, \"level\": string, \"team\": string, \"reports_to\": string, \"outcomes\": string[], \"start_when\": string}], " +
        "\"decision_rights\": [{\"area\": string, \"ownerRole\": string, \"consulted\": string[], \"informed\": string[]}], " +
        "\"operating_rhythm\": {\"cadences\": [{\"name\": string, \"frequency\": string, \"participants\": string[], \"agenda\": string[]}], \"artifacts\": string[]}, " +
        "\"phase_plan\": [{\"phase\": string, \"trigger\": string, \"changes\": string[], \"risks\": string[]}], " +
        "\"open_questions\": string[] }",
      input,
    },
    ctx,
    [
      "Org chart, teams, and roles have clear scopes and minimal overlap",
      "Interfaces, decision rights, and cadence make execution predictable",
      "Includes a staged plan with triggers, risks, and open questions",
    ],
    opts
  );
};

export const compensationBands = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Compensation bands",
      prompt:
        "Define compensation bands with leveling guidance. Output JSON: " +
        "{ \"currency\": string, \"geo_strategy\": string, \"components\": string[], " +
        "\"levels\": [{\"level\": string, \"definition\": string, \"scope\": string, \"typical_titles\": string[], " +
        "\"cash_range\": {\"min\": string, \"mid\": string, \"max\": string}, " +
        "\"equity_range\": {\"min\": string, \"mid\": string, \"max\": string, \"vehicle\": string}, " +
        "\"bonus_target\": string, \"notes\": string}], " +
        "\"job_families\": [{\"family\": string, \"levels\": string[], \"notes\": string}], " +
        "\"offers\": {\"offer_principles\": string[], \"approval_workflow\": string[], \"exceptions_policy\": string}, " +
        "\"adjustments\": {\"location\": [{\"location\": string, \"multiplier\": number, \"notes\": string}], " +
        "\"experience\": string[], \"internal_equity\": string[]}, " +
        "\"promotion_criteria\": [{\"from_level\": string, \"to_level\": string, \"signals\": string[], \"examples\": string[]}], " +
        "\"review_cadence\": string }",
      input,
    },
    ctx,
    [
      "Bands are internally consistent across levels and explain scope differences",
      "Defines a practical offer workflow and exception policy to maintain equity",
      "Includes clear promotion signals and adjustment rules (geo/location)",
    ],
    opts
  );
};

export const performanceReviewCycle = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Performance review cycle",
      prompt:
        "Design a performance review cycle that is fair and lightweight. Output JSON: " +
        "{ \"cadence\": string, \"principles\": string[], " +
        "\"cycle\": {\"phases\": [{\"name\": string, \"when\": string, \"owner\": string, \"inputs\": string[], \"outputs\": string[]}], " +
        "\"timeline_days\": number, \"tooling\": string[]}, " +
        "\"goal_setting\": {\"framework\": string, \"examples\": string[], \"checkins\": string}, " +
        "\"feedback\": {\"sources\": string[], \"questions\": string[], \"guidelines\": string[]}, " +
        "\"calibration\": {\"who\": string[], \"process\": string[], \"bias_mitigations\": string[]}, " +
        "\"ratings\": {\"used\": boolean, \"scale\": string|null, \"definitions\": string[]}, " +
        "\"manager_responsibilities\": string[], \"employee_responsibilities\": string[], " +
        "\"outputs\": {\"growth_plans\": string, \"comp_link\": string, \"documentation\": string}, " +
        "\"risks\": [{\"risk\": string, \"mitigation\": string}] }",
      input,
    },
    ctx,
    [
      "Cycle is implementable with clear phases, owners, and artifacts",
      "Calibration and feedback reduce bias and improve consistency",
      "Outputs connect to growth, expectations, and (if applicable) compensation",
    ],
    opts
  );
};

export const hiringScorecards = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Hiring scorecards",
      prompt:
        "Create hiring scorecards for the specified roles. Output JSON: " +
        "{ \"roles\": [{\"role\": string, \"level\": string, \"team\": string, " +
        "\"must_haves\": string[], \"nice_to_haves\": string[], " +
        "\"competencies\": [{\"name\": string, \"weight\": number, \"signals\": string[], \"red_flags\": string[]}], " +
        "\"interview_plan\": [{\"stage\": string, \"interviewer_role\": string, \"focus\": string, \"questions\": string[], \"evaluation_rubric\": string[]}], " +
        "\"work_sample\": {\"prompt\": string, \"timebox\": string, \"evaluation\": string[]}, " +
        "\"decision_rule\": string, \"debrief_questions\": string[]}], " +
        "\"consistency_rules\": string[] }",
      input,
    },
    ctx,
    [
      "Competencies are weighted and map to observable signals and red flags",
      "Interview plan and rubrics are consistent across interviewers",
      "Includes a work sample and a clear decision rule for debrief",
    ],
    opts
  );
};

export const recruitingPipelinePlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Recruiting pipeline plan",
      prompt:
        "Design a recruiting pipeline plan that is operational end-to-end. Output JSON: " +
        "{ \"roles_in_scope\": [{\"role\": string, \"level\": string, \"priority\": \"P0\"|\"P1\"|\"P2\"}], " +
        "\"pipeline\": {\"stages\": [{\"name\": string, \"exit_criteria\": string[], \"sla_days\": number, \"ownerRole\": string}], " +
        "\"funnel_metrics\": [{\"metric\": string, \"definition\": string, \"target\": string, \"cadence\": string}]}, " +
        "\"sourcing\": {\"channels\": [{\"channel\": string, \"why\": string, \"weekly_actions\": string[], \"expected_yield\": string}], " +
        "\"outreach\": {\"templates\": string[], \"followups\": string[], \"personalization_rules\": string[]}}, " +
        "\"process\": {\"intake\": string[], \"ats_fields\": string[], \"candidate_experience\": string[], \"closing\": string[]}, " +
        "\"interviewers\": {\"panel\": [{\"role\": string, \"responsibilities\": string[]}], \"training\": string[], \"bar_raising\": string[]}, " +
        "\"diversity_and_fairness\": {\"practices\": string[], \"anti_bias_checks\": string[]}, " +
        "\"risks\": [{\"risk\": string, \"impact\": string, \"mitigation\": string}], " +
        "\"next_actions\": [{\"action\": string, \"ownerRole\": string, \"due\": string}] }",
      input,
    },
    ctx,
    [
      "Stages have explicit exit criteria, SLAs, and owners",
      "Includes sourcing tactics, outreach, and candidate experience improvements",
      "Defines metrics, risks, and next actions to make the pipeline measurable",
    ],
    opts
  );
};

export const handbookOutline = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Employee handbook outline",
      prompt:
        "Draft an employee handbook outline tailored to the company context. Output JSON: " +
        "{ \"audience\": string, \"jurisdiction_notes\": string[], " +
        "\"sections\": [{\"title\": string, \"purpose\": string, \"topics\": string[], \"policies\": string[], \"ownerRole\": string}], " +
        "\"required_policies\": [{\"policy\": string, \"why\": string, \"source\": string}], " +
        "\"onboarding\": {\"first_week\": string[], \"first_30_days\": string[], \"checklists\": string[]}, " +
        "\"culture\": {\"values\": string[], \"behaviors\": string[], \"examples\": string[]}, " +
        "\"security_and_compliance\": {\"access\": string[], \"data_handling\": string[], \"reporting\": string[]}, " +
        "\"change_log\": {\"version\": string, \"last_updated\": string, \"review_cadence\": string}, " +
        "\"open_items\": string[] }",
      input,
    },
    ctx,
    [
      "Outline is complete, structured, and assigns ownership per section",
      "Calls out jurisdiction/legal caveats and required policy areas",
      "Includes onboarding, culture, and security/compliance essentials",
    ],
    opts
  );
};

