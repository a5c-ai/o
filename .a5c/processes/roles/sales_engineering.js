import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";

const DEMO_SCRIPT_JSON_CONTRACT =
  "Output JSON only (no markdown, no code fences). Use double quotes and no trailing commas. " +
  "Required top-level keys: asOf, demo. Required demo keys: goal, audience, durationMinutes, assumptions, unknowns, " +
  "prerequisites, environment, script, objectionsAndAnswers, successChecklist, followUps. " +
  "Determinism requirements: use a stable ordering for arrays and object keys; keep script sorted by minute ascending; " +
  "do not include random IDs/timestamps; if a field is unknown use null or an explicit string in unknowns. " +
  "Use ISO-8601 dates for asOf and due/date fields when provided (YYYY-MM-DD).";

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

export const solutionDesign = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Solution design (pre-sales)",
      prompt:
        "Draft a pre-sales solution design that is implementable. Focus on requirements, integration approach, architecture, risks, and a validation plan. " +
        "Do not write pricing, legal terms, or a generic product overview. Output JSON only. Output JSON: " +
        '{ "asOf": string, "customerContext": {"industry": string|null, "size": string|null, "currentStack": string[], "constraints": string[]}, "useCase": {"problem": string, "whyNow": string, "successCriteria": string[]}, "requirements": {"functional": string[], "nonFunctional": string[], "outOfScope": string[]}, "solution": {"highLevelApproach": string, "components": [{"name": string, "responsibility": string, "ownedBy": "us"|"customer"|"partner"}], "integrations": [{"system": string, "direction": "inbound"|"outbound"|"bi", "contract": string, "auth": string, "data": string[], "notes": string}], "dataFlow": [{"from": string, "to": string, "payload": string, "frequency": string, "pii": boolean}], "deployment": {"model": "saas"|"self_hosted"|"hybrid"|"unknown", "regions": string[], "networking": string[], "environments": string[]}}, "securityAndCompliance": {"dataTypes": string[], "controls": string[], "openQuestions": string[]}, "risks": [{"risk": string, "likelihood": "low"|"medium"|"high", "impact": "low"|"medium"|"high", "mitigation": string, "ownerRole": string}], "validationPlan": {"proofPoints": string[], "pocPlan": [{"step": string, "ownerRole": string, "definitionOfDone": string}], "demoScript": [{"scene": string, "goal": string, "inputs": string[], "outputs": string[]}], "timeline": [{"milestone": string, "date": string|null, "ownerRole": string}]}, "assumptions": string[], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Requirements are explicit and scoped; out-of-scope is called out",
      "Integrations and data flow include concrete contracts and security considerations",
      "Validation plan is runnable (steps, definitions of done, owners, and proof points)",
    ],
    opts
  );
};

export const rfpResponse = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "RFP response (technical)",
      prompt:
        "Produce a technical RFP response that is structured, accurate, and procurement-friendly. " +
        "Use explicit unknowns instead of guessing. Output JSON only. Output JSON: " +
        '{ "asOf": string, "rfp": {"customer": string|null, "dueDate": string|null, "scopeSummary": string}, "assumptions": string[], "answers": [{"section": string, "questionId": string|null, "question": string, "answer": string, "confidence": "high"|"medium"|"low", "evidence": string[], "requiresFollowUp": boolean, "followUpOwnerRole": string|null}], "exceptions": [{"item": string, "why": string, "proposedAlternative": string|null}], "dependencies": [{"dependency": string, "owner": "us"|"customer"|"partner", "why": string}], "nextSteps": [{"action": string, "ownerRole": string, "due": string|null}] }',
      input,
    },
    ctx,
    [
      "Answers are complete, unambiguous, and avoid over-claiming",
      "Low-confidence areas are flagged with follow-ups and owners",
      "Exceptions and dependencies are explicit and procurement-friendly",
    ],
    opts
  );
};

export const securityQuestionnaireResponse = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Security questionnaire response",
      prompt:
        "Respond to a security questionnaire using precise, auditable language. " +
        "If something is unknown, say so and propose the follow-up needed. Output JSON only. Output JSON: " +
        '{ "asOf": string, "questionnaire": {"name": string|null, "version": string|null}, "answers": [{"controlArea": string, "questionId": string|null, "question": string, "answer": string, "evidence": [{"type": "doc"|"policy"|"config"|"attestation"|"other", "reference": string, "notes": string}], "riskNotes": string|null, "requiresFollowUp": boolean, "followUp": {"ownerRole": string, "whatNeeded": string, "eta": string|null} | null}], "gaps": [{"gap": string, "risk": string, "mitigation": string, "ownerRole": string, "targetDate": string|null}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Responses use conservative, verifiable language with evidence references",
      "Follow-ups are owned and specific when information is missing",
      "Gaps include risk, mitigation, and an owner with a target date",
    ],
    opts
  );
};

export const demoScript = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Demo script (pre-sales)",
      prompt:
        "Create a runnable pre-sales demo script that a solutions engineer can execute. " +
        "Be concrete about setup, sample data, permissions, and failure handling. " +
        "Do not invent product features; explicitly mark unknowns and assumptions. " +
        DEMO_SCRIPT_JSON_CONTRACT +
        " Output JSON: " +
        '{ "asOf": string, "demo": {"goal": string, "audience": {"personas": string[], "technicalDepth": "low"|"medium"|"high"}, "durationMinutes": number, "assumptions": string[], "unknowns": string[], "prerequisites": [{"item": string, "ownerRole": string, "whenNeeded": string}], "environment": {"type": "shared_sandbox"|"dedicated"|"customer_env"|"local"|"unknown", "setupSteps": [{"step": string, "command": string|null, "expectedResult": string, "fallback": string|null}], "accountsAndAccess": [{"accountType": string, "permissions": string[], "howProvisioned": string, "notes": string|null}], "sampleData": [{"dataset": string, "howGenerated": string, "whereLoaded": string, "resetPlan": string}], "backupPlan": {"ifDemoEnvDown": string, "ifIntegrationUnavailable": string}}, "script": [{"minute": number, "scene": string, "objective": string, "whatToShow": string[], "narration": string, "inputs": string[], "expectedOutputs": string[], "buyerQuestionsToAsk": string[], "proofPoints": string[], "commonFailureModes": [{"symptom": string, "likelyCause": string, "fix": string, "fallback": string}]}], "objectionsAndAnswers": [{"objection": string, "likelyFromRole": string, "answer": string, "evidenceNeeded": string[], "ownerRoleForFollowUp": string}], "successChecklist": [{"check": string, "howVerified": string}], "followUps": [{"action": string, "ownerRole": string, "due": string|null, "definitionOfDone": string}] } }',
      input,
    },
    ctx,
    [
      "Script is timeboxed and executable (setup, inputs, expected outputs, and a success checklist)",
      "Environment setup includes permissions, sample data, and fallback plans for common failure modes",
      "Unknowns and assumptions are explicit; the script avoids unverifiable feature claims",
    ],
    opts
  );
};
