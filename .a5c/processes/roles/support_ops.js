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

export const supportKpiDashboardSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Support KPI dashboard spec",
      prompt:
        "Specify support operations KPIs and dashboards (FRT, TTR, backlog aging, deflection, CSAT, QA, escalations). " +
        "Focus on operational definitions, formulas, dimensions, targets/thresholds, owners, cadences, and data sources/systems of record. " +
        "Do not draft frontline ticket responses or incident comms. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "context": {"company": string, "supportModel": "b2b"|"b2c"|"mixed"|"other", "channels": string[], "regionsAndTimeZones": string[], "supportTiers": string[], "productsOrModules": string[], "assumptions": string[]}, "definitions": {"businessHours": string, "ticketStates": [{"state": string, "definition": string}], "contactReasonsTaxonomy": [{"category": string, "subcategories": string[], "definition": string}]}, "kpis": [{"kpi": string, "category": "speed"|"quality"|"experience"|"efficiency"|"health"|"escalations"|"knowledge"|"other", "definition": string, "formula": string, "unit": string, "numerator": string, "denominator": string|null, "includes": string[], "excludes": string[], "timeWindow": string, "dimensions": string[], "segmentCuts": string[], "target": {"type": "threshold"|"range"|"trend", "value": string, "notes": string}, "alertThresholds": [{"when": string, "severity": "info"|"warn"|"crit", "routeToRole": string, "responseWithinHours": number}], "ownerRole": string, "sourceSystems": [{"system": string, "tablesOrObjects": string[], "fieldsNeeded": string[], "systemOfRecordFor": string[]}], "dataQualityChecks": string[], "refreshCadence": "real_time"|"hourly"|"daily"|"weekly", "notes": string}], "dashboards": [{"name": string, "audience": string[], "cadence": "daily"|"weekly"|"monthly", "tiles": [{"title": string, "kpis": string[], "visual": "line"|"bar"|"table"|"heatmap"|"funnel"|"scorecard"|"other", "breakdowns": string[], "filters": string[], "goodLooksLike": string, "actionsWhenBad": string[]}], "filters": string[], "drilldowns": [{"fromTile": string, "toView": string, "purpose": string}], "access": {"whoCanView": string[], "whoCanEdit": string[]}}], "operatingCadence": {"rituals": [{"cadence": "daily"|"weekly"|"monthly", "meetingOrAsync": string, "attendees": string[], "inputs": string[], "agenda": string[], "decisions": string[], "outputs": string[]}], "ownerRole": string, "systemOfRecord": string, "changeControl": {"howChangesAreRequested": string, "approvers": string[], "testingOrQa": string[], "rollout": string}}, "reporting": {"execSummaryTemplate": {"headlineMetrics": string[], "risks": string[], "wins": string[], "asks": string[]}, "standardSegments": string[], "notes": string}, "implementationPlan": {"phases": [{"phase": string, "scope": string, "ownerRole": string, "deliverables": string[], "dueDate": string}], "dependencies": string[], "risks": [{"risk": string, "mitigation": string}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "KPIs have unambiguous operational definitions and explicit formulas/units so measurement is consistent",
      "Dashboards map to audiences and cadences with clear actions and drilldowns when metrics are off-target",
      "Specs include targets/thresholds, alert routing, owners, and systems of record with data quality checks",
    ],
    opts
  );
};

