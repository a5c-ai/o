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

export const runwayAndCashPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Runway and cash plan",
      prompt:
        "Create a runway and cash plan with scenarios. Output JSON: " +
        "{ \"as_of\": string, \"cash_on_hand\": string, \"current_burn\": {\"monthly_net\": string, \"notes\": string}, " +
        "\"runway_months\": number, " +
        "\"assumptions\": {\"revenue\": string[], \"cogs\": string[], \"opex\": string[], \"capex\": string[], \"collections\": string[]}, " +
        "\"scenarios\": [{\"name\": string, \"description\": string, \"changes\": string[], \"runway_months\": number}], " +
        "\"cash_forecast\": [{\"month\": string, \"begin_cash\": string, \"cash_in\": string, \"cash_out\": string, \"end_cash\": string, \"notes\": string}], " +
        "\"levers\": [{\"lever\": string, \"impact\": string, \"tradeoffs\": string[], \"time_to_effect\": string}], " +
        "\"risk_register\": [{\"risk\": string, \"likelihood\": \"low\"|\"medium\"|\"high\", \"impact\": string, \"mitigation\": string}], " +
        "\"next_actions\": [{\"action\": string, \"ownerRole\": string, \"due\": string}] }",
      input,
    },
    ctx,
    [
      "Forecast is internally consistent (begin/end cash reconcile with in/out flows)",
      "Assumptions are explicit and scenario differences are clearly stated",
      "Includes concrete levers, risks, and owned next actions to extend runway",
    ],
    opts
  );
};

export const budgetForecast = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Budget and forecast",
      prompt:
        "Build a budget + rolling forecast for the next 12 months. Output JSON: " +
        "{ \"period_start\": string, \"currency\": string, " +
        "\"assumptions\": {\"revenue\": string[], \"hiring\": string[], \"one_time\": string[], \"seasonality\": string[]}, " +
        "\"model\": { \"months\": string[], " +
        "\"revenue\": [{\"line\": string, \"monthly\": string[], \"notes\": string}], " +
        "\"cogs\": [{\"line\": string, \"monthly\": string[], \"notes\": string}], " +
        "\"opex\": [{\"line\": string, \"monthly\": string[], \"notes\": string}], " +
        "\"capex\": [{\"line\": string, \"monthly\": string[], \"notes\": string}], " +
        "\"headcount\": [{\"role\": string, \"count_by_month\": number[], \"fully_loaded_cost_monthly\": string, \"notes\": string}] }, " +
        "\"summary\": {\"monthly_totals\": [{\"month\": string, \"revenue\": string, \"gross_margin\": string, \"opex\": string, \"net_income\": string, \"ending_cash\": string}], " +
        "\"key_metrics\": [{\"name\": string, \"definition\": string, \"target\": string}]}, " +
        "\"variance_plan\": {\"tracking\": string, \"owners\": string[], \"actions_when_off_track\": string[]} }",
      input,
    },
    ctx,
    [
      "Budget includes explicit assumptions and ties headcount to cost lines",
      "Monthly totals are coherent (revenue, margin, opex, net, cash) and actionable",
      "Includes variance tracking with owners and clear actions when off track",
    ],
    opts
  );
};

export const unitEconomics = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Unit economics",
      prompt:
        "Analyze unit economics and produce a decision-ready summary. Output JSON: " +
        "{ \"unit\": string, \"as_of\": string, " +
        "\"assumptions\": {\"pricing\": string[], \"cogs\": string[], \"retention\": string[], \"sales_marketing\": string[]}, " +
        "\"inputs\": {\"arpa\": string, \"gross_margin_pct\": number, \"logo_retention_pct\": number, \"net_revenue_retention_pct\": number, \"cac\": string, \"sales_cycle\": string}, " +
        "\"calculations\": {\"ltv\": string, \"ltv_formula\": string, \"ltv_cac\": number, \"payback_months\": number, \"contribution_margin\": string}, " +
        "\"cohorts\": [{\"cohort\": string, \"users_or_accounts\": number, \"revenue\": string, \"gross_margin\": string, \"notes\": string}], " +
        "\"sensitivities\": [{\"variable\": string, \"range\": string, \"impact\": string}], " +
        "\"insights\": string[], \"recommendations\": [{\"recommendation\": string, \"why\": string, \"what_to_measure\": string[]}], " +
        "\"data_gaps\": string[] }",
      input,
    },
    ctx,
    [
      "Clearly defines the unit and provides transparent assumptions and formulas",
      "Calculations are interpretable and include sensitivities and data gaps",
      "Recommendations are measurable and tied to improving unit economics drivers",
    ],
    opts
  );
};

