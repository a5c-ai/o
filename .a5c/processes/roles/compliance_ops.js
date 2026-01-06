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

export const complianceProgramRoadmap = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Compliance program roadmap",
      prompt:
        "Build an operational compliance roadmap to achieve and maintain a target assurance regime (e.g., SOC 2 Type II, ISO 27001). Focus on execution: governance, milestones, owners, dependencies, and risks; do not write a controls matrix or draft policies. Output JSON only. Output JSON: " +
        '{ "program": {"targetRegime": string, "typeOrStage": string, "targetAuditWindow": string, "scopeStatement": string, "inScopeEntities": string[], "inScopeSystems": string[], "outOfScope": string[], "assumptions": string[]}, "governance": {"executiveSponsorRole": string, "programOwnerRole": string, "stakeholders": {"role": string, "responsibility": string}[], "cadence": {"weekly": string, "monthly": string, "quarterly": string}, "decisionLogSystemOfRecord": string, "statusReporting": {"audience": string[], "format": string, "metrics": string[]}}, "workstreams": [{"name": string, "ownerRole": string, "objective": string, "keyDeliverables": string[], "dependencies": string[], "risks": string[]}], "milestones": [{"id": string, "name": string, "description": string, "ownerRole": string, "startDate": string, "dueDate": string, "dependsOn": string[], "deliverables": string[], "definitionOfDone": string[], "status": "not_started"|"in_progress"|"blocked"|"done", "blockers": string[]}], "risks": [{"risk": string, "likelihood": "low"|"medium"|"high", "impact": "low"|"medium"|"high", "ownerRole": string, "mitigations": string[], "earlyWarnings": string[], "contingencyPlan": string}], "dependenciesAndExternalInputs": [{"dependency": string, "ownerRole": string, "neededBy": string, "riskIfLate": string}], "operatingMetrics": [{"metric": string, "definition": string, "target": string, "sourceSystem": string, "cadence": string}], "next30DaysPlan": {"topPriorities": string[], "criticalPathItems": string[], "openQuestions": string[]} }',
      input,
    },
    ctx,
    [
      "Milestones include realistic dates, owners, dependencies, and definitions of done",
      "Governance includes specific cadences, systems of record, and measurable status metrics",
      "Risks include owners, early warnings, mitigations, and contingency plans tied to the roadmap",
      "Next-30-days plan lists concrete critical-path actions and open questions needed to proceed",
    ],
    opts
  );
};

export const evidenceCollectionRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Evidence collection runbook",
      prompt:
        "Define an evidence collection runbook for an audit-ready compliance program. Focus on operational collection: systems of record, artifacts, cadences, responsibilities, QA checks, and escalation paths; do not produce a full controls matrix. Output JSON only. Output JSON: " +
        '{ "scope": {"targetRegime": string, "auditPeriod": {"start": string, "end": string}, "inScopeSystems": string[], "assumptions": string[]}, "roles": {"programOwnerRole": string, "controlOwners": {"controlDomain": string, "ownerRole": string}[], "evidenceCollectors": {"system": string, "role": string}[], "evidenceReviewers": {"domain": string, "role": string}[]}, "systemsOfRecord": [{"system": string, "whatStored": string[], "accessModel": string, "retention": string}], "evidenceItems": [{"controlRef": string, "description": string, "systemOfRecord": string, "artifactLocation": string, "collectionMethod": "manual"|"automated"|"hybrid", "cadence": "weekly"|"monthly"|"quarterly"|"semiannual"|"annual"|"on_change", "ownerRole": string, "collectorRole": string, "reviewerRole": string, "qaChecks": string[], "samplingMethod": string, "exceptionsHandling": string, "sla": {"collectByDays": number, "reviewByDays": number}, "automationPlan": {"opportunity": string, "effort": "low"|"medium"|"high", "notes": string}}], "runbook": {"intakeAndScheduling": {"howRequestsAreCreated": string, "calendarCadence": string, "workQueueSystem": string}, "collectionSteps": string[], "reviewAndSignoffSteps": string[], "versioningRules": string[], "auditTrailFields": string[], "escalationPath": [{"trigger": string, "who": string, "withinHours": number, "action": string}]}, "qualityDashboard": {"metrics": [{"metric": string, "definition": string, "target": string, "cadence": string}], "reportingCadence": string, "owners": string[]}, "topGapsAndFixes": [{"gap": string, "impact": string, "recommendedFix": string, "ownerRole": string, "dueDate": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Each evidence item specifies system of record, artifact location, cadence, and clear owner/collector/reviewer roles",
      "Runbook includes QA checks, sampling method, SLAs, and an escalation path with time bounds",
      "Defines an audit trail and versioning rules so artifacts are reproducible and reviewable",
      "Includes actionable gaps/fixes with owners and due dates to reach audit readiness",
    ],
    opts
  );
};

