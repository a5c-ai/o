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

export const oProcessSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Meta: o process spec (run + main.js)",
      prompt:
        "Design an `o`-oriented process (the code/main.js-style orchestrator run) for this repo. " +
        "Focus on how to author/maintain a reusable process: run structure, step sequencing, breakpoints, required artifacts, and event-sourcing (journal + state). " +
        "Do not generate any infinite loops or sleeping runners. Output JSON only. Output JSON: " +
        '{ "asOf": string, "process": {"name": string, "intent": string, "whereItLives": {"runDir": ".a5c/runs/<run_id>/", "codeFile": ".a5c/runs/<run_id>/code/main.js"}, "runIdConvention": {"pattern": string, "examples": string[]}, "inputsContract": {"inputsJsonShape": "any", "requiredFields": string[], "optionalFields": string[], "defaults": "any"}, "steps": [{"stepId": string, "title": string, "type": "breakpoint"|"act"|"score"|"decide"|"review"|"summarize"|"custom", "purpose": string, "promptFile": string|null, "workSummaryFile": string|null, "artifacts": [{"path": string, "contentType": string, "why": string}], "qualityCriteria": string[], "retryLogic": {"enabled": boolean, "threshold": number|null, "maxIters": number|null}, "stopConditions": string[]}], "eventSourcing": {"journal": {"file": ".a5c/runs/<run_id>/journal.jsonl", "requiredEvents": string[], "whenToAppend": string[]}, "state": {"file": ".a5c/runs/<run_id>/state.json", "fields": string[], "updateRules": string[]}, "recovery": {"howToResume": string[], "howToDetectDivergence": string[]}}, "safety": {"guardrails": string[], "noImportSideEffects": true, "avoidLongRunningLoopsInCode": true}, "validation": {"smokeChecks": string[], "importChecks": string[]}, "maintenance": {"howToEvolve": string[], "backwardsCompatibilityNotes": string[]} }, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Spec is grounded in this repo’s structure (run dirs, main.js orchestration, prompts/work_summaries, journal/state)",
      "Steps include explicit artifacts and event-sourcing rules that make the run resumable and recoverable",
      "Safety/validation guidance prevents import-time side effects and other patterns that break orchestrations",
    ],
    opts
  );
};

export const oAtomsPlaybook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Meta: o atoms playbook (what to build where)",
      prompt:
        "Create a practical playbook for building reliable 'atoms' of the `o` system in this repo. " +
        "Atoms include: role-family exports, development recipes, core loops, runners, functions (act/score/etc.), orchestrator scripts, registries, and run templates. " +
        "Explain how to choose the right atom for a change request and how to keep it reusable and safe. Output JSON only. Output JSON: " +
        '{ "asOf": string, "atoms": [{"atomType": "role_family_export"|"development_recipe"|"core_loop"|"runner"|"function_template"|"orchestrator_script"|"registry"|"run_template"|"other", "whatItIs": string, "whereItLives": string[], "whenToCreate": string[], "whenToAvoid": string[], "designRules": string[], "commonFailureModes": [{"failure": string, "whyItHappens": string, "prevention": string, "detection": string, "fix": string}], "qualityChecklist": string[] }], "decisionGuide": {"questions": string[], "routingRules": [{"if": string, "thenBuild": string, "why": string}]}, "goldenPatterns": [{"pattern": string, "examplePaths": string[], "whyItWorks": string}], "antiPatterns": [{"antiPattern": string, "whyBad": string, "preferredAlternative": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Playbook is anchored to concrete directories/files in this repo and gives actionable routing rules",
      "Design rules emphasize reuse, safety (no import-time side effects), and maintainability across runs",
      "Includes failure modes + prevention/detection so atoms are reliable in production usage",
    ],
    opts
  );
};

