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

export const procurementIntakeAndWorkflow = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Procurement intake and workflow",
      prompt:
        "Create an operational procurement intake and workflow (required fields, routing, SLAs, RACI, systems of record, and auditable artifacts). " +
        "Stay in procurement operations scope: intake, approvals, handoffs, tracking, and execution cadence. " +
        "Do not perform legal contract negotiation or draft contract language; do not write vendor selection memos. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "scope": {"spendTypes": string[], "inclusions": string[], "exclusions": string[]}, "intake": {"channels": [{"channel": "ticketing"|"procurement_tool"|"email"|"form"|"slack"|"other", "where": string, "notes": string}], "requestForm": {"fields": [{"field": string, "type": "string"|"number"|"boolean"|"date"|"enum"|"array"|"object", "required": boolean, "definition": string, "allowedValues": string[]|null, "example": string|null}], "attachments": [{"name": string, "required": boolean, "description": string}]}, "triage": {"prioritizationRules": [{"rule": string, "priority": "p0"|"p1"|"p2"|"p3"}], "routingRules": [{"when": string, "routeToRole": string, "notes": string}], "sla": {"firstResponse": string, "timeToNextStep": string, "howMeasured": string}}}, "workflow": {"stages": [{"stage": "intake"|"triage"|"requirements"|"security_review"|"legal_review"|"finance_review"|"vendor_due_diligence"|"negotiation"|"purchase_order"|"onboarding"|"implementation"|"invoicing"|"complete"|"rejected"|"other", "entryCriteria": string[], "exitCriteria": string[], "ownerRole": string, "artifacts": [{"artifact": string, "systemOfRecord": string, "requiredFields": string[]}], "sla": string, "exceptions": string[]}], "handoffs": [{"fromStage": string, "toStage": string, "handoffToRole": string, "requiredContext": string[], "definitionOfReady": string[]}]}, "raci": [{"activity": string, "responsible": string[], "accountable": string[], "consulted": string[], "informed": string[]}], "systemsOfRecord": [{"area": "intake"|"approvals"|"contracts"|"security_review"|"vendor_master"|"purchase_orders"|"invoices"|"renewals"|"other", "system": string, "urlOrLocation": string|null, "dataCaptured": string[], "ownerRole": string}], "metricsAndReporting": {"kpis": [{"metric": string, "definition": string, "target": string|null, "cadence": "weekly"|"monthly"|"quarterly", "ownerRole": string}], "dashboards": [{"name": string, "audience": string, "tiles": string[], "refreshCadence": string}], "alerts": [{"alert": string, "threshold": string, "routeTo": string, "escalation": string[]}]}, "controls": {"auditTrail": {"where": string, "requiredFields": string[], "retentionPolicy": string}, "segregationOfDuties": string[], "exceptionProcess": {"whenAllowed": string, "approvalRoles": string[], "howDocumented": string, "expiryPolicy": string}}, "operatingCadence": {"weeklyRituals": [{"ritual": string, "attendees": string[], "agenda": string[], "inputs": string[], "outputs": string[]}], "backlogGrooming": {"cadence": string, "rules": string[]}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Intake captures sufficient required fields and routing rules to prevent back-and-forth while staying in procurement ops scope",
      "Workflow stages include owners, SLAs, artifacts, and definitions of ready/done with explicit handoffs and exceptions",
      "Controls and reporting are audit-ready (systems of record, required fields, segregation of duties, metrics, and alerts)",
    ],
    opts
  );
};