export const complianceExceptionsWorkflow = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Compliance exceptions workflow",
      prompt:
        "Create an operational workflow for compliance exceptions and risk acceptance (intake, triage, approvals, compensating controls, expiry, monitoring, and audit trail). Focus on governance and execution; do not draft policies. Output JSON only. Output JSON: " +
        '{ "scope": {"exceptionTypes": string[], "appliesTo": string[], "systems": string[], "assumptions": string[]}, "intakeForm": {"requiredFields": [{"field": string, "type": string, "description": string}], "attachmentsExpected": string[], "systemOfRecord": string}, "triage": {"triageOwnerRole": string, "slaHours": number, "severityModel": [{"severity": "low"|"medium"|"high"|"critical", "criteria": string[], "defaultExpiryDays": number}], "decisionOutcomes": ["approve"|"reject"|"request_changes"|"needs_more_info"], "routingRules": [{"when": string, "routeToRole": string}]}, "approvalMatrix": [{"severity": "low"|"medium"|"high"|"critical", "requiredApprovers": string[], "quorum": string, "timeboxDays": number}], "workflowSteps": [{"step": string, "ownerRole": string, "inputs": string[], "outputs": string[], "exitCriteria": string[]}], "compensatingControls": {"requiredTemplate": {"control": string, "implementation": string, "ownerRole": string, "verification": string, "frequency": string}, "verificationCadence": string}, "expiryAndRenewal": {"maxDurationDays": number, "renewalLeadTimeDays": number, "renewalCriteria": string[], "autoCloseRules": string[]}, "monitoringAndReporting": {"metrics": [{"metric": string, "definition": string, "cadence": string}], "dashboards": [{"name": string, "system": string, "audience": string[]}], "alerts": [{"trigger": string, "severity": "low"|"medium"|"high"|"critical", "notifies": string[], "withinHours": number}]}, "auditTrail": {"fields": string[], "evidenceAttachments": string[], "changeLogRequired": boolean}, "templates": {"exceptionRecordTemplate": string, "riskAcceptanceStatementTemplate": string}, "commonFailureModes": [{"failureMode": string, "prevention": string, "detection": string, "response": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Workflow defines intake fields, triage SLAs, severity routing, and approval matrix with timeboxes",
      "Exceptions require compensating controls with owners and a verification cadence that is monitorable",
      "Expiry/renewal rules are explicit (lead time, max duration, auto-close) and tie to alerts and reporting",
      "Audit trail fields ensure decisions are attributable and reviewable for auditors",
    ],
    opts
  );
};

export const policyAttestationAndTrainingProgram = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Policy attestation and training program",
      prompt:
        "Design an operational policy lifecycle plus training/attestation program (audiences, cadence, tracking, escalations, reporting). Focus on implementation mechanics (systems, workflows, metrics); do not draft policy text or a policy pack. Output JSON only. Output JSON: " +
        '{ "programOverview": {"goals": string[], "assumptions": string[], "systemOfRecord": {"policyRepo": string, "trainingPlatform": string, "attestationTracking": string}}, "policyLifecycleOps": {"policyOwners": [{"policyArea": string, "ownerRole": string}], "reviewCadence": {"default": string, "highRiskAreas": string}, "changeManagement": {"versioningRules": string[], "approvalSteps": string[], "communicationChannels": string[]}, "exceptionsLink": {"exceptionsWorkflowSystem": string, "howExceptionsAreReferenced": string}}, "audiences": [{"audience": string, "whoIncluded": string[], "requiredTrainings": string[], "requiredAttestations": string[], "cadence": string, "dueWithinDays": number}], "trainingCatalog": [{"name": string, "objective": string, "audiences": string[], "delivery": "live"|"async"|"hybrid", "durationMinutes": number, "frequency": "onboarding"|"annual"|"semiannual"|"quarterly"|"on_change", "contentSources": string[], "ownerRole": string, "completionCriteria": string, "knowledgeCheck": {"required": boolean, "passingScore": number|null}}], "attestationWorkflow": {"triggers": ["onboarding"|"annual"|"on_change"], "steps": [{"step": string, "ownerRole": string, "system": string, "slaDays": number}], "reminders": [{"whenDaysBeforeDue": number, "channel": string, "messageStyle": string}], "escalations": [{"whenDaysOverdue": number, "toRole": string, "action": string}], "nonComplianceHandling": {"accessRestrictions": string[], "hrActions": string[], "exceptionsAllowed": boolean}}, "trackingAndReporting": {"kpis": [{"kpi": string, "definition": string, "target": string, "cadence": string}], "reports": [{"name": string, "audience": string[], "cadence": string, "fields": string[]}], "samplingAndQa": {"samplingMethod": string, "qaChecks": string[], "evidenceRetention": string}}, "rolloutPlan": {"phases": [{"phase": string, "scope": string, "startDate": string, "dueDate": string, "ownerRole": string, "deliverables": string[]}], "communicationsPlan": [{"audience": string, "channel": string, "when": string, "message": string}], "risks": [{"risk": string, "mitigation": string}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Defines concrete audiences with due windows, required trainings/attestations, and enforcement/escalation rules",
      "Specifies systems of record and reporting fields so completion and evidence are auditable",
      "Includes QA sampling, retention, and measurable KPIs with targets and cadence",
      "Rollout plan includes phased dates, owners, deliverables, and communication plan tied to adoption risk",
    ],
    opts
  );
};

