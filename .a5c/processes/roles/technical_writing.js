import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";

const gate = (task, ctx, criteria, opts = {}) =>
  runQualityGate({
    task,
    ctx,
    develop: defaultDevelop,
    criteria,
    threshold: opts.threshold ?? 0.92,
    maxIters: opts.maxIters ?? 5,
    checkpoint: opts.checkpoint ?? false,
  });

export const docOutline = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Documentation outline",
      prompt:
        "Create a documentation outline for the task. Output JSON: " +
        "{\"audience\": string, \"docType\": string, \"goals\": string[], \"nonGoals\": string[], " +
        "\"prereqs\": string[], \"terminology\": {\"term\": string, \"definition\": string}[], " +
        "\"sections\": {\"title\": string, \"bullets\": string[]}[], \"examples\": string[], " +
        "\"maintenancePlan\": {\"owner\": string, \"updateTriggers\": string[], \"cadence\": string}}",
      input,
    },
    ctx,
    [
      "Audience and doc type are explicit and consistent",
      "Outline is actionable with concrete sections and examples",
      "Terminology is consistent and maintenance plan is included",
    ],
    opts
  );
};

export const apiDocsReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "API docs review",
      prompt:
        "Review the API documentation in the input. Output JSON: " +
        "{\"summary\": string, \"blockingIssues\": string[], \"nonBlockingIssues\": string[], " +
        "\"missingSections\": string[], \"terminologyInconsistencies\": string[], " +
        "\"snippetIssues\": string[], \"suggestedExamples\": string[], \"maintenanceNotes\": string[]}",
      input,
    },
    ctx,
    [
      "Finds accuracy gaps and missing sections that block real usage",
      "Feedback is specific, prioritized, and easy to apply",
      "Calls out runnable snippet/command issues and terminology drift",
    ],
    opts
  );
};

export const migrationGuide = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Migration guide",
      prompt:
        "Write a migration guide for the change. Output JSON: " +
        "{\"whoShouldMigrate\": string, \"whenToMigrate\": string, \"compatNotes\": string[], " +
        "\"prereqs\": string[], \"steps\": {\"step\": string, \"commandOrAction\": string, \"expectedResult\": string}[], " +
        "\"rollback\": {\"triggers\": string[], \"steps\": string[], \"validation\": string[]}, " +
        "\"faq\": {\"q\": string, \"a\": string}[]}",
      input,
    },
    ctx,
    [
      "Steps are ordered, concrete, and include expected results",
      "Compatibility, rollback, and validation are explicit",
      "Guide is scoped to the target audience and avoids ambiguity",
    ],
    opts
  );
};

export const releaseNotesDraft = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Release notes draft",
      prompt:
        "Draft release notes for the change. Output JSON: " +
        "{\"audience\": \"internal\"|\"external\", \"highlights\": string[], \"details\": string[], " +
        "\"breakingChanges\": string[], \"upgradeSteps\": string[], \"knownIssues\": string[], " +
        "\"supportNotes\": string[]}",
      input,
    },
    ctx,
    [
      "Highlights are concise and written for the stated audience",
      "Breaking changes and upgrade steps are explicit when applicable",
      "Notes include known issues and support/ops considerations",
    ],
    opts
  );
};

