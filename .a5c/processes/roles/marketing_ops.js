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

export const martechStackMapAndDataFlows = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Martech stack map and data flows",
      prompt:
        "Map the marketing tech stack and the end-to-end data flows between systems (MAP/CRM/warehouse/ads/web analytics/tag manager/cookie & consent). " +
        "Focus on operational ownership, identifiers, sync mechanisms, monitoring, failure modes, and controls. " +
        "Do not write marketing strategy, creative, or experimentation plans. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "context": {"company": string, "businessModel": "b2b"|"b2c"|"b2b2c"|"marketplace"|"other", "regions": string[], "primaryConversion": string}, "systems": [{"name": string, "category": "crm"|"map"|"cdp"|"data_warehouse"|"reverse_etl"|"web_analytics"|"tag_manager"|"cms"|"ads_platform"|"attribution"|"consent_mgmt"|"data_enrichment"|"bi"|"support"|"other", "vendor": string|null, "systemOfRecordFor": string[], "ownerRole": string, "admins": string[], "dataResidency": string|null, "accessModel": {"provisioning": string, "roles": [{"role": string, "canRead": string[], "canWrite": string[], "notes": string}]}, "criticality": "low"|"medium"|"high", "notes": string}], "identifiers": {"people": [{"id": "email"|"phone"|"user_id"|"anonymous_id"|"crm_contact_id"|"map_lead_id"|"other", "sourceSystem": string, "format": string, "stability": "stable"|"semi_stable"|"unstable", "privacySensitivity": "low"|"medium"|"high", "notes": string}], "accounts": [{"id": "domain"|"crm_account_id"|"duns"|"other", "sourceSystem": string, "format": string, "stability": "stable"|"semi_stable"|"unstable", "notes": string}]}, "dataObjects": [{"object": string, "description": string, "systemOfRecord": string, "keyFields": string[], "upstreamDependencies": string[], "downstreamConsumers": string[], "retentionPolicy": string|null, "piiFields": string[]}], "dataFlows": [{"name": string, "fromSystem": string, "toSystem": string, "direction": "one_way"|"two_way", "mechanism": "native_connector"|"api"|"webhook"|"sftp"|"csv_import"|"dbt"|"reverse_etl_sync"|"tag_manager"|"pixel"|"server_side_tracking"|"manual"|"other", "frequency": "real_time"|"hourly"|"daily"|"weekly"|"ad_hoc", "trigger": string, "objectsMoved": string[], "mapping": {"keys": [{"fromField": string, "toField": string, "transform": string|null, "required": boolean}], "dropOrIgnore": string[]}, "identityRules": {"matchKeys": string[], "mergePolicy": string, "conflictResolution": string, "suppressionRules": string[]}, "controls": {"validationChecks": [{"check": string, "where": string, "failureAction": string}], "loggingAndAuditTrail": {"where": string, "fields": string[]}, "accessControls": string[]}, "monitoring": {"metrics": [{"metric": string, "definition": string, "target": string|null}], "alerts": [{"alert": string, "threshold": string, "ownerRole": string, "escalationPath": string[]}], "dashboards": string[]}, "failureModes": [{"failure": string, "symptoms": string[], "rootCauses": string[], "impact": string, "detection": string, "mitigation": string, "runbook": string}]}], "operatingCadence": {"routines": [{"cadence": "daily"|"weekly"|"monthly"|"quarterly", "ownerRole": string, "checks": string[], "outputs": string[]}], "changeManagement": {"requestIntake": string, "approvalRoles": string[], "testingChecklist": string[], "rollbackProcedure": string, "releaseNotesWhere": string}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Systems include clear ownership, system-of-record boundaries, access model, and criticality so governance is actionable",
      "Data flows specify mechanisms, keys/mappings, identity rules, and controls with concrete monitoring/alerts and runbooks",
      "Failure modes and mitigations are operational (detection signals, escalation paths, and rollback/change management)",
    ],
    opts
  );
};