export const auditPbcTrackerSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Audit PBC tracker spec",
      prompt:
        "Create a PBC (prepared-by-client) tracker spec for an audit: requests, owners, due dates, evidence links, QA, and escalation. " +
        "Focus on operational tracking and auditability; do not draft audit narrative. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "audit": {"framework": string, "period": string, "auditor": string|null}, "requests": [{"id": string, "area": string, "request": string, "ownerRole": string, "systemsOfRecord": string[], "due": string, "status": "not_started"|"in_progress"|"blocked"|"ready"|"submitted", "evidenceLinks": string[], "qaChecks": string[], "blockers": string[], "escalation": {"when": string, "to": string[], "messageTemplate": string}}], "cadence": {"standup": string, "statusReport": {"audience": string[], "templateSections": string[]}}, "metrics": {"onTimePctTarget": string, "qaPassTarget": string}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Requests are normalized into an operational tracker with owners, due dates, systems of record, and evidence links",
      "QA checks and escalation paths are explicit so the tracker drives on-time, auditor-ready submissions",
      "Cadence and metrics make progress measurable (on-time and QA pass targets)",
    ],
    opts
  );
};

export const accessReviewAndSodControlRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Access review and SoD control runbook",
      prompt:
        "Define an access review + segregation-of-duties (SoD) control runbook: systems, reviewers, evidence, exceptions, and renewal cadence. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "systems": [{"system": string, "ownerRole": string, "reviewCadence": string, "roles": [{"role": string, "whoShouldHave": string[], "approval": string[], "sodConflicts": string[]}], "evidence": {"whereStored": string, "fields": string[]}}], "process": {"steps": [{"step": string, "ownerRole": string, "dueRule": string, "inputs": string[], "outputs": string[]}], "exceptions": {"whenAllowed": string[], "approvalRoles": string[], "expiry": string, "howTracked": string}}, "controls": {"qaChecks": string[], "auditTrail": string[]}, "metrics": {"reviewCompletionTarget": string, "exceptionExpiryComplianceTarget": string}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Runbook is runnable: clear steps, due rules, and evidence fields per system and role set",
      "Exceptions are governed (approval roles, expiry, tracking) and show up in audit trail and metrics",
      "QA checks ensure the review is verifiable and consistent across cycles",
    ],
    opts
  );
};

export const recurringComplianceCadenceTemplate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Recurring compliance cadence template",
      prompt:
        "Create a recurring compliance operating cadence template (daily/weekly/monthly/quarterly) as schedule + checklists + alerts. " +
        "Do NOT write code loops or sleep; this is a template/spec only. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "cadence": [{"frequency": "daily"|"weekly"|"monthly"|"quarterly", "meeting": {"name": string, "attendees": string[], "agenda": string[], "inputs": string[], "outputs": string[]}, "checklists": [{"name": string, "items": [{"item": string, "ownerRole": string, "definitionOfDone": string, "systemOfRecord": string}]}], "alerts": [{"trigger": string, "severity": "low"|"medium"|"high", "ownerRole": string, "action": string}]}], "kpis": [{"name": string, "definition": string, "target": string, "cadence": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Cadence is explicit and actionable (meetings, checklists, inputs/outputs, owners, and systems of record)",
      "Alerts and KPIs make the cadence operationally enforceable (not just a calendar)",
      "Template avoids any runtime loops/sleeps and remains a pure schedule spec",
    ],
    opts
  );
};