export const supportCapacityAndStaffingModel = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Support capacity and staffing model",
      prompt:
        "Build a support capacity and staffing model: ticket volume drivers, service levels, staffing plan, schedules, coverage, seasonality, and hiring triggers. " +
        "Include explicit assumptions, shrinkage/occupancy, handle times, backlog dynamics, and how to forecast + adjust weekly. " +
        "Do not draft individual support replies or triage specific tickets. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "context": {"company": string, "supportTiers": string[], "channels": string[], "regionsAndTimeZones": string[], "businessHours": string, "tools": {"ticketing": string, "wfmOrScheduling": string|null, "bi": string|null}}, "workTypes": [{"workType": "tickets"|"chats"|"calls"|"emails"|"community"|"escalations"|"bugs"|"proactive_outreach"|"knowledge_base"|"other", "definition": string, "routingRules": string}], "demandModel": {"timeGranularity": "hour"|"day"|"week", "volumeDrivers": [{"driver": string, "howMeasured": string, "expectedChange": string, "notes": string}], "forecast": [{"periodStart": string, "periodEnd": string, "byChannel": [{"channel": string, "volume": number, "unit": "tickets"|"contacts"}], "byTier": [{"tier": string, "volume": number, "unit": "tickets"|"contacts"}], "seasonalityNotes": string, "confidence": "low"|"medium"|"high"}], "arrivalPatterns": [{"channel": string, "pattern": "even"|"peaky"|"business_hours"|"after_hours"|"unknown", "notes": string}], "backlogStartingPoint": {"openTickets": number|null, "oldestAgeDays": number|null, "notes": string}}, "serviceLevelTargets": {"bySeverityOrPriority": [{"priority": string, "definition": string, "responseSla": {"within": string, "businessHoursOnly": boolean}, "resolveSla": {"within": string, "businessHoursOnly": boolean}, "notes": string}], "byChannel": [{"channel": string, "targetFRT": string, "targetTTR": string, "notes": string}]}, "productivityAssumptions": {"ahtMinutes": [{"channel": string, "tier": string|null, "minutes": number, "notes": string}], "touchesPerTicket": [{"category": string, "averageTouches": number, "notes": string}], "reopenRate": {"rate": number, "definition": string, "notes": string}, "escalationRate": {"rate": number, "definition": string, "notes": string}}, "capacityAssumptions": {"paidHoursPerWeek": number, "shrinkageRate": number, "occupancyTarget": number, "utilizationTargets": [{"workType": string, "targetPercent": number, "notes": string}], "nonTicketTime": [{"activity": string, "percent": number, "notes": string}]}, "model": {"calculationSteps": string[], "requiredFte": [{"periodStart": string, "periodEnd": string, "byTier": [{"tier": string, "fte": number}], "byChannel": [{"channel": string, "fte": number}], "totalFte": number, "notes": string}], "schedule": {"coverageBlocks": [{"timeZone": string, "start": string, "end": string, "requiredConcurrentAgents": number, "channelMix": string[], "notes": string}], "onCallOrAfterHours": {"needed": boolean, "routing": string, "handoffRules": string, "notes": string}}, "sensitivityAnalysis": [{"scenario": string, "changes": [{"assumption": string, "from": string, "to": string}], "impactSummary": string, "fteDelta": number, "risk": string}]}, "hiringAndStaffingPlan": {"currentTeam": {"fteByRole": [{"role": string, "fte": number}], "skillsMatrix": [{"skill": string, "coverage": "low"|"medium"|"high", "notes": string}]}, "plan": [{"when": string, "action": "hire"|"reassign"|"contractor"|"schedule_change"|"training"|"automation", "details": string, "ownerRole": string}], "triggers": [{"trigger": string, "threshold": string, "observeFor": string, "action": string, "ownerRole": string}]}, "operatingCadence": {"weeklyWfmRitual": {"inputs": string[], "checks": string[], "decisions": string[], "outputs": string[]}, "systemOfRecord": string, "dashboards": string[], "runbooks": [{"name": string, "whenToUse": string, "steps": string[]}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Model includes explicit assumptions (AHT, shrinkage, occupancy, arrival patterns) and shows how required FTE is computed",
      "Staffing plan includes coverage blocks, hiring triggers, and weekly operating cadence to forecast and adjust continuously",
      "Outputs include sensitivity scenarios and actionable runbooks/decisions tied to measurable thresholds",
    ],
    opts
  );
};