export const boardFinanceUpdate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Board finance update",
      prompt:
        "Prepare a board-ready finance update. Output JSON: " +
        "{ \"period\": string, \"headline\": string, " +
        "\"scorecard\": [{\"metric\": string, \"actual\": string, \"plan\": string, \"variance\": string, \"notes\": string}], " +
        "\"cash\": {\"cash_on_hand\": string, \"runway_months\": number, \"burn\": string, \"commentary\": string}, " +
        "\"forecast\": {\"next_quarter\": string, \"next_12_months\": string, \"assumptions\": string[]}, " +
        "\"risks\": [{\"risk\": string, \"impact\": string, \"mitigation\": string, \"ownerRole\": string}], " +
        "\"asks\": [{\"ask\": string, \"context\": string, \"decision_needed\": string}], " +
        "\"appendix\": {\"definitions\": string[], \"notes\": string[]} }",
      input,
    },
    ctx,
    [
      "Update is concise, decision-oriented, and explains variances and drivers",
      "Cash/runway and forecast assumptions are explicit and defensible",
      "Risks and asks include owners and clear decisions needed from the board",
    ],
    opts
  );
};

export const financialControlsChecklist = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Financial controls checklist",
      prompt:
        "Create a practical financial controls checklist for a small company. Output JSON: " +
        "{ \"principles\": string[], " +
        "\"controls\": [{\"area\": string, \"control\": string, \"purpose\": string, \"ownerRole\": string, \"frequency\": string, \"procedure\": string[], \"evidence\": string[], " +
        "\"tooling\": string[], \"status\": \"in_place\"|\"partial\"|\"missing\", \"gaps\": string[]}], " +
        "\"segregation_of_duties\": {\"who_can_pay\": string[], \"who_can_approve\": string[], \"notes\": string}, " +
        "\"access_reviews\": [{\"system\": string, \"cadence\": string, \"who\": string, \"what_checked\": string[]}], " +
        "\"audit_tax\": {\"bookkeeping\": string, \"sales_tax\": string, \"payroll_tax\": string, \"year_end\": string, \"open_items\": string[]}, " +
        "\"next_30_days\": [{\"action\": string, \"ownerRole\": string, \"due\": string}] }",
      input,
    },
    ctx,
    [
      "Controls are specific with owners, frequency, procedures, and evidence artifacts",
      "Addresses approvals, access, and segregation of duties appropriate to team size",
      "Includes a prioritized 30-day action plan to close the highest-risk gaps",
    ],
    opts
  );
};

export const monthlyCloseCalendar = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Monthly close calendar",
      prompt:
        "Create a monthly close calendar and task checklist. Output JSON: " +
        "{ \"close_goal\": string, \"target_days_to_close\": number, " +
        "\"calendar\": [{\"day\": string, \"task\": string, \"ownerRole\": string, \"dependencies\": string[], \"systems\": string[], \"deliverable\": string, \"quality_checks\": string[]}], " +
        "\"reconciliations\": [{\"account_or_area\": string, \"method\": string, \"ownerRole\": string, \"evidence\": string}], " +
        "\"journal_entries\": [{\"entry\": string, \"when\": string, \"ownerRole\": string, \"support\": string}], " +
        "\"review_and_approval\": [{\"review\": string, \"reviewerRole\": string, \"criteria\": string[]}], " +
        "\"close_packet\": {\"contents\": string[], \"distribution\": string, \"retention\": string}, " +
        "\"improvements\": [{\"issue\": string, \"fix\": string, \"ownerRole\": string, \"when\": string}] }",
      input,
    },
    ctx,
    [
      "Calendar is sequenced with dependencies, owners, deliverables, and quality checks",
      "Includes reconciliations and review/approval steps that prevent errors",
      "Defines a close packet and concrete improvements to reduce time-to-close",
    ],
    opts
  );
};