export const spendApprovalMatrix = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Spend approval matrix",
      prompt:
        "Define spend approval thresholds and guardrails (budget owner, finance, security/legal triggers, delegation rules, and audit trail). " +
        "Keep this implementable as a matrix plus operational rules and system enforcement. " +
        "Do not draft contracts or negotiate terms; focus on approval governance and controls. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "currency": string, "scope": {"spendCategories": [{"category": string, "definition": string, "examples": string[]}], "contractTypes": [{"type": "subscription"|"services"|"hardware"|"marketplace"|"other", "definition": string}]}, "approvalMatrix": [{"category": string, "contractType": string, "threshold": {"amountMin": number, "amountMax": number|null, "termMonthsMin": number|null, "termMonthsMax": number|null}, "requiredApprovals": [{"role": string, "reason": string}], "requiredReviews": [{"review": "security"|"privacy"|"legal"|"finance"|"it"|"data"|"other", "trigger": string, "sla": string, "evidence": string}], "requiredArtifacts": [{"artifact": string, "systemOfRecord": string, "requiredFields": string[]}], "policyNotes": string}], "guardrails": {"budgetControls": [{"rule": string, "enforcedWhere": string, "exceptionProcess": string}], "competitiveBids": {"requiredOverAmount": number|null, "minQuotes": number, "waiverProcess": string}, "autoRenewalPolicy": {"allowed": boolean, "requirements": string[], "howTracked": string}, "poPolicy": {"whenRequired": string[], "poOwnerRole": string, "matchingRules": string[]}}, "delegationAndSubstitution": {"delegationPolicy": string, "allowedDelegates": [{"role": string, "canDelegateToRoles": string[], "constraints": string[]}], "outOfOfficeCoverage": string}, "auditTrail": {"where": string, "fields": [{"field": string, "type": string, "required": boolean}], "retentionPolicy": string}, "escalation": {"whenToEscalate": [{"condition": string, "escalateToRole": string, "within": string, "action": string}], "disputeResolution": string}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Matrix thresholds are unambiguous (amount/term bounds) and tie to specific approvals, reviews, artifacts, and SLAs",
      "Guardrails include enforceable policies (budget controls, bidding, auto-renewals, PO rules) plus documented exception paths",
      "Audit trail defines system of record, required fields, retention, and escalation rules to support compliance and learning",
    ],
    opts
  );
};

export const vendorOnboardingChecklist = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Vendor onboarding checklist",
      prompt:
        "Create an operational vendor onboarding checklist covering security review, access provisioning, invoicing setup, and renewal metadata. " +
        "Focus on execution mechanics: owners, evidence, systems of record, and time bounds. " +
        "Do not draft legal terms; assume legal handles contract content separately. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "vendorProfile": {"vendorName": string, "category": string, "serviceProvided": string, "dataAccess": {"touchesPii": boolean, "dataTypes": string[], "regions": string[], "subprocessorsExpected": boolean, "notes": string}, "businessOwnerRole": string, "procurementOwnerRole": string}, "systemsOfRecord": {"vendorMaster": string, "contractRepo": string, "ticketing": string, "idpOrIam": string, "financeSystem": string, "securityGrc": string|null, "renewalTracker": string}, "checklist": [{"phase": "pre_contract"|"security_review"|"legal_review"|"finance_setup"|"access_provisioning"|"implementation"|"go_live"|"post_go_live"|"other", "items": [{"item": string, "description": string, "ownerRole": string, "dueBy": string, "evidence": string, "systemOfRecord": string, "blocking": boolean, "dependencies": string[], "acceptanceCriteria": string[]}]}], "accessProvisioning": {"accounts": [{"accountType": "admin"|"billing"|"standard"|"service_account"|"api_key"|"other", "whoGetsAccess": string, "leastPrivilegePolicy": string, "mfaRequired": boolean, "provisioningMethod": "sso"|"scim"|"manual"|"other", "offboardingMethod": string}], "secretsHandling": {"whereStored": string, "rotationPolicy": string, "breakGlassProcedure": string}}, "invoicingAndPayment": {"paymentMethod": "invoice"|"credit_card"|"ach"|"wire"|"other", "billingContact": string, "invoiceSubmissionProcess": string, "threeWayMatchRequired": boolean, "taxHandlingNotes": string|null}, "renewalMetadata": {"contractStartDate": string|null, "contractEndDate": string|null, "autoRenewal": boolean, "noticePeriodDays": number|null, "renewalOwnerRole": string, "renewalPlaybookRef": string, "keyCommercialTerms": [{"term": string, "value": string}], "riskNotes": string[]}, "handoffToOperations": {"when": string, "handoffToRole": string, "requiredArtifacts": string[], "successCriteria": string[]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Checklist is execution-ready (phased items with owners, due dates/time bounds, evidence, system of record, and dependencies)",
      "Covers security, access, finance, and renewal metadata so vendors can be managed end-to-end after go-live",
      "Access provisioning and secrets handling are concrete (least privilege, MFA/SSO/SCIM, rotation, and offboarding methods)",
    ],
    opts
  );
};