export const supportQaRubricAndCalibration = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Support QA rubric and calibration",
      prompt:
        "Create a support QA rubric and calibration process: score dimensions, sampling, calibration, coaching loops, and reporting. " +
        "Keep it operational and measurable (systems, cadences, owners, and audit trail). " +
        "Do not draft sample ticket responses; focus on evaluation criteria and the operating process. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "context": {"company": string, "channels": string[], "supportTiers": string[], "languages": string[], "assumptions": string[]}, "rubric": {"scale": {"type": "0_1_2"|"1_2_3_4_5"|"pass_fail"|"custom", "labels": [{"score": number|string, "meaning": string}]}, "dimensions": [{"dimension": string, "definition": string, "weight": number, "howToEvaluate": string[], "whatGoodLooksLike": string[], "commonFailureModes": string[], "examples": [{"example": string, "wouldScore": number|string, "why": string}] }], "autoFailRules": [{"when": string, "reason": string}], "requiredArtifacts": [{"artifact": string, "howCaptured": string, "whereStored": string}]}, "samplingPlan": {"populationDefinition": string, "samplingUnit": "ticket"|"conversation"|"interaction", "sampleSizePerPeriod": number, "period": "week"|"month", "stratification": [{"by": string, "levels": string[], "allocationRule": string}], "exclusions": string[], "randomizationMethod": string, "oversamplingRules": [{"when": string, "multiplier": number, "reason": string}], "coverageTargets": [{"segment": string, "targetPercent": number}]}, "qaProcess": {"roles": {"qaOwnerRole": string, "qaReviewers": string[], "teamLeads": string[], "agents": string[]}, "workflow": [{"step": string, "ownerRole": string, "system": string, "slaDays": number, "inputs": string[], "outputs": string[], "definitionOfDone": string[]}], "calibration": {"cadence": "weekly"|"biweekly"|"monthly", "participants": string[], "materials": string[], "method": "live_review"|"blind_scoring_then_discuss"|"hybrid", "agreementMetrics": [{"metric": "kappa"|"percent_agreement"|"other", "target": string, "howComputed": string}], "driftDetection": {"signals": string[], "thresholds": string[], "actions": string[]}}, "appealsAndDisputes": {"allowed": boolean, "howToSubmit": string, "slaDays": number, "reviewers": string[], "outcomes": ["upheld"|"adjusted"|"training_required"], "auditTrailFields": string[]}}, "coachingLoop": {"cadence": "weekly"|"biweekly"|"monthly", "coachingTemplateFields": string[], "actions": [{"action": string, "whenToUse": string, "ownerRole": string}], "enablementContent": [{"topic": string, "artifact": string, "ownerRole": string}], "followUpVerification": {"how": string, "timeWindow": string}}, "reporting": {"kpis": [{"kpi": string, "definition": string, "target": string, "cadence": string}], "dashboards": [{"name": string, "audience": string[], "tiles": string[], "refreshCadence": string}], "execSummary": {"cadence": string, "fields": string[]}, "dataQualityChecks": string[]}, "implementationPlan": {"phases": [{"phase": string, "deliverables": string[], "ownerRole": string, "dueDate": string}], "risks": [{"risk": string, "mitigation": string}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Rubric is measurable (clear definitions, weights, examples, and auto-fail rules) and covers quality plus compliance/safety as needed",
      "Sampling plan and calibration process are explicit (stratification, cadence, agreement metrics, drift detection, and actions)",
      "QA integrates a practical coaching loop with reporting, audit trail fields, and data quality checks",
    ],
    opts
  );
};

