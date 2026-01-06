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

export const costAllocationAndTaggingPolicy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Cost allocation and tagging policy",
      prompt:
        "Define a tagging/labeling standard and allocation policy to support showback/chargeback. Focus on operational rollout: coverage targets, enforcement, audit checks, and governance. Output JSON only. Output JSON: " +
        '{ "scope": {"clouds": string[], "accounts_or_subscriptions": string[], "resource_types": string[], "environments": string[]}, ' +
        '"objectives": string[], "principles": string[], ' +
        '"tag_schema": {"required": [{"key": string, "description": string, "allowed_values": string[]|null, "examples": string[]}], "optional": [{"key": string, "description": string, "allowed_values": string[]|null, "examples": string[]}], ' +
        '"normalization": {"case": "lower"|"upper"|"preserve", "whitespace": "trim"|"preserve", "delimiters": string[], "notes": string}}, ' +
        '"allocation_model": {"unallocated_bucket_name": string, "allocation_methods": [{"name": "direct"|"shared"|"proportional"|"fixed"|"metered", "when_used": string, "inputs_required": string[]}], ' +
        '"rules": [{"rule_id": string, "description": string, "match": string, "allocation": {"method": "direct"|"shared"|"proportional"|"fixed"|"metered", "to": string, "basis": string, "notes": string}, "precedence": number}]}, ' +
        '"coverage_targets": {"required_tag_coverage_pct_target": number, "allocated_spend_pct_target": number, "time_to_reach_target": string, "exclusions": string[]}, ' +
        '"enforcement": {"preventive_controls": [{"control": string, "where": string, "how": string, "exceptions_process": string}], ' +
        '"detective_controls": [{"control": string, "where": string, "how": string, "severity": "low"|"medium"|"high"}], ' +
        '"exceptions": {"allowed_reasons": string[], "approval_roles": string[], "expiry_default": string, "tracking_system": string}}, ' +
        '"audit_checks": [{"check": string, "cadence": string, "ownerRole": string, "query_or_rule": string, "threshold": string, "alerting": string, "remediation_play": string[]}], ' +
        '"governance": {"owners": [{"area": string, "ownerRole": string}], "review_cadence": string, "change_process": string[], "training": {"audiences": string[], "materials": string[], "cadence": string}}, ' +
        '"rollout_plan": {"phases": [{"phase": string, "when": string, "milestones": string[], "risks": string[], "mitigations": string[]}], "communications": [{"audience": string, "message": string, "channel": string, "when": string}]}, ' +
        '"metrics": [{"name": string, "definition": string, "formula": string, "cadence": string, "ownerRole": string, "target": string}], ' +
        '"open_questions": string[], "next_actions": [{"action": string, "ownerRole": string, "due": string}] }',
      input,
    },
    ctx,
    [
      "Tag schema is specific (required keys, allowed values, normalization rules) and supports real showback/chargeback use",
      "Allocation model includes clear precedence rules, an explicit unallocated bucket, and measurable coverage targets",
      "Enforcement and audit checks are actionable: owners, cadences, thresholds, alerting, and remediation steps are defined",
    ],
    opts
  );
};

export const cloudCostOptimizationBacklog = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Cloud cost optimization backlog",
      prompt:
        "Generate a prioritized cloud cost optimization backlog that an engineering/FinOps team can execute. Include quick wins and structural fixes with estimated savings, effort, owners, and verification. Output JSON only. Output JSON: " +
        '{ "as_of": string, "currency": string, "assumptions": string[], ' +
        '"summary": {"total_estimated_monthly_savings": string, "total_estimated_one_time_savings": string, "notes": string}, ' +
        '"backlog": [{"id": string, "title": string, "category": "rightsizing"|"idle_cleanup"|"storage"|"network"|"data_transfer"|"licensing"|"scheduling"|"architecture"|"observability"|"commitments", ' +
        '"scope": {"cloud": string, "account_or_subscription": string, "service": string, "region": string|null, "environment": string|null}, ' +
        '"problem": string, "hypothesis": string, "estimated_savings": {"monthly": string, "one_time": string, "confidence": "low"|"medium"|"high", "method": string}, ' +
        '"effort": {"size": "S"|"M"|"L", "engineering_days": number|null, "dependencies": string[]}, ' +
        '"risk": {"customer_impact": "low"|"medium"|"high", "reliability_risk": "low"|"medium"|"high", "security_risk": "low"|"medium"|"high", "notes": string}, ' +
        '"ownerRole": string, "stakeholders": string[], "status": "new"|"planned"|"in_progress"|"blocked"|"done", "due": string|null, ' +
        '"execution_plan": string[], "verification_plan": {"how_to_measure": string, "baseline_window": string, "success_criteria": string, "rollback_plan": string}, ' +
        '"instrumentation_needed": string[], "links": string[]}], ' +
        '"prioritization": {"scoring_model": [{"factor": string, "weight": number, "how_scored": string}], "top_items": string[]}, ' +
        '"cadence": {"review_cadence": string, "intake_process": string[], "definition_of_done": string[], "reporting": [{"audience": string, "cadence": string, "artifact": string}] } }',
      input,
    },
    ctx,
    [
      "Backlog includes quantified savings estimates with confidence and a stated estimation method",
      "Every item has an owner, executable steps, and a verification/rollback plan to prevent regressions",
      "Prioritization is transparent and results in a realistic, time-bound top list",
    ],
    opts
  );
};

