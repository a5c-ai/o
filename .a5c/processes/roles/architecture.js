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

export const adrDraft = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "ADR draft",
      prompt:
        "Draft an architecture decision record (ADR). Output JSON: " +
        "{\"title\": string, \"status\": \"proposed\"|\"accepted\"|\"rejected\"|\"superseded\", " +
        "\"context\": string, \"decision\": string, " +
        "\"options\": {\"name\": string, \"summary\": string, \"pros\": string[], \"cons\": string[], \"risks\": string[]}[], " +
        "\"consequences\": {\"positive\": string[], \"negative\": string[], \"followUps\": string[]}, " +
        "\"openQuestions\": string[]}",
      input,
    },
    ctx,
    [
      "Decision is clear and justified by context",
      "Alternatives include real tradeoffs and risks",
      "Consequences and follow-ups are actionable",
    ],
    opts
  );
};

export const apiContractSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "API contract spec",
      prompt:
        "Write a stable API contract specification. Output JSON: " +
        "{\"overview\": string, \"versioning\": string, \"auth\": string, " +
        "\"resources\": {\"name\": string, \"endpoints\": {\"method\": string, \"path\": string, " +
        "\"summary\": string, \"request\": object|null, \"response\": object|null, " +
        "\"errors\": {\"code\": string, \"meaning\": string, \"retryable\": boolean}[], " +
        "\"idempotency\": string|null, \"pagination\": string|null}[]}[], " +
        "\"events\": {\"name\": string, \"schema\": object, \"delivery\": string, \"ordering\": string, \"dedupe\": string}[], " +
        "\"invariants\": string[], \"compatibility\": string[], \"openQuestions\": string[]}",
      input,
    },
    ctx,
    [
      "Spec is precise and unambiguous for implementers",
      "Errors, idempotency, and compatibility are explicit",
      "Open questions capture remaining decisions cleanly",
    ],
    opts
  );
};

export const architectureReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Architecture review",
      prompt:
        "Review the proposed architecture/design and provide targeted feedback. Output JSON: " +
        "{\"summary\": string, \"strengths\": string[], \"risks\": {\"risk\": string, \"impact\": string, \"mitigation\": string}[], " +
        "\"missingDetails\": string[], \"recommendedChanges\": string[], \"decisionPoints\": string[]}",
      input,
    },
    ctx,
    [
      "Identifies concrete risks with mitigations",
      "Recommendations are prioritized and actionable",
      "Calls out missing details and key decision points",
    ],
    opts
  );
};