export const knowledgeBaseProgramOps = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Knowledge base program operations",
      prompt:
        "Operationalize a knowledge base (KB) program: content pipeline, ownership, freshness SLAs, search analytics, and deflection measurement. " +
        "Focus on process mechanics (intake, prioritization, authoring, review, publication, maintenance), governance, and metrics. " +
        "Do not write the KB articles themselves. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "context": {"company": string, "kbSurfaces": string[], "channels": string[], "audiences": ["customers"|"internal_support"|"partners"|"mixed"], "assumptions": string[]}, "program": {"objectives": string[], "successMetrics": [{"metric": string, "definition": string, "target": string, "cadence": string}], "systemOfRecord": {"kbPlatform": string, "backlogTracking": string, "analytics": string, "sourceReposOrDocs": string[]}}, "ownershipAndRaci": [{"area": "strategy"|"taxonomy"|"content_intake"|"authoring"|"review"|"publishing"|"maintenance"|"localization"|"analytics"|"tooling"|"other", "responsibleRole": string, "accountableRole": string, "consultedRoles": string[], "informedRoles": string[]}], "taxonomy": {"categories": [{"category": string, "subcategories": string[], "definition": string}], "articleTypes": [{"type": "how_to"|"troubleshooting"|"faq"|"release_notes"|"api_doc"|"policy"|"internal_runbook"|"other", "definition": string}], "tags": [{"tag": string, "whenToUse": string}]}, "contentPipeline": {"intake": {"sources": [{"source": "tickets"|"search_terms"|"csat_comments"|"product_changes"|"incident_postmortems"|"community"|"sales_cs"|"other", "howCaptured": string, "ownerRole": string}], "requiredFields": string[], "triageCadence": "weekly"|"biweekly"|"monthly", "prioritizationRules": [{"when": string, "priority": "p0"|"p1"|"p2"|"p3", "reason": string}]}, "creation": {"templates": [{"templateName": string, "fields": string[], "definitionOfDone": string[]}], "authoringWorkflow": [{"step": string, "ownerRole": string, "system": string, "slaDays": number, "inputs": string[], "outputs": string[]}], "qualityChecks": string[]}, "reviewAndPublish": {"reviewers": [{"role": string, "whatTheyCheck": string[]}], "approvalRules": [{"when": string, "requiredApprovers": string[], "slaDays": number}], "publishingRules": {"urlOrSlugRules": string[], "versioning": string, "rollback": string}}, "maintenance": {"freshnessSla": [{"articleType": string, "reviewEveryDays": number, "expiryBehavior": "archive"|"hide"|"flag"|"auto_create_task", "ownerRole": string}], "updateTriggers": [{"trigger": string, "howDetected": string, "ownerRole": string, "action": string}], "staleContentRunbook": {"steps": string[], "escalationPath": string[]}}}, "analyticsAndDeflection": {"search": {"topQueries": {"howMeasured": string, "cadence": string}, "zeroResultQueries": {"howMeasured": string, "threshold": string, "actions": string[]}, "clickThroughRate": {"definition": string, "target": string}}, "deflection": {"definition": string, "howMeasured": string, "attributionRules": string[], "guardrails": string[]}, "contentPerformance": [{"metric": string, "definition": string, "target": string, "dimensions": string[]}], "experiments": [{"hypothesis": string, "change": string, "successMetric": string, "duration": string, "risks": string[]}]},"operatingCadence": {"rituals": [{"cadence": "weekly"|"monthly"|"quarterly", "attendees": string[], "agenda": string[], "inputs": string[], "outputs": string[]}], "reporting": {"audiences": string[], "cadence": string, "fields": string[]}, "governance": {"changeControl": string, "styleGuideWhere": string, "localizationPolicy": string}}, "backlog": [{"item": string, "sourceSignal": string, "priority": "p0"|"p1"|"p2"|"p3", "expectedImpact": string, "ownerRole": string, "definitionOfDone": string[]}], "implementationPlan": {"phases": [{"phase": string, "scope": string, "ownerRole": string, "deliverables": string[], "dueDate": string}], "dependencies": string[]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Pipeline defines intake, prioritization, authoring, review/publish, and maintenance with explicit SLAs, owners, and systems of record",
      "Program includes freshness SLAs, stale-content runbooks, and measurable deflection/search analytics with actions when metrics degrade",
      "Outputs include implementable templates, quality checks, and a cadence/governance model to keep KB healthy over time",
    ],
    opts
  );
};