export const oVerbSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Meta: o verb spec (reusable primitive)",
      prompt:
        "Design a reusable `o`-oriented verb/primitive for this repo (a composable building block used by roles/processes). " +
        "Keep it practical and production-oriented: clear API, scope boundaries, failure behavior, observability, and the exact integration points (what files to edit and how it will be invoked). " +
        "Output JSON only. Output JSON: " +
        '{ "asOf": string, "verb": {"name": string, "jobToBeDone": string, "scopeBoundaries": {"inScope": string[], "outOfScope": string[]}, "api": {"fnName": string, "args": [{"name": string, "type": string, "required": boolean, "description": string}], "returns": {"type": string, "description": string}}, "behavior": {"idempotency": {"needed": boolean, "key": string|null, "notes": string[]}, "errorModel": {"retryable": string[], "nonRetryable": string[], "whatToLog": string[], "whatToSurface": string[]}, "performance": {"expectedUsage": string, "timeBounds": string|null}}, "integration": {"primaryFiles": [{"path": string, "change": string}], "callSites": [{"path": string, "why": string}], "registryOrExports": string[]}, "quality": {"acceptanceTests": string[], "importSmokeChecks": string[], "guardrails": string[]}, "examples": [{"name": string, "input": "any", "output": "any"}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Verb spec includes concrete integration points and call sites, not just abstract API design",
      "Behavior is explicit (idempotency, error model, logging/surfacing) so it is safe under automation",
      "Quality section includes acceptance tests and import smoke checks appropriate for this repo",
    ],
    opts
  );
};

export const oChangeRequestRouter = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Meta: o change request router",
      prompt:
        "You are the `meta` role for the `o` system (this repo). Classify and route a request for change to the right kind of work. " +
        "The output must be practical: categorize the change (bugfix/enhancement/new feature/new process/new role/new responsibility/refactor/docs/tooling), identify impacted atoms (processes/verbs/roles/core loops/functions/orchestrator scripts), propose an execution path, and list concrete next actions. " +
        "Output JSON only. Output JSON: " +
        '{ "asOf": string, "request": {"summary": string, "raw": string}, "classification": {"changeType": "bugfix"|"enhancement"|"new_feature"|"new_process"|"new_role"|"change_responsibility"|"refactor"|"docs"|"tooling"|"other", "riskLevel": "low"|"medium"|"high", "urgency": "low"|"medium"|"high", "reversibility": "easy"|"moderate"|"hard"}, "atomsImpacted": {"roles": string[], "processes": string[], "verbsOrPrimitives": string[], "coreLoops": string[], "functions": string[], "orchestratorScripts": string[], "registries": string[]}, "recommendedApproach": {"mode": "new_run"|"resume_run"|"direct_patch", "why": string, "suggestedRunIdPattern": string, "breakpointsNeeded": string[], "qualityGates": [{"gate": string, "threshold": number, "maxIters": number, "whatToScore": string[]}], "safetyGuardrails": string[]}, "discovery": {"questionsToAsk": string[], "filesToInspect": string[], "signalsToLookFor": string[]}, "implementationOutline": {"steps": [{"step": string, "filesLikelyTouched": string[], "artifacts": string[], "acceptanceCriteria": string[]}], "validation": {"commands": string[], "importChecks": string[], "smokeChecks": string[]}, "rollbackPlan": {"strategy": string, "whatToRevert": string[]}}, "doneDefinition": string[], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Classification is decisive and maps to a concrete execution approach (new run vs resume vs direct patch)",
      "Atoms impacted list is specific enough to guide where changes will land (roles/processes/verbs/registries)",
      "Implementation outline includes file targets, artifacts, acceptance criteria, validation, and rollback considerations",
    ],
    opts
  );
};