export const vendorPerformanceScorecard = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Vendor performance scorecard",
      prompt:
        "Design a vendor performance scorecard and operating process (KPIs/SLAs, QBR cadence, issue management, and offboarding triggers). " +
        "Focus on procurement operations and vendor lifecycle management; do not negotiate contract terms or write legal clauses. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "vendor": {"name": string, "category": string, "serviceProvided": string, "businessOwnerRole": string, "procurementOwnerRole": string, "technicalOwnerRole": string|null}, "scorecard": {"dimensions": [{"dimension": "service_reliability"|"support"|"security"|"privacy"|"financial"|"adoption"|"value"|"relationship"|"other", "weightPct": number, "definition": string}], "kpis": [{"name": string, "dimension": string, "definition": string, "formula": string, "dataSource": string, "refreshCadence": "weekly"|"monthly"|"quarterly", "target": string|null, "thresholds": [{"level": "green"|"yellow"|"red", "criteria": string}], "ownerRole": string}], "slas": [{"sla": string, "definition": string, "measurement": string, "target": string, "penaltyOrRemedy": string|null, "evidence": string}], "qualitativeSignals": [{"signal": string, "howCollected": string, "cadence": string, "ownerRole": string}]}, "operatingProcess": {"qbrCadence": "monthly"|"quarterly"|"semiannual", "qbrTemplate": {"attendees": string[], "agenda": string[], "prework": string[], "outputs": string[]}, "issueManagement": {"intake": string, "severityModel": [{"severity": "sev1"|"sev2"|"sev3"|"sev4", "definition": string, "responseSla": string}], "escalationPath": [{"condition": string, "escalateToRole": string, "within": string}], "rootCauseAndPostmortem": {"required": boolean, "fields": string[], "storage": string}}, "improvementPlan": {"whenRequired": string, "template": {"goals": string[], "actions": [{"action": string, "owner": string, "due": string, "successCriteria": string}]}, "trackingWhere": string}}, "offboardingTriggers": [{"trigger": string, "signal": string, "recommendedAction": string, "ownerRole": string}], "renewalInputs": {"whatToBring": string[], "howToSummarizeValueAndRisk": string}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Scorecard defines weighted dimensions and measurable KPIs/SLAs with formulas, sources, cadences, and thresholds",
      "Operating process is runnable (QBR template, issue intake/escalation, postmortems, and improvement plan tracking)",
      "Offboarding triggers and renewal inputs translate performance signals into concrete lifecycle actions",
    ],
    opts
  );
};

export const renewalAndContractCalendarProcess = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Renewal and contract calendar process",
      prompt:
        "Set up a renewal tracking and contract calendar process (notice periods, owners, negotiation windows, and playbooks). " +
        "Focus on operational tracking, reminders, artifacts, and governance; do not draft contract language. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "systems": {"contractRepo": string, "renewalTracker": string, "ticketing": string, "calendar": string, "financeSystem": string, "securityGrc": string|null}, "contractDataModel": {"requiredFields": [{"field": string, "type": "string"|"number"|"boolean"|"date"|"enum"|"array"|"object", "definition": string}], "examples": [{"field": string, "exampleValue": string}]}, "renewalCalendar": {"reminderRules": [{"when": "180d"|"120d"|"90d"|"60d"|"30d"|"14d"|"7d"|"custom", "customDays": number|null, "whoNotified": string[], "messageTemplate": string, "createdWhere": string}], "windows": {"discovery": string, "benchmarking": string, "negotiation": string, "approvalAndSigning": string}, "ownership": {"renewalOwnerRole": string, "businessOwnerRole": string, "financePartnerRole": string, "securityOwnerRole": string|null, "legalOwnerRole": string|null}}, "process": {"weeklyRenewalsReview": {"attendees": string[], "agenda": string[], "inputs": string[], "outputs": string[]}, "renewalPlaybooks": [{"scenario": "straight_renewal"|"rightsizing"|"consolidation"|"terminate"|"switch_vendor"|"other", "whenToUse": string, "steps": [{"step": string, "ownerRole": string, "due": string, "artifact": string, "systemOfRecord": string}]}], "requiredAnalyses": [{"analysis": string, "how": string, "ownerRole": string, "due": string}], "approvalFlow": {"matrixRef": string, "howRequested": string, "auditFields": string[]}, "closeout": {"definitionOfDone": string[], "howRecorded": string, "postRenewalReview": {"required": boolean, "questions": string[], "whereStored": string}}}, "controls": {"autoRenewalControls": string[], "noticePeriodTracking": {"howEnsured": string, "failureAction": string}, "dataQualityChecks": [{"check": string, "cadence": string, "ownerRole": string, "failureAction": string}]}, "metrics": {"kpis": [{"metric": string, "definition": string, "target": string|null, "cadence": string}], "savingsTracking": {"howCalculated": string, "whereReported": string}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Process defines a concrete contract data model, reminder rules, and ownership so renewals are tracked reliably",
      "Includes runnable playbooks and a weekly cadence with required analyses, approvals, and closeout artifacts",
      "Controls and data quality checks mitigate missed notice periods and auto-renewal risk with measurable KPIs",
    ],
    opts
  );
};

