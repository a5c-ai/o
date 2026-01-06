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

export const dsarIntakeAndFulfillmentWorkflow = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "DSAR intake and fulfillment workflow",
      prompt:
        "Create a DSAR (data subject access request) intake and fulfillment workflow: intake channels, identity verification, systems search, response assembly, exceptions, SLA tracking, and audit trail fields. " +
        "Stay operational; do not provide legal advice. Output JSON only. Output JSON: " +
        '{ "asOf": string, "scope": {"regions": string[], "requestTypes": string[], "assumptions": string[]}, "intake": {"channels": string[], "requiredFields": string[], "identityVerification": {"methods": string[], "minimumRequired": string, "failureHandling": string}}, "workflow": [{"step": string, "ownerRole": string, "sla": string, "systems": string[], "inputs": string[], "outputs": string[], "definitionOfDone": string[]}], "exceptions": {"when": string[], "howHandled": string, "approvalRoles": string[]}, "communications": {"templates": [{"type": "receipt"|"needs_more_info"|"extension_notice"|"final_response"|"other", "template": string}]}, "auditTrail": {"systemOfRecord": string, "fields": string[], "attachments": string[], "retentionPolicy": string}, "metrics": [{"metric": string, "definition": string, "target": string|null, "cadence": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Workflow includes identity verification, system search, and response steps with clear SLAs and definitions of done",
      "Exceptions and communications are operational (approval roles, templates, and extension handling)",
      "Audit trail defines system-of-record fields and retention so DSAR handling is defensible and repeatable",
    ],
    opts
  );
};

export const dataRetentionAndDeletionOpsRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Data retention and deletion ops runbook",
      prompt:
        "Define a data retention and deletion operations runbook: data inventory, retention rules, deletion methods, verification, monitoring, and change control. " +
        "Keep it operational; do not write policy text. Output JSON only. Output JSON: " +
        '{ "asOf": string, "dataMap": [{"system": string, "ownerRole": string, "dataTypes": string[], "piiSensitivity": "low"|"medium"|"high", "retentionRule": string, "deletionMethod": string, "verification": string[], "systemOfRecord": string}], "operations": {"weekly": [{"check": string, "how": string, "ownerRole": string, "failureAction": string}], "monthly": [{"check": string, "how": string, "ownerRole": string, "failureAction": string}]}, "deletionRequests": {"intake": {"channels": string[], "requiredFields": string[], "systemOfRecord": string}, "workflow": [{"step": string, "ownerRole": string, "sla": string, "outputs": string[]}], "evidenceAndAuditTrail": {"fields": string[], "whereStored": string}}, "monitoring": {"tests": [{"test": string, "cadence": "daily"|"weekly"|"monthly", "ownerRole": string, "failureAction": string}], "alerts": [{"alert": string, "threshold": string, "routeToRole": string, "escalation": string[]}]}, "changeControl": {"howRequested": string, "approvers": string[], "testingChecklist": string[], "rollbackPlan": string}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Data map is explicit per system (retention rules, deletion methods, verification, owners, and systems of record)",
      "Runbook includes operational checks plus a deletion request workflow with evidence requirements",
      "Monitoring and change control make retention/deletion operations sustainable and auditable",
    ],
    opts
  );
};

export const cookieConsentOpsChecklist = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Cookie and consent ops checklist",
      prompt:
        "Create a cookie/consent operations checklist: banner configuration, categories, regional rules, audits, change control, and monitoring for drift. " +
        "Stay operational; do not provide legal advice. Output JSON only. Output JSON: " +
        '{ "asOf": string, "regions": string[], "tooling": {"consentTool": string, "tagManager": string|null, "webAnalytics": string|null}, "configuration": {"categories": [{"category": string, "definition": string, "examples": string[]}], "consentCopyWhere": string, "defaultBehavior": string, "geoRules": [{"region": string, "rule": string}]}, "checks": [{"check": string, "cadence": "weekly"|"monthly"|"quarterly", "ownerRole": string, "howToVerify": string, "failureAction": string, "systemOfRecord": string}], "inventory": {"howMaintained": string, "cookieOrTagListWhere": string, "ownerRole": string}, "changeControl": {"howRequested": string, "approvers": string[], "testingChecklist": string[], "releaseNotesWhere": string, "rollbackPlan": string}, "monitoring": {"alerts": [{"trigger": string, "severity": "low"|"medium"|"high", "routeToRole": string, "action": string}], "audits": [{"audit": string, "cadence": string, "outputs": string[]}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Checklist defines configuration scope and repeatable checks with owners, cadences, and systems of record",
      "Inventory and monitoring reduce consent drift risk by making changes and violations detectable",
      "Change control includes testing and rollback so consent changes are safer across regions",
    ],
    opts
  );
};
