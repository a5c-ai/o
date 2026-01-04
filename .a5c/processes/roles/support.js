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

export const ticketTriage = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Ticket triage",
      prompt:
        "Triage the support ticket. Output JSON: " +
        "{\"summary\": string, \"category\": string, \"severity\": \"low\"|\"med\"|\"high\", " +
        "\"customerImpact\": string, \"nextQuestions\": string[], \"nextActions\": string[], " +
        "\"escalateTo\": string, \"slaNotes\": string}",
      input,
    },
    ctx,
    [
      "Captures customer impact and urgency clearly",
      "Next questions are minimal and high-signal",
      "Next actions and escalation path are explicit",
    ],
    opts
  );
};

export const customerUpdate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Customer update",
      prompt:
        "Draft a customer-facing update. Include: what we know, what we're doing, " +
        "workarounds (if any), next update time, and how to share additional details. " +
        "Keep it empathetic and precise; avoid overpromising.",
      input,
    },
    ctx,
    [
      "Sets expectations without overpromising",
      "Provides clear next update time and requested info",
      "Tone is empathetic and professional",
    ],
    opts
  );
};

export const escalationTriage = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Escalation triage",
      prompt:
        "Triage the escalation and create an internal escalation brief. Include: " +
        "customer context, impact, timeline, current hypothesis, needed help, and owner roles.",
      input,
    },
    ctx,
    [
      "Summarizes customer context and impact succinctly",
      "States current hypothesis and missing information",
      "Requests specific help with ownership",
    ],
    opts
  );
};

export const reproduceIssue = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Reproduce issue",
      prompt:
        "Produce a reproduction and evidence package for engineering. Include: " +
        "environment, steps, expected vs actual, logs/telemetry to collect, and screenshots/links placeholders.",
      input,
    },
    ctx,
    [
      "Repro steps are deterministic and minimal",
      "Includes expected vs actual and environment details",
      "Lists evidence to collect for debugging",
    ],
    opts
  );
};

export const knowledgeBaseUpdate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Knowledge base update",
      prompt:
        "Write a knowledge base article/update. Include: symptoms, causes, " +
        "workarounds, resolution, and when to escalate. Keep it copy-pastable.",
      input,
    },
    ctx,
    [
      "Explains symptoms and workaround clearly",
      "Includes escalation guidance and resolution steps",
      "Structured for fast scanning and reuse",
    ],
    opts
  );
};

export const bugReport = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Bug report",
      prompt:
        "Write an engineering-ready bug report. Output JSON: " +
        "{\"title\": string, \"summary\": string, \"impact\": string, \"repro\": string[], " +
        "\"expected\": string, \"actual\": string, \"env\": object, \"evidence\": string[], \"priority\": \"P0\"|\"P1\"|\"P2\"}",
      input,
    },
    ctx,
    [
      "Includes clear repro, expected, and actual behavior",
      "Impact and priority are justified",
      "Evidence and environment details are sufficient",
    ],
    opts
  );
};

export const incidentCommsDraft = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Incident comms draft",
      prompt:
        "Draft an incident communication update for customers. Output JSON: " +
        "{\"status\": string, \"impact\": string, \"whatWeKnow\": string, \"whatWeAreDoing\": string, " +
        "\"workarounds\": string[], \"nextUpdateTime\": string, \"supportNotes\": string[]}",
      input,
    },
    ctx,
    [
      "Sets expectations clearly without speculation or overpromising",
      "Includes a concrete next update time and actionable workarounds",
      "Internal support notes are practical for frontline teams",
    ],
    opts
  );
};

export const escalationRunbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Escalation runbook",
      prompt:
        "Create an escalation runbook for support -> engineering. Include: " +
        "when to escalate, required evidence, severity rules, comms expectations, " +
        "handoff template, and follow-up expectations.",
      input,
    },
    ctx,
    [
      "Escalation triggers are clear and minimize noise",
      "Evidence requirements are minimal but high-signal",
      "Handoff is structured and leads to fast diagnosis",
    ],
    opts
  );
};