export const oChangeImplementationPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Meta: o change implementation plan (structured)",
      prompt:
        "Turn this request into a structured, actionable implementation plan for the `o` system. " +
        "This is not a low-level code spec; it is a stepwise plan that an agent/orchestrator can execute with event-sourcing discipline (journal/state, prompts/work_summaries), with explicit checkpoints and acceptance criteria. " +
        "Output JSON only. Output JSON: " +
        '{ "asOf": string, "plan": {"goal": string, "scope": {"inScope": string[], "outOfScope": string[]}, "workstreams": [{"name": string, "objective": string, "ownerRole": string, "risks": string[]}], "steps": [{"stepId": string, "title": string, "type": "inspect"|"design"|"implement"|"wire_registry"|"validate"|"document"|"release", "actions": string[], "filesToTouch": string[], "artifactsToWrite": string[], "breakpointBefore": boolean, "acceptanceCriteria": string[], "rollbackIfFails": string[]}], "quality": {"gates": [{"when": string, "threshold": number, "maxIters": number, "criteria": string[]}], "definitionOfDone": string[]}, "eventSourcing": {"journalUpdates": [{"when": string, "eventTypes": string[], "minimumFields": string[]}], "stateUpdates": [{"when": string, "fields": string[], "rules": string[]}]}, "validation": {"commands": string[], "importChecks": string[], "negativeTests": string[]}, "comms": {"notesToAdd": string[], "changelogEntry": string}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Plan is executable: step actions, file targets, artifacts, breakpoints, and acceptance criteria are explicit",
      "Includes event-sourcing rules (journal/state updates) so work is resumable and reviewable",
      "Validation includes concrete commands and import checks appropriate for this repo",
    ],
    opts
  );
};

export const oNewRoleOrProcessScaffold = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Meta: scaffold a new o role or process",
      prompt:
        "Scaffold a new `o` component: either (A) a new role family under `.a5c/processes/roles/` or (B) a new run/process template under `.a5c/runs/<run_id>/code/main.js`. " +
        "Return concrete file paths, registry wiring, exported function names, and a high-leverage initial set of outputs/prompts. " +
        "Output JSON only. Output JSON: " +
        '{ "asOf": string, "scaffold": {"kind": "role_family"|"run_process", "name": string, "keyOrSlug": string, "rationale": string, "filesToCreate": [{"path": string, "purpose": string}], "filesToEdit": [{"path": string, "change": string}], "exports": [{"exportName": string, "purpose": string, "outputType": "json"|"markdown"|"text", "promptSchema": "any"}], "registryWiring": {"rolesIndexEdits": [{"lineIntent": string, "content": string}], "roleRegistryKey": string|null}, "boundaries": {"overlapsWith": [{"family": string, "boundaryRule": string}], "antiGoals": string[]}, "starterArtifacts": [{"artifact": string, "where": string, "template": string}], "acceptanceCriteria": string[], "validationCommands": string[] }, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Scaffold specifies concrete file paths, exports, and registry wiring so implementation is straightforward",
      "Boundaries and anti-goals prevent overlap and keep responsibilities crisp",
      "Acceptance and validation steps are explicit (import checks, smoke commands)",
    ],
    opts
  );
};

export const oLibraryGovernanceAndQualitySystem = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Meta: o library governance + quality system",
      prompt:
        "Design governance for the `o` library that makes changes reliable: how to handle bugfix/enhancement/new feature/new role/new process/new responsibility requests end-to-end. " +
        "Include: intake, routing, review gates, regression strategy, documentation, deprecation, and release notes expectations. " +
        "Output JSON only. Output JSON: " +
        '{ "asOf": string, "system": {"intake": {"channels": string[], "requestTemplate": {"fields": string[]}, "triageSla": string}, "routing": {"rules": [{"when": string, "routeTo": "meta"|"development"|"security"|"ops"|"other", "why": string}], "changeTypes": [{"type": string, "defaultWorkflow": string, "requiredApprovals": string[]}]}, "reviewGates": [{"gate": string, "when": string, "checks": string[], "whoSignsOff": string[]}], "regressionStrategy": {"importSmokeTests": {"commands": string[], "scope": string}, "schemaQualityChecks": string[], "goldenExamples": {"whereStored": string, "howUpdated": string}}, "documentation": {"requiredDocs": string[], "where": string[], "updateRules": string[]}, "deprecation": {"policy": string, "howCommunicated": string, "sunsetChecklist": string[]}, "releaseNotes": {"where": string, "template": {"sections": string[]}, "cadence": string}, "metrics": [{"metric": string, "definition": string, "target": string|null, "cadence": string}]}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Governance covers the whole lifecycle: intake→routing→implementation→validation→docs→release→deprecation",
      "Review gates and regression checks are concrete and aligned with this repo’s importable module structure",
      "Provides default workflows for common change types (bugfix/enhancement/new role/new process/etc.)",
    ],
    opts
  );
};