export const commitmentStrategy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Commitment strategy (RIs/Savings Plans)",
      prompt:
        "Recommend a commitment strategy (RIs/Savings Plans/commitments) with assumptions, coverage targets, risk controls, and governance. Output JSON only. Output JSON: " +
        '{ "as_of": string, "cloud_provider": string, "currency": string, ' +
        '"objectives": string[], "constraints": string[], "assumptions": {"workload_stability": string, "growth": string, "seasonality": string, "architecture_changes_planned": string[], "data_sources": string[]}, ' +
        '"spend_profile": {"eligible_services": [{"service": string, "avg_monthly_spend": string, "variability": "low"|"medium"|"high", "notes": string}], "ineligible_notes": string}, ' +
        '"current_commitments": [{"type": string, "term": string, "coverage_pct": number, "utilization_pct": number, "notes": string}], ' +
        '"recommended_strategy": {"target_coverage_pct": number, "coverage_scope": string, "term": "1y"|"3y"|"other", "payment_option": "no_upfront"|"partial_upfront"|"all_upfront"|"other", ' +
        '"instruments": [{"instrument": string, "when_to_use": string, "tradeoffs": string[]}]}, ' +
        '"purchase_plan": {"tranches": [{"when": string, "amount": string, "coverage_pct_after": number, "rationale": string}], "review_triggers": string[]}, ' +
        '"risk_controls": {"guardrails": string[], "break_glass_process": string[], "utilization_monitoring": {"metrics": string[], "cadence": string, "ownerRole": string, "thresholds": string[]}, ' +
        '"change_management": {"who_approves": string[], "required_analysis": string[], "documentation_location": string}}, ' +
        '"governance": {"decision_makers": string[], "cadence": string, "reporting": [{"audience": string, "artifact": string, "cadence": string}], "roles_and_responsibilities": [{"role": string, "responsibilities": string[]}]}, ' +
        '"scenarios": [{"name": string, "assumptions": string[], "target_coverage_pct": number, "expected_savings_range": string, "key_risks": string[]}], ' +
        '"open_questions": string[], "next_actions": [{"action": string, "ownerRole": string, "due": string}] }',
      input,
    },
    ctx,
    [
      "Strategy states explicit assumptions and a spend eligibility profile that supports defensible coverage targets",
      "Includes governance and risk controls (guardrails, utilization monitoring, approval workflow) appropriate to commitment risk",
      "Purchase plan is staged with clear triggers and measurable outcomes for utilization and savings",
    ],
    opts
  );
};

export const finopsKpiDashboardSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "FinOps KPI dashboard spec",
      prompt:
        "Specify FinOps KPIs and dashboards, including definitions, formulas, dimensions, data sources, refresh cadences, and ownership. Output JSON only. Output JSON: " +
        '{ "as_of": string, "audiences": string[], "principles": string[], ' +
        '"kpis": [{"name": string, "type": "leading"|"lagging", "definition": string, "formula": string, "unit": string, ' +
        '"dimensions": string[], "granularity": string, "data_sources": [{"system": string, "tables_or_apis": string[], "source_of_truth": boolean}], ' +
        '"refresh_cadence": string, "ownerRole": string, "targets": {"target": string, "thresholds": {"green": string, "yellow": string, "red": string}}, "notes": string}], ' +
        '"dashboards": [{"name": string, "audience": string, "purpose": string, "filters": string[], ' +
        '"tiles": [{"title": string, "kpi": string, "visualization": string, "time_window": string, "breakdowns": string[], "annotations": string[], "drilldowns": string[], "alerts": string[]}]}], ' +
        '"data_model": {"entities": [{"name": string, "primary_keys": string[], "important_fields": string[]}], "joins": [{"left": string, "right": string, "on": string, "notes": string}], "retention": string}, ' +
        '"data_quality_checks": [{"check": string, "cadence": string, "ownerRole": string, "how_tested": string, "failure_action": string}], ' +
        '"alerting": {"channels": string[], "alert_rules": [{"name": string, "kpi": string, "condition": string, "severity": "low"|"medium"|"high", "ownerRole": string, "runbook_link": string}]}, ' +
        '"access_and_sharing": {"who_can_view": string[], "who_can_edit": string[], "distribution": string, "notes": string}, ' +
        '"glossary": [{"term": string, "definition": string}], ' +
        '"rollout_plan": {"milestones": [{"milestone": string, "when": string, "ownerRole": string, "dependencies": string[]}], "open_questions": string[]} }',
      input,
    },
    ctx,
    [
      "KPI definitions include precise formulas, units, dimensions, sources of truth, refresh cadence, and owners",
      "Dashboards answer concrete stakeholder questions and include filtering/drilldowns needed for action",
      "Includes data quality checks and alert rules so the dashboards are reliable for ongoing operations",
    ],
    opts
  );
};