export const campaignTaxonomyAndGovernance = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Campaign taxonomy and governance",
      prompt:
        "Define a campaign taxonomy, naming conventions, and governance for consistent attribution and reporting. " +
        "Include UTM rules, channel hierarchy, CRM/MAP campaign fields, QA checks, and change control. " +
        "Do not propose creative strategy or channel budget allocation. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "version": string, "goals": string[], "taxonomy": {"levels": [{"level": "portfolio"|"program"|"campaign"|"ad_set"|"ad"|"initiative"|"other", "definition": string, "required": boolean}], "dimensions": [{"dimension": "channel"|"subchannel"|"audience"|"offer"|"product"|"geo"|"funnel_stage"|"segment"|"partner"|"event"|"content_type"|"other", "definition": string, "allowedValues": string[]|null, "required": boolean, "sourceOfTruthField": string}], "hierarchyRules": string[]}, "namingConvention": {"pattern": string, "components": [{"component": string, "definition": string, "allowedValues": string[]|null, "examples": string[]}], "delimiter": string, "maxLength": number, "examples": [{"name": string, "explains": string}]}, "utmStandard": {"required": ["utm_source","utm_medium","utm_campaign"], "optional": ["utm_content","utm_term"], "rules": [{"field": "utm_source"|"utm_medium"|"utm_campaign"|"utm_content"|"utm_term", "rule": string, "validation": string, "examples": string[]}], "builderProcess": {"where": string, "whoCanCreate": string[], "approvalIfNewValue": string, "storage": string}}, "systemFields": {"crm": {"campaignObject": string, "requiredFields": string[], "fieldMappings": [{"utmField": string, "crmField": string, "notes": string}]}, "map": {"campaignField": string, "requiredFields": string[], "fieldMappings": [{"utmField": string, "mapField": string, "notes": string}]}, "warehouse": {"tables": string[], "grain": string, "dimensions": string[], "standardViews": string[]}}, "qaAndEnforcement": {"preLaunchChecklist": [{"check": string, "how": string, "ownerRole": string}], "automatedValidations": [{"where": string, "rule": string, "failureHandling": string}], "samplingAudit": {"cadence": "weekly"|"monthly"|"quarterly", "sampleSize": number, "howSelected": string, "acceptanceCriteria": string[]}, "commonFailureModes": [{"failure": string, "howToDetect": string, "fix": string}]}, "governance": {"owners": [{"area": "taxonomy"|"utms"|"crm_fields"|"warehouse_models"|"qa"|"other", "ownerRole": string}], "changeControl": {"requestIntake": string, "approvalRoles": string[], "versioning": string, "communication": string}, "exceptions": [{"whenAllowed": string, "howToDocument": string, "expiryPolicy": string}]}, "reportingContract": {"metricDependencies": [{"metric": string, "requires": string[]}], "dashboards": [{"name": string, "audience": string, "refreshCadence": string, "ownerRole": string}], "reconciliationChecks": [{"check": string, "how": string, "cadence": string, "ownerRole": string}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Taxonomy and naming convention are enforceable (clear pattern, required dimensions, allowed values or governance for new values)",
      "UTM and system field mappings are explicit across CRM/MAP/warehouse so attribution and reporting are consistent",
      "QA, enforcement, and change control include concrete validations, audits, exception handling, and reconciliation checks",
    ],
    opts
  );
};