export const slaSloPolicyAndEscalationPaths = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "SLA/SLO policy and escalation paths",
      prompt:
        "Define a support SLA/SLO policy and escalation paths: severity mapping, response/resolve targets, comms cadence, paging/on-call routing, handoffs, exception handling, and measurable compliance/reporting fields. " +
        "Make it operational (who does what by when, in which system) and applicable across channels and tiers. " +
        "Do not write incident comms drafts; define the policy, workflow, and reporting. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "context": {"company": string, "channels": string[], "supportTiers": string[], "regionsAndTimeZones": string[], "businessHours": string, "tools": {"ticketing": string, "pagerOrOnCall": string|null, "statusPage": string|null, "comms": string|null}}, "severityModel": {"principles": string[], "levels": [{"severity": "sev0"|"sev1"|"sev2"|"sev3"|"sev4", "definition": string, "customerImpact": string, "examples": string[], "defaultPriority": string, "whoCanSet": string[], "overrideRules": string[]}]}, "serviceCatalog": [{"service": string, "inScope": boolean, "notes": string, "availabilityTarget": string|null, "channelsSupported": string[], "tierOwningRole": string}], "slasAndSlos": {"response": [{"severity": string, "target": string, "businessHoursOnly": boolean, "measurement": {"startEvent": string, "stopEvent": string, "pauses": string[]}}], "resolution": [{"severity": string, "target": string, "businessHoursOnly": boolean, "measurement": {"startEvent": string, "stopEvent": string, "pauses": string[]}}], "customerComms": [{"severity": string, "firstUpdateWithin": string, "updateCadence": string, "channels": string[], "audience": string, "ownerRole": string}], "exceptions": {"allowed": boolean, "whenAllowed": string[], "howRecorded": string, "requiredApprovals": string[], "maxDuration": string, "reportingFields": string[]}}, "workflow": {"intakeAndClassification": {"requiredFields": string[], "classificationSteps": string[], "qaChecks": string[]}, "handoffs": [{"fromRole": string, "toRole": string, "when": string, "requiredEvidence": string[], "requiredFields": string[], "ackSla": string, "notes": string}], "escalations": [{"trigger": string, "severity": string, "escalateToRole": string, "withinMinutes": number, "channel": string, "requiredContext": string[], "expectedOutcome": string}], "pagingAndOnCall": {"whenToPage": string[], "routingRules": [{"when": string, "routeTo": string, "fallback": string}], "ackSlaMinutes": number, "handoffTemplateFields": string[]}, "postIncidentOrEscalation": {"whenRequired": string[], "templates": {"retrospectiveFields": string[], "customerFollowUpFields": string[]}, "slaBreachHandling": {"howFlagged": string, "whoNotified": string[], "requiredActions": string[]}}}, "reportingAndCompliance": {"kpis": [{"kpi": string, "definition": string, "target": string, "cadence": string}], "dashboards": [{"name": string, "audience": string[], "tiles": string[], "refreshCadence": string}], "alerts": [{"alert": string, "threshold": string, "routeTo": string, "escalation": string[]}], "auditTrailFields": string[], "dataSources": [{"system": string, "objects": string[], "fields": string[]}]}, "governance": {"ownerRole": string, "reviewCadence": "monthly"|"quarterly"|"semiannual", "changeControl": {"howRequested": string, "approvers": string[], "effectiveDateRule": string}, "trainingAndEnablement": {"whoTrained": string[], "cadence": string, "materials": string[]}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Severity mapping and targets are explicit and measurable (start/stop events, pauses, business-hours rules)",
      "Escalation paths include routing, paging rules, handoffs, evidence requirements, comms cadence, and exception handling",
      "Policy includes reporting fields and governance so SLA/SLO compliance is monitorable and improvable over time",
    ],
    opts
  );
};