export const costAnomalyDetectionRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Cost anomaly detection runbook",
      prompt:
        "Create an anomaly detection and response runbook for cloud costs: alert definitions, triage steps, owners, comms, and postmortem fields. Output JSON only. Output JSON: " +
        '{ "scope": {"clouds": string[], "accounts_or_subscriptions": string[], "environments": string[]}, "objectives": string[], ' +
        '"detection": {"signals": [{"name": string, "metric": string, "dimensions": string[], "baseline_method": string, "condition": string, "severity": "low"|"medium"|"high", "false_positive_notes": string}], ' +
        '"alert_delivery": {"channels": string[], "dedupe_window": string, "on_call_rotation": string, "ticketing": {"system": string, "required_fields": string[]}}}, ' +
        '"triage": {"first_response_sla": string, "steps": [{"step": string, "who": string, "tools": string[], "queries_or_views": string[], "decision": string, "next": string}]}, ' +
        '"common_causes": [{"cause": string, "signals": string[], "how_to_confirm": string[], "fix": string[], "rollback": string[], "prevention": string[]}], ' +
        '"escalation": {"when_to_escalate": string[], "paths": [{"severity": "low"|"medium"|"high", "notify": string[], "time_to_escalate": string, "notes": string}]}, ' +
        '"communications": {"internal_updates": [{"audience": string, "cadence": string, "template": string}], "customer_facing": {"when_needed": string, "template": string, "approvers": string[]}}, ' +
        '"containment_actions": [{"action": string, "risk": string, "approval_required_by": string[], "how_to_execute": string[]}], ' +
        '"postmortem": {"required_fields": [{"field": string, "why": string}], "template": {"summary": string, "timeline": string, "root_cause": string, "cost_impact": string, "what_changed": string, "what_worked": string, "what_didnt": string, "action_items": [{"action": string, "ownerRole": string, "due": string, "success_criteria": string}]}}, ' +
        '"tuning_and_review": {"weekly_review": {"ownerRole": string, "agenda": string[]}, "metrics": [{"name": string, "definition": string, "target": string}], "runbook_maintenance": {"cadence": string, "ownerRole": string}} }',
      input,
    },
    ctx,
    [
      "Runbook defines actionable detection signals and clear SLAs, owners, and escalation paths",
      "Triage steps include concrete queries/views/tools and decision points that lead to containment or resolution",
      "Postmortem fields capture cost impact, root cause, and preventative actions with owners and due dates",
    ],
    opts
  );
};

export const monthlyCloudCostCloseChecklist = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Monthly cloud cost close checklist",
      prompt:
        "Define a monthly cloud cost close checklist that a FinOps team can run end-to-end. Include invoice/usage ingestion, allocation, accruals, anomaly triage, reporting, and sign-off. " +
        "Make it operational (owners, systems of record, due rules, QA checks, and exception handling). Output JSON only. Output JSON: " +
        '{ "asOf": string, "scope": {"clouds": string[], "accountsOrSubscriptions": string[], "timeZone": string}, "closeWindow": {"period": string, "open": string, "close": string, "signoffBy": string}, "systems": {"billing": string[], "costPlatform": string|null, "dataWarehouse": string|null, "accounting": string|null, "ticketing": string|null}, "checklist": [{"step": string, "ownerRole": string, "dueRule": string, "inputs": string[], "outputs": string[], "systemOfRecord": string, "qaChecks": string[], "exceptions": {"when": string[], "howTracked": string, "escalation": {"toRoles": string[], "within": string, "messageTemplate": string}}}], "allocation": {"coverageTargetPct": number, "unallocatedPolicy": string, "exceptionTypes": string[], "howMeasured": string}, "accruals": {"required": boolean, "policySummary": string, "howCalculated": string, "ownerRole": string, "journalEntryHandling": string}, "anomalies": {"triageSla": string, "severityModel": [{"severity": "low"|"medium"|"high", "definition": string, "defaultActions": string[]}], "escalationPath": [{"trigger": string, "notifyRoles": string[], "within": string, "action": string}]}, "reporting": {"audiences": [{"audience": string, "needs": string[]}], "dashboards": [{"name": string, "system": string, "tiles": string[]}], "execSummaryTemplate": {"headline": string, "wins": string[], "risks": string[], "asks": string[]}, "cadence": string}, "signoff": {"requiredApprovers": string[], "signoffArtifact": string, "definitionOfDone": string[]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Checklist covers the full close lifecycle with owners, due rules, systems of record, and QA checks",
      "Allocation and accruals include explicit policies, coverage targets, and how measurement/sign-off works",
      "Anomaly triage includes SLAs, severity model, and escalation paths suitable for repeatable monthly operations",
    ],
    opts
  );
};