export const lifecycleAutomationSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Lifecycle automation specification",
      prompt:
        "Specify lifecycle automation as an operational spec (segments, triggers, suppression, frequency caps, QA/testing, rollback). " +
        "Keep this in marketing operations scope: data/logic, governance, monitoring, and runbooks. " +
        "Do not write copy, creative, or growth strategy; use placeholders for message content where needed. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "systems": {"mapOrMessagingPlatform": string, "crm": string, "warehouseOrCdp": string, "experimentTool": string|null}, "lifecycleModel": {"stages": [{"stage": string, "definition": string, "entryCriteria": string[], "exitCriteria": string[]}], "precedenceRules": string[]}, "segments": [{"name": string, "stage": string, "definition": string, "eligibilityRules": string[], "exclusions": string[], "dataDependencies": string[], "ownerRole": string}], "frequencyCaps": {"global": {"perDay": number, "perWeek": number, "perMonth": number, "notes": string}, "byChannel": [{"channel": "email"|"sms"|"push"|"in_app"|"webhook"|"other", "perDay": number, "perWeek": number, "notes": string}]}, "automations": [{"name": string, "objective": string, "stage": string, "audienceSegment": string, "trigger": {"type": "event"|"field_change"|"schedule"|"api_call"|"other", "definition": string, "debounceWindow": string|null}, "entryConditions": string[], "suppressionRules": string[], "steps": [{"step": number, "channel": "email"|"sms"|"push"|"in_app"|"webhook"|"other", "delay": string, "templateOrAssetRef": string, "personalizationInputs": string[], "fallbackBehavior": string, "successEvent": string|null}], "branching": [{"when": string, "then": string, "else": string}], "handoffs": [{"when": string, "handoffToRole": string, "artifact": string, "requiredFields": string[]}], "dataWrites": [{"system": string, "field": string, "valueRule": string, "purpose": string}], "qa": {"preLaunchTests": [{"test": string, "how": string, "expected": string}], "canaryPlan": {"who": string, "sampleSize": number, "duration": string, "successCriteria": string[]}, "postLaunchMonitoring": [{"metric": string, "threshold": string, "action": string}]}, "rollbackPlan": {"triggers": string[], "steps": string[], "dataFixIfNeeded": string}, "runbook": {"ownerRole": string, "triageSteps": string[], "escalationPath": string[]}}], "experimentation": {"allowed": boolean, "guardrails": string[], "assignment": {"method": "platform_native"|"warehouse_based"|"other", "unit": "user"|"account"|"device"|"unknown", "requirements": string[]}, "analysisFields": string[]}, "auditAndGovernance": {"changeControl": {"requestIntake": string, "approvalRoles": string[], "testingRequired": string[], "rolloutWindows": string}, "documentationWhere": string, "reviewCadence": "monthly"|"quarterly"|"semiannual", "sunsetPolicy": string}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Segments and triggers are implementable (clear eligibility/exclusion rules and explicit data dependencies/owners)",
      "Automation specs include suppression and frequency caps, QA/canary steps, monitoring thresholds, and rollback/runbooks",
      "Governance covers change control, documentation, and review/sunset policies so automations stay healthy over time",
    ],
    opts
  );
};

export const marketingDataQualityAudit = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Marketing data quality audit",
      prompt:
        "Audit and operationalize marketing data quality across forms, consent, dedupe, identity resolution, and field completeness. " +
        "Produce an audit plan plus a remediation backlog and ongoing monitoring (tests, alerts, owners). " +
        "Do not write a marketing strategy or redesign the full GTM motion; stay in data quality + governance. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "scope": {"systems": string[], "datasets": string[], "timeWindow": string, "inclusions": string[], "exclusions": string[]}, "qualityDimensions": [{"dimension": "completeness"|"validity"|"uniqueness"|"timeliness"|"consistency"|"consent_compliance"|"attribution_integrity"|"other", "definition": string, "whyItMatters": string}], "dataContracts": [{"datasetOrObject": string, "systemOfRecord": string, "owners": string[], "requiredFields": [{"field": string, "type": string, "rule": string, "nullAllowed": boolean}], "identifiers": string[], "freshnessSla": string, "consentRequirements": string[], "notes": string}], "auditChecks": [{"area": "forms"|"consent"|"identity_resolution"|"dedupe"|"utm_attribution"|"crm_sync"|"email_events"|"ads_ingestion"|"field_completeness"|"other", "checks": [{"check": string, "how": string, "where": string, "severity": "low"|"medium"|"high", "threshold": string|null, "ownerRole": string, "evidence": string, "failureAction": string}]}], "knownRisks": [{"risk": string, "impact": string, "likelihood": "low"|"medium"|"high", "mitigation": string, "ownerRole": string}], "remediationBacklog": [{"issue": string, "rootCauseHypothesis": string, "affectedSystems": string[], "fix": {"type": "process"|"validation"|"pipeline"|"schema"|"permissions"|"vendor_config"|"other", "steps": string[], "systemOfRecordChange": string|null}, "ownerRole": string, "priority": "p0"|"p1"|"p2"|"p3", "effort": "s"|"m"|"l"|"xl", "expectedImpact": string, "verification": string, "targetDate": string|null}], "monitoring": {"tests": [{"test": string, "sqlOrRule": string, "cadence": "hourly"|"daily"|"weekly", "ownerRole": string, "failureAction": string}], "alerts": [{"alert": string, "threshold": string, "routeTo": string, "escalation": string[]}], "dashboards": [{"name": string, "tiles": string[], "audience": string, "refreshCadence": string}]}, "operatingCadence": {"reviewCadence": "weekly"|"monthly"|"quarterly", "meeting": {"attendees": string[], "agenda": string[], "inputs": string[], "outputs": string[]}, "definitionOfDoneForFixes": string[]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Audit checks cover consent, identity, dedupe, completeness, and attribution integrity with explicit thresholds, evidence, and owners",
      "Remediation backlog is execution-ready (root cause, concrete fix steps, priority/effort, verification, and target dates where possible)",
      "Monitoring and operating cadence make data quality sustainable (tests/alerts/dashboards plus review rituals and definition of done)",
    ],
    opts
  );
};