export const supportBacklogTriageCadenceTemplate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Support backlog triage cadence template",
      prompt:
        "Create a recurring backlog triage cadence template for support operations: daily/weekly rituals, prioritization rules, aging controls, escalation paths, and output artifacts. " +
        "Represent recurring work as schedule/checklist templates (no code loops or sleep calls). Output JSON only. Output JSON: " +
        '{ "asOf": string, "context": {"ticketingSystem": string, "supportTiers": string[], "regionsAndTimeZones": string[], "businessHours": string}, "cadence": [{"frequency": "daily"|"weekly", "ritual": {"name": string, "meetingOrAsync": string, "attendees": string[], "agenda": string[], "inputs": string[], "outputs": string[]}, "triageRules": [{"rule": string, "priority": "p0"|"p1"|"p2"|"p3", "why": string}], "checklists": [{"name": string, "items": [{"item": string, "ownerRole": string, "definitionOfDone": string, "systemOfRecord": string}]}], "alerts": [{"trigger": string, "severity": "low"|"medium"|"high", "ownerRole": string, "action": string}]}], "agingControls": {"targets": [{"bucket": string, "maxAgeDays": number, "definition": string}], "autoEscalateWhen": string[], "stuckTicketRunbook": {"steps": string[], "escalationPath": string[]}}, "artifacts": {"dailySummaryTemplate": {"fields": string[]}, "weeklyHealthReviewTemplate": {"fields": string[]}, "systemOfRecord": string}, "metrics": [{"metric": string, "definition": string, "target": string|null, "cadence": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Cadence includes concrete rituals, triage rules, checklists, and alerts suitable for repeatable backlog control",
      "Aging controls define targets and stuck-ticket runbooks with escalation paths to reduce long-tail backlog risk",
      "Artifacts and systems of record make outputs auditable and useful for continuous improvement",
    ],
    opts
  );
};

export const supportCostToServeModelSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Support cost-to-serve model spec",
      prompt:
        "Create a support cost-to-serve model spec: define how to compute cost per ticket/contact and cost by segment (tier, plan, product, channel, priority), including inputs, allocation rules, refresh cadence, and validation checks. " +
        "Keep it operational (systems of record, definitions, QA, and governance). Output JSON only. Output JSON: " +
        '{ "asOf": string, "currency": string, "timeZone": string, "context": {"ticketing": string, "wfmOrScheduling": string|null, "financeOrPayroll": string|null, "warehouseOrBi": string|null}, "costInputs": [{"cost": "labor"|"vendor"|"tooling"|"overhead"|"other", "sourceSystem": string, "allocationRule": string, "notes": string}], "activityInputs": [{"metric": string, "sourceSystem": string, "definition": string, "grain": string, "notes": string}], "modelOutputs": [{"output": "cost_per_ticket"|"cost_per_contact"|"cost_per_resolution"|"cost_per_account"|"other", "definition": string, "formula": string, "dimensions": string[], "segmentCuts": string[], "refreshCadence": "weekly"|"monthly"|"quarterly", "ownerRole": string}], "allocationAndAttribution": {"sharedCostPolicy": string, "whenToUseCostPools": string, "guardrails": string[]}, "validation": [{"check": string, "how": string, "cadence": string, "ownerRole": string, "failureAction": string}], "governance": {"systemOfRecord": string, "changeControl": {"howRequested": string, "approvers": string[], "versioning": string}, "reviewCadence": string}, "uses": [{"decision": string, "whoUses": string[], "whatThresholdMatters": string}], "knownLimitations": string[], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Spec defines inputs, allocation rules, and outputs with formulas/dimensions so cost-to-serve is defensible",
      "Validation checks and governance make the model stable and usable over time (refresh cadence, owners, change control)",
      "Outputs connect to decisions (staffing, deflection, tiering, automation) with clear thresholds and limitations",
    ],
    opts
  );
};