export const unitCostModelSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Unit cost model spec",
      prompt:
        "Create a unit cost model spec (unit economics for cloud/infra and product delivery). Define units, formulas, inputs, owners, refresh cadence, validations, and how the model is used in decisions. " +
        "Stay operational: specify data sources, required dimensions, and QA checks; do not write a full BI implementation. Output JSON only. Output JSON: " +
        '{ "asOf": string, "context": {"businessModel": "b2b"|"b2c"|"b2b2c"|"marketplace"|"other", "currency": string, "timeZone": string}, "units": [{"unit": string, "definition": string, "numeratorCosts": [{"cost": string, "sourceSystem": string, "allocationRule": string, "notes": string}], "denominatorMetric": {"metric": string, "sourceSystem": string, "definition": string, "grain": string, "notes": string}, "formula": string, "dimensions": string[], "segmentCuts": string[], "dataQualityAssumptions": string[], "ownerRole": string, "refreshCadence": "daily"|"weekly"|"monthly"|"quarterly", "uses": [{"decision": string, "whoUses": string[], "howOften": string, "whatThresholdMatters": string}]}], "validation": [{"check": string, "how": string, "cadence": string, "ownerRole": string, "failureAction": string}], "governance": {"systemOfRecord": string, "changeControl": {"howRequested": string, "approvers": string[], "versioning": string}, "reviewCadence": string}, "knownLimitations": string[], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Each unit has a clear definition, formula, inputs/sources, dimensions, and an owner with a refresh cadence",
      "Validation checks are explicit and operational (how to run, cadence, owner, and what to do on failure)",
      "Spec connects the model to real decisions (who uses it, thresholds, and governance/change control)",
    ],
    opts
  );
};

export const taggingCoverageEnforcementRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Tagging coverage enforcement runbook",
      prompt:
        "Create a tagging coverage enforcement runbook: required tag policy, detection, remediation, exceptions, rollout stages, and ongoing monitoring. " +
        "Make it implementable (queries/rules, alert routing, playbooks, and systems of record). Output JSON only. Output JSON: " +
        '{ "asOf": string, "policy": {"requiredTags": [{"key": string, "description": string, "allowedValues": string[]|null, "examples": string[]}], "coverageTargetPct": number, "scope": {"clouds": string[], "accountsOrSubscriptions": string[], "resourceTypes": string[]}, "enforcementStages": [{"stage": "observe"|"warn"|"block"|"auto_remediate", "when": string, "appliesTo": string[], "notes": string}]}, "detection": {"queriesOrRules": [{"name": string, "where": string, "rule": string, "dimensions": string[], "threshold": string, "severity": "low"|"medium"|"high"}], "dashboards": [{"name": string, "system": string, "tiles": string[]}], "alerts": [{"trigger": string, "severity": "low"|"medium"|"high", "routeToRole": string, "responseSla": string, "ticketTemplate": string}]}, "remediation": {"playbooks": [{"scenario": string, "howToIdentifyOwner": string, "steps": [{"step": string, "ownerRole": string, "system": string, "notes": string}], "automationOpportunities": string[], "verification": string}], "autoRemediationGuardrails": {"allowed": boolean, "requiresApprovalWhen": string[], "rollbackPlan": string}}, "exceptions": {"allowedReasons": string[], "approvalRoles": string[], "defaultExpiry": string, "trackingSystem": string, "requiredFields": string[], "renewalRules": string[]}, "governance": {"owners": [{"area": "policy"|"detection"|"remediation"|"exceptions"|"other", "ownerRole": string}], "reviewCadence": string, "changeControl": {"howRequested": string, "approvers": string[], "effectiveDateRule": string}}, "metrics": [{"metric": string, "definition": string, "target": string, "cadence": string, "ownerRole": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Policy includes required tags, a measurable coverage target, and staged enforcement so rollout is safe and controllable",
      "Detection defines concrete rules/queries, dashboards, and alert routing with response SLAs and ticket templates",
      "Remediation and exceptions are operational (steps, owners, verification, guardrails, expiry/renewal, and governance)",
    ],
    opts
  );
};