export const utmGovernanceAuditRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "UTM governance audit runbook",
      prompt:
        "Create a UTM governance audit runbook: what to audit, how to sample, how to detect bad UTMs, remediation workflow, and ongoing enforcement. " +
        "Keep it operational (systems/owners/checklists) and compatible with the existing campaign taxonomy. Output JSON only. Output JSON: " +
        '{ "asOf": string, "scope": {"channels": string[], "regions": string[], "surfaces": string[], "timeWindow": string}, "standards": {"requiredParams": string[], "allowedValuesWhere": string, "namingRules": string[], "builderOrGenerator": {"where": string, "whoCanCreate": string[], "approvalIfNewValue": string}}, "audit": {"cadence": "weekly"|"monthly"|"quarterly", "samplingPlan": {"howSelected": string, "sampleSize": number, "acceptanceCriteria": string[]}, "checks": [{"check": string, "how": string, "severity": "low"|"medium"|"high", "threshold": string|null, "ownerRole": string}]}, "detection": {"automations": [{"where": string, "rule": string, "failureHandling": string}], "dashboards": [{"name": string, "system": string, "tiles": string[]}], "alerts": [{"trigger": string, "severity": "low"|"medium"|"high", "routeToRole": string, "responseSla": string}]}, "remediationWorkflow": [{"step": string, "ownerRole": string, "sla": string, "inputs": string[], "outputs": string[], "systemOfRecord": string}], "exceptionHandling": {"whenAllowed": string[], "approvalRoles": string[], "howDocumented": string, "expiryPolicy": string}, "metrics": [{"metric": string, "definition": string, "target": string|null, "cadence": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Runbook defines enforceable standards plus a concrete audit cadence with sampling, checks, and owners",
      "Detection includes automations, dashboards, and alert routing with response SLAs to prevent repeated drift",
      "Remediation and exceptions are operational (system-of-record, approvals, expiry) and drive measurable improvement",
    ],
    opts
  );
};

export const formAndLandingPageQaChecklist = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Form and landing page QA checklist",
      prompt:
        "Create a form and landing page QA checklist for marketing ops: tracking, consent, routing, spam protection, analytics validation, accessibility basics, and rollback. " +
        "Keep it operational and implementable with owners, systems of record, and definition of done; do not write copy. Output JSON only. Output JSON: " +
        '{ "asOf": string, "scope": {"surfaces": string[], "regions": string[], "formPlatforms": string[], "cms": string|null, "mapOrCrm": string[]}, "preLaunch": [{"check": string, "ownerRole": string, "howToVerify": string, "definitionOfDone": string, "systemOfRecord": string}], "trackingAndAttribution": {"requiredEvents": string[], "utmHandling": string, "pixelOrServerSideTracking": string, "validationSteps": string[]}, "consentAndPrivacy": {"requiredChecks": string[], "regionNotes": [{"region": string, "notes": string}], "auditTrailWhere": string}, "dataAndRouting": {"fieldMappingChecks": string[], "dedupeChecks": string[], "leadRoutingOrHandoffChecks": string[], "failureModes": [{"failure": string, "symptoms": string[], "fix": string}]}, "spamAndAbuseProtection": {"controls": string[], "monitoring": string[], "thresholds": string[]}, "postLaunch": {"monitoringWindow": string, "checks": [{"check": string, "cadence": string, "ownerRole": string, "failureAction": string}], "rollbackPlan": {"triggers": string[], "steps": string[]}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Checklist is runnable with concrete verification steps, owners, definition of done, and systems of record",
      "Covers tracking/attribution, consent, and routing/field mapping so leads are reliable and compliant",
      "Post-launch monitoring and rollback plan reduce risk from production form/LP changes",
    ],
    opts
  );
};
