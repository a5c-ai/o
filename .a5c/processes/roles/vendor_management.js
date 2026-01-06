import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";
import { sleep } from "../runners/sleep.js";

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

export const vendorOnboardingRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Vendor onboarding runbook",
      prompt:
        "Create a vendor onboarding runbook for post-purchase setup and operational readiness (access provisioning, security/privacy prerequisites, implementation kickoff, owner assignment, and system-of-record setup). " +
        "Boundary: assume procurement and contracting are already complete; focus on vendor management execution after signature. " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "vendor": {"name": string, "category": string, "serviceProvided": string, "goLiveTargetDate": string|null}, "owners": {"businessOwnerRole": string, "vendorManagerRole": string, "technicalOwnerRole": string|null, "securityOrPrivacyOwnerRole": string|null, "financeOwnerRole": string|null}, "kickoff": {"attendees": string[], "agenda": string[], "inputs": string[], "outputs": string[]}, "checklists": [{"phase": "setup"|"security_privacy"|"implementation"|"cutover"|"steady_state", "items": [{"item": string, "ownerRole": string, "systemOfRecord": string, "definitionOfDone": string, "evidence": string[]}]}], "accessAndProvisioning": {"systems": [{"system": string, "roles": [{"role": string, "whoShouldHave": string[], "approval": string[], "notes": string}], "provisioningSteps": string[], "deprovisioningPlan": string, "evidenceWhere": string}]}, "dataAndIntegrations": {"dataFlows": [{"from": string, "to": string, "mechanism": string, "frequency": string, "controls": string[], "monitoring": string[]}], "identifiersAndMatching": string[], "piiHandlingNotes": string[]}, "controls": {"requiredArtifacts": [{"artifact": string, "whereStored": string}], "auditTrailFields": string[], "exceptionProcess": {"whenAllowed": string[], "approvalRoles": string[], "howDocumented": string}}, "operatingCadence": {"first30Days": [{"ritual": string, "cadence": string, "attendees": string[], "agenda": string[], "outputs": string[]}], "steadyStateCadence": [{"ritual": string, "cadence": "monthly"|"quarterly"|"semiannual", "attendees": string[], "agenda": string[], "outputs": string[]}]}, "risksAndMitigations": [{"risk": string, "impact": string, "mitigation": string, "ownerRole": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Runbook is operational and post-contract scoped (owners, checklists, systems of record, evidence)",
      "Covers access, integrations, controls, and an operating cadence suitable for ongoing vendor management",
      "Includes risks/mitigations and an exception process to handle incomplete prerequisites safely",
    ],
    opts
  );
};

export const vendorQbrPack = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Vendor QBR pack",
      prompt:
        "Create a vendor QBR pack (agenda + scorecard + issue log + renewal readiness) for a vendor management operating cadence. " +
        "Boundary: do not negotiate contract terms; produce an operational QBR artifact and action plan. Output JSON only. Output JSON: " +
        '{ "asOf": string, "vendor": {"name": string, "category": string, "businessOwnerRole": string, "vendorManagerRole": string}, "qbr": {"cadence": "monthly"|"quarterly"|"semiannual", "attendees": string[], "agenda": string[], "prework": [{"from": "us"|"vendor", "item": string, "due": string|null}], "minutesAndDecisionsTemplate": {"fields": string[]}}, "scorecard": {"kpis": [{"kpi": string, "definition": string, "formula": string, "source": string, "target": string|null, "thresholds": [{"level": "green"|"yellow"|"red", "criteria": string}], "trend": "improving"|"flat"|"worsening"|"unknown"}], "slas": [{"sla": string, "definition": string, "target": string, "evidence": string}], "securityAndPrivacy": {"recentChanges": string[], "openRisks": string[], "controlsAttestationsWhere": string}}, "issueLog": [{"id": string, "issue": string, "severity": "low"|"medium"|"high", "owner": "us"|"vendor", "due": string|null, "status": "open"|"in_progress"|"blocked"|"closed", "nextStep": string}], "roadmapAndChangeManagement": {"vendorRoadmapAsks": string[], "ourUpcomingChangesToShare": string[], "changeControlRules": string[]}, "renewalReadiness": {"renewalDate": string|null, "noticePeriod": string|null, "valueSummary": string[], "risks": string[], "decisionOptions": [{"option": "renew"|"rightsizing"|"renegotiate"|"exit"|"dual_vendor"|"unknown", "pros": string[], "cons": string[]}], "nextActions": [{"action": string, "ownerRole": string, "due": string|null}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Pack includes a runnable agenda, prework, and templates so QBRs produce consistent artifacts and decisions",
      "Scorecard has measurable KPIs/SLAs plus security/privacy review inputs and trend context",
      "Issue log and renewal readiness convert signals into owned, time-bound actions without legal negotiation",
    ],
    opts
  );
};

export const vendorRiskReassessmentCadenceTemplate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Vendor risk reassessment cadence template",
      prompt:
        "Create a recurring vendor risk reassessment cadence template: what to reassess, evidence to collect, ownership, exceptions, and reporting. " +
        "Represent recurring work as schedule/checklist templates (no code loops or sleep calls). Output JSON only. Output JSON: " +
        '{ "asOf": string, "cadence": [{"frequency": "quarterly"|"semiannual"|"annual", "name": string, "vendorTiering": [{"tier": "critical"|"high"|"medium"|"low", "definition": string, "defaultFrequency": string}], "checklists": [{"name": string, "items": [{"item": string, "ownerRole": string, "definitionOfDone": string, "evidenceWhere": string}]}], "alerts": [{"trigger": string, "severity": "low"|"medium"|"high", "ownerRole": string, "action": string}], "outputs": [{"artifact": string, "whereStored": string}]}], "exceptionHandling": {"whenAllowed": string[], "approvalRoles": string[], "expiryPolicy": string, "howTracked": string}, "reporting": {"audiences": string[], "cadence": string, "templateSections": string[]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Cadence defines vendor tiers and concrete checklists with owners, evidence locations, and outputs",
      "Alerts and exception handling prevent silent risk drift and ensure reassessments are measurable and auditable",
      "Reporting template makes reassessment outcomes consumable by leadership and control owners",
    ],
    opts
  );
};

export const vendorRiskReassessmentForever = async ({
  intervalMs = 7 * 24 * 60 * 60 * 1000,
  runOnce,
  logger = console,
} = {}) => {
  if (typeof runOnce !== "function") {
    throw new Error("vendorRiskReassessmentForever: runOnce must be a function");
  }

  for (;;) {
    try {
      await runOnce();
    } catch (err) {
      logger?.error?.("[vendor_management] reassessment error", err);
    }

    await sleep(intervalMs);
  }
};
