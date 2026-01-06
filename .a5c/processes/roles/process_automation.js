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

export const linearProcessBlueprint = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Linear process blueprint",
      prompt:
        "Create a structured, linear process blueprint that an ops team can execute. Include phases, steps, decision gates, SLAs, handoffs, systems of record, artifacts/templates, controls/QA, escalation, and metrics. Output JSON only. Output JSON: " +
        '{ "asOf": string, "process": {"name": string, "purpose": string, "scope": {"inScope": string[], "outOfScope": string[]}, "systemsOfRecord": [{"area": string, "system": string, "whatStored": string[], "ownerRole": string}]}, "raci": [{"activity": string, "responsible": string[], "accountable": string[], "consulted": string[], "informed": string[]}], "phases": [{"phase": string, "objective": string, "entryCriteria": string[], "exitCriteria": string[], "steps": [{"stepId": string, "step": string, "ownerRole": string, "inputs": string[], "outputs": string[], "systemOfRecord": string, "sla": string, "definitionOfDone": string[], "controls": string[], "escalation": {"when": string, "toRoles": string[], "within": string, "messageTemplate": string}}], "decisionGates": [{"gate": string, "question": string, "options": [{"option": string, "criteria": string[]}], "ownerRole": string, "artifact": string}]}], "artifacts": [{"artifact": string, "template": string, "whereStored": string}], "metrics": [{"metric": string, "definition": string, "target": string|null, "cadence": string, "ownerRole": string}], "operatingCadence": {"reviews": [{"cadence": "weekly"|"monthly"|"quarterly", "attendees": string[], "agenda": string[], "inputs": string[], "outputs": string[]}], "continuousImprovement": {"howBugsAreFiled": string, "howChangesAreApproved": string, "howVersioned": string}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Blueprint is runnable: steps have owners, inputs/outputs, systems of record, SLAs, definitions of done, and escalation paths",
      "Decision gates are explicit (questions + options + criteria) and tied to artifacts/templates",
      "Includes controls/QA and metrics with cadences so the process can be monitored and improved over time",
    ],
    opts
  );
};

export const recurringPeriodicRunnerTemplate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Recurring periodic runner template (infinite loop + sleep)",
      prompt:
        "Generate an executable Node.js ESM runner template for a recurring periodic process that runs forever. It must include an explicit infinite loop and an in-loop sleep interval. " +
        "The loop must never run at import-time; it should be inside an exported async function and/or a CLI main guarded by `if (import.meta.url === ...)`. " +
        "Output JSON only. Output JSON: " +
        '{ "asOf": string, "runner": {"language": "javascript", "runtime": "node", "intervalMs": number, "entrypointFileName": string, "dependencies": [{"name": string, "purpose": string}], "envVars": [{"name": string, "required": boolean, "description": string}], "code": string, "howToRun": {"command": string, "notes": string[]}, "observability": {"logs": string[], "metrics": string[], "alerts": string[]}, "failurePolicy": {"onError": "log_and_continue"|"retry_with_backoff"|"halt", "notes": string[]} }, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Runner contains an explicit infinite loop and in-loop sleep, but nothing runs at import time",
      "Includes env vars, failure policy, and observability hooks so it can run unattended",
      "How-to-run is explicit and consistent with the code (file name, command, and notes)",
    ],
    opts
  );
};

export const queuePollingWorkerRunnerTemplate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Queue polling worker runner template (drain until empty, then sleep 10m)",
      prompt:
        "Generate an executable Node.js ESM runner template for a queue-polling worker that runs forever. It must: (1) poll an external system for a batch of tasks, (2) handle tasks one-by-one until the batch is empty, then (3) sleep for 10 minutes before polling again. " +
        "Include an explicit infinite loop and in-loop sleep. Ensure nothing runs at import-time. Output JSON only. Output JSON: " +
        '{ "asOf": string, "runner": {"language": "javascript", "runtime": "node", "emptySleepMs": 600000, "perItemSleepMs": number, "entrypointFileName": string, "queueContract": {"taskShape": {"id": string, "type": string, "payload": "any"}, "ackMechanism": string, "retryPolicy": string, "poisonHandling": string}, "dependencies": [{"name": string, "purpose": string}], "envVars": [{"name": string, "required": boolean, "description": string}], "code": string, "howToRun": {"command": string, "notes": string[]}, "linearHandlerProcess": {"steps": [{"step": string, "ownerRole": string, "inputs": string[], "outputs": string[], "definitionOfDone": string[]}], "decisionGates": [{"gate": string, "question": string, "options": string[]}], "artifacts": string[]}, "observability": {"logs": string[], "metrics": string[], "alerts": string[]}, "openQuestions": string[] } }',
      input,
    },
    ctx,
    [
      "Runner explicitly drains a batch until empty, then sleeps 10 minutes before polling again (infinite loop)",
      "Includes a structured linear handler process (steps + decision gates) for per-task execution quality",
      "Includes queue contract, retry/poison handling, and observability so it can operate reliably at scale",
    ],
    opts
  );
};

