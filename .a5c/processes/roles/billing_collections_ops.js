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

export const invoiceGenerationAndDeliveryWorkflow = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Invoice generation and delivery workflow",
      prompt:
        "Define an invoice generation and delivery workflow: inputs, approvals, invoice creation, delivery, posting, and audit trail. " +
        "Keep it operational and implementable across systems; do not provide accounting advice. Output JSON only. Output JSON: " +
        '{ "asOf": string, "systems": {"billing": string, "accounting": string, "crm": string|null, "paymentProcessor": string|null}, "workflow": [{"step": string, "ownerRole": string, "sla": string, "inputs": string[], "outputs": string[], "systemOfRecord": string, "qaChecks": string[]}], "controls": {"auditTrailFields": string[], "segregationOfDutiesNotes": string[], "retentionPolicy": string}, "exceptions": [{"exception": string, "triageSteps": string[], "ownerRole": string, "escalation": {"toRole": string, "within": string}}], "reporting": {"kpis": [{"kpi": string, "definition": string, "target": string|null}], "cadence": string, "audiences": string[]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Workflow specifies owners, SLAs, systems of record, and QA checks so invoices are generated consistently",
      "Controls include audit trail fields and segregation-of-duties notes suitable for financial operations",
      "Exceptions and reporting turn failures into trackable work with escalation and measurable KPIs",
    ],
    opts
  );
};

export const dunningAndCollectionsRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Dunning and collections runbook",
      prompt:
        "Create a dunning and collections runbook: stages, timing, channels, templates placeholders, stop rules, escalation, and reporting. " +
        "Keep it operational and compliant; do not provide legal advice. Output JSON only. Output JSON: " +
        '{ "asOf": string, "policy": {"gracePeriodDays": number, "stopRules": string[], "whenToInvolveLegal": string[], "customerExperienceGuardrails": string[]}, "stages": [{"stage": string, "dayOffset": number, "actions": [{"channel": "email"|"phone"|"in_app"|"letter"|"other", "templatePlaceholder": string, "ownerRole": string, "notes": string}], "requiredChecks": string[], "stopRules": string[]}], "escalations": [{"trigger": string, "toRole": string, "action": string, "within": string}], "exceptions": [{"exception": string, "howHandled": string, "approvalRoles": string[]}], "systemsOfRecord": {"billing": string, "crm": string|null, "ticketing": string|null}, "reporting": {"kpis": [{"kpi": string, "definition": string, "target": string|null}], "cadence": string, "audiences": string[]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Stages are explicit with timing, actions, and stop rules so the process is repeatable and humane",
      "Escalations and exceptions include clear roles, approvals, and time bounds to avoid stuck accounts",
      "Reporting defines KPIs and cadence to track DSO and collections effectiveness over time",
    ],
    opts
  );
};

export const billingDisputeAndCreditsWorkflow = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Billing disputes and credits workflow",
      prompt:
        "Define a workflow for billing disputes and credits: intake, investigation, decision, approvals, posting, and customer communication. " +
        "Make it operational and auditable; do not provide legal or accounting advice. Output JSON only. Output JSON: " +
        '{ "asOf": string, "intake": {"channels": string[], "requiredFields": string[], "systemOfRecord": string}, "workflow": [{"step": string, "ownerRole": string, "sla": string, "inputs": string[], "outputs": string[], "systemOfRecord": string}], "approvalMatrix": [{"type": "credit"|"refund"|"writeoff"|"pricing_adjustment"|"other", "threshold": string, "approverRoles": string[]}], "controls": {"auditTrailFields": string[], "fraudOrAbuseChecks": string[], "retentionPolicy": string}, "customerComms": {"templates": [{"type": "ack"|"needs_more_info"|"decision"|"resolution"|"other", "templatePlaceholder": string}], "toneGuardrails": string[]}, "reporting": {"kpis": [{"kpi": string, "definition": string, "target": string|null}], "cadence": string}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Workflow is end-to-end and auditable (intake fields, owners, SLAs, approvals, posting, and systems of record)",
      "Approval matrix and controls make credits consistent and reduce leakage and abuse",
      "Comms and reporting provide a repeatable customer experience and feedback loops for prevention",
    ],
    opts
  );
};

export const collectionsQueueWorkerForever = async ({
  pollBatch,
  handleOne,
  emptySleepMs = 10 * 60 * 1000,
  perItemSleepMs = 0,
  logger = console,
} = {}) => {
  if (typeof pollBatch !== "function") {
    throw new Error("collectionsQueueWorkerForever: pollBatch must be a function");
  }
  if (typeof handleOne !== "function") {
    throw new Error("collectionsQueueWorkerForever: handleOne must be a function");
  }

  for (;;) {
    let items = [];
    try {
      items = (await pollBatch()) ?? [];
    } catch (err) {
      logger?.error?.("[billing_collections_ops] poll error", err);
      items = [];
    }

    if (!Array.isArray(items) || items.length === 0) {
      logger?.info?.(`[billing_collections_ops] queue empty; sleeping ${emptySleepMs}ms`);
      await sleep(emptySleepMs);
      continue;
    }

    for (const item of items) {
      try {
        await handleOne(item);
      } catch (err) {
        logger?.error?.("[billing_collections_ops] handle error", err);
      }

      if (perItemSleepMs > 0) {
        await sleep(perItemSleepMs);
      }
    }
  }
};
