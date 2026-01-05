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

export const crmDataModelSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "CRM data model spec",
      prompt:
        "Define/clean up CRM objects, fields, definitions, and validation rules for reporting + process reliability. Output JSON: " +
        '{ "crm": string, "objects": [{"name": string, "purpose": string, "fields": [{"name": string, "type": string, "definition": string, "required": boolean, "validation": string[], "sourceOfTruth": string}], "relationships": string[]}], "stageDefinitions": [{"stage": string, "exitCriteria": string[], "requiredFields": string[]}], "permissions": [{"role": string, "canEdit": string[], "canView": string[], "notes": string}], "dataGovernance": {"owners": string[], "changeProcess": string[], "auditChecks": string[]} }',
      input,
    },
    ctx,
    [
      "Objects and fields have crisp definitions, required flags, and validation rules that reduce ambiguity",
      "Stage exit criteria and required fields are explicit enough to enforce hygiene and reporting accuracy",
      "Includes practical governance (owners, change process, and audit checks) to keep data clean over time",
    ],
    opts
  );
};

export const leadRoutingAndSla = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Lead routing and SLA design",
      prompt:
        "Create lead routing rules + SLAs across marketing/sales/SDR, including monitoring and exception handling. Output JSON: " +
        '{ "segments": [{"name": string, "definition": string}], "routingRules": [{"segment": string, "rule": string, "ownerRole": string}], "slas": [{"handoff": string, "responseTime": string, "definitionOfMet": string, "exceptions": string[]}], "handoffArtifacts": [{"artifact": string, "requiredFields": string[]}], "monitoring": {"metrics": string[], "alerts": string[], "dashboards": string[]}, "failureModes": [{"failure": string, "mitigation": string}] }',
      input,
    },
    ctx,
    [
      "Routing rules map cleanly from segments to owners, with explicit exceptions and edge cases",
      "SLAs define response-time targets and how compliance is measured, plus escalation exceptions",
      "Monitoring includes actionable metrics/alerts and realistic failure modes with mitigations",
    ],
    opts
  );
};

export const forecastProcess = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Forecast process",
      prompt:
        "Design an operational forecasting process (cadence, inputs, hygiene checks, definitions, meeting agenda). Output JSON: " +
        '{ "cadence": string, "definitions": {"pipeline": string, "commit": string, "bestCase": string, "closed": string}, "inputs": [{"source": string, "fields": string[], "ownerRole": string}], "hygieneChecks": string[], "rollup": {"by": string[], "rules": string[]}, "meeting": {"attendees": string[], "agenda": string[], "prework": string[], "outputs": string[]}, "commonFailureModes": [{"mode": string, "prevention": string}] }',
      input,
    },
    ctx,
    [
      "Definitions (commit/best case/etc.) are unambiguous and align with how the org should operate",
      "Inputs and hygiene checks are specific enough to run weekly without extra interpretation",
      "Includes a workable meeting cadence/agenda with outputs and failure-mode prevention",
    ],
    opts
  );
};

export const dealDeskProcess = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Deal desk process",
      prompt:
        "Create a deal desk workflow for pricing/terms exceptions with approvals and guardrails. Output JSON: " +
        '{ "intake": {"requiredInfo": string[], "template": string}, "approvalMatrix": [{"exceptionType": string, "threshold": string, "approverRoles": string[]}], "guardrails": string[], "sla": string, "tools": string[], "playbook": {"commonRequests": [{"request": string, "defaultPosition": string, "fallback": string}]}, "auditTrail": {"where": string, "fields": string[]} }',
      input,
    },
    ctx,
    [
      "Intake captures the minimum viable info needed to make pricing/terms decisions quickly",
      "Approval matrix and guardrails are explicit and reduce ad-hoc exceptions",
      "Audit trail is concrete (where stored and what fields) to support governance and learning",
    ],
    opts
  );
};

export const quoteToCashChecklist = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Quote-to-cash checklist",
      prompt:
        "Map quote-to-cash steps (CPQ, contracting, billing, revenue recognition touchpoints) with controls and owners. Output JSON: " +
        '{ "systems": string[], "steps": [{"step": string, "ownerRole": string, "inputs": string[], "outputs": string[], "controls": string[], "evidence": string[], "sla": string}], "handoffs": [{"from": string, "to": string, "artifact": string, "acceptanceCriteria": string[]}], "billingAndCollections": {"policies": string[], "exceptions": string[]}, "reconciliation": {"checks": string[], "cadence": string}, "risks": [{"risk": string, "mitigation": string}] }',
      input,
    },
    ctx,
    [
      "Steps cover end-to-end systems and include owners, inputs/outputs, and SLAs per step",
      "Controls and evidence are realistic (what to check and what artifacts prove it happened)",
      "Handoffs and reconciliation checks reduce revenue leakage and billing disputes",
    ],
    opts
  );
};

export const revReportingSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Revenue reporting spec",
      prompt:
        "Define revenue metrics, formulas, sources, reconciliation, and governance for executive reporting. Output JSON: " +
        '{ "metrics": [{"name": string, "definition": string, "formula": string, "source": string, "ownerRole": string, "cadence": string}], "dimensions": string[], "dashboards": [{"audience": string, "questions": string[], "tiles": string[]}], "reconciliation": [{"check": string, "how": string, "ownerRole": string, "frequency": string}], "dataQuality": {"tests": string[], "alerts": string[]}, "governance": {"changeControl": string[], "metricCatalog": string} }',
      input,
    },
    ctx,
    [
      "Metrics include formulas, sources, owners, and cadence so reporting is reproducible",
      "Dashboards answer specific exec questions and define dimensions and tiles clearly",
      "Reconciliation, data quality, and governance are concrete enough to operationalize",
    ],
    opts
  );
};

