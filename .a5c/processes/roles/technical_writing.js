import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop, primitivesFrom, requirePrimitive } from "../core/primitives.js";
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

const DEFAULT_REFERENCE_REPOS = ["vercel/next.js", "facebook/react", "microsoft/TypeScript"];
const DEFAULT_QUALITY_SIGNALS = [
  "narrative clarity",
  "quickstart accuracy",
  "trust signals",
  "maintenance badges",
  "contribution readiness",
];
const DEFAULT_TARGET_AUDIENCE = ["new contributors", "decision makers", "ops teams"];

const buildReadmeQualityCriteria = (signals = DEFAULT_QUALITY_SIGNALS) => [
  "README is tailored to this repo (name, problem statement, core capabilities) and opens with a clear narrative for the stated audiences.",
  "Quickstart/installation covers commands, configuration, and validation steps that actually work on a fresh machine.",
  "Trust + maintenance sections cite real signals (badges, uptime, SLA, release cadence) and tell users how reliability is ensured.",
  "Contribution and operations guidance is explicit: filing issues, running tests, release, escalation, and contact paths.",
  "Traceability: every major section references evidence from reference_signals.json and the trust_signal_matrix.csv.",
  ...signals.map((signal) => `Quality signal satisfied: ${signal}`),
];

const buildArtifacts = (baseDir) => ({
  referenceSignals: `${baseDir}/reference_signals.json`,
  qualityGoals: `${baseDir}/quality_goals.md`,
  outline: `${baseDir}/readme_outline.md`,
  acceptanceChecklist: `${baseDir}/acceptance_checklist.json`,
  draft: `${baseDir}/README.draft.md`,
  trustMatrix: `${baseDir}/trust_signal_matrix.csv`,
  finalReadme: `${baseDir}/README.final.md`,
  decisionLog: `${baseDir}/decision_log.md`,
  summary: `${baseDir}/run_summary.json`,
});

export const readmeQualityLoop = (inputs = {}, ctx = {}, opts = {}) => {
  const { act, breakpoint } = primitivesFrom(ctx);
  requirePrimitive("act", act);

  const runId = ctx.runId ?? inputs.runId ?? "<run_id>";
  const repoCtx = {
    repoRoot: inputs.ctx?.repoRoot ?? ctx.repoRoot ?? ".",
    repoName: inputs.ctx?.repoName ?? ctx.repoName ?? "repository",
    targetAudience: inputs.ctx?.targetAudience ?? ctx.targetAudience ?? DEFAULT_TARGET_AUDIENCE,
    referenceRepos: inputs.ctx?.referenceRepos ?? ctx.referenceRepos ?? DEFAULT_REFERENCE_REPOS,
    qualitySignals: inputs.ctx?.qualitySignals ?? ctx.qualitySignals ?? DEFAULT_QUALITY_SIGNALS,
  };

  const quality = {
    threshold: inputs.quality?.gateThreshold ?? opts.threshold ?? 0.9,
    maxLoops: inputs.quality?.maxLoops ?? opts.maxIters ?? 4,
  };

  const artifactsDir = inputs.artifactsDir ?? ctx.artifactsDir ?? `.a5c/runs/${runId}/artifacts`;
  const artifacts = buildArtifacts(artifactsDir);
  const request =
    inputs.request ??
    ctx.request ??
    "Research exemplar READMEs and author a high-signal README for this repo with quality gates.";

  breakpoint?.(
    "README quality loop intake: confirm repo context, reference repos, and quality signals before writing.",
    {
      required: [
        `repo root: ${repoCtx.repoRoot}`,
        `repo name: ${repoCtx.repoName}`,
        `reference repos: ${repoCtx.referenceRepos.join(", ")}`,
        `quality signals: ${repoCtx.qualitySignals.join(", ")}`,
      ],
      optional: [
        "Existing README callouts or TODOs",
        "Current badges/status sources",
        "Escalation contacts for ops/incidents",
      ],
      note:
        "Update inputs.json if anything is missing so the loop stays resumable via journal/state artifacts.",
    },
    { request, repoCtx, artifacts }
  );

  const referenceSignals = act(
    [
      "Research the provided reference repositories' README files (or equivalent landing docs).",
      `Reference repos: ${repoCtx.referenceRepos.join(", ")}`,
      `1. Write ${artifacts.referenceSignals} capturing structure, motifs, trust indicators, and CTA patterns (JSON array).`,
      `2. Write ${artifacts.qualityGoals} summarizing the resulting quality bar for this README (Markdown bullets grouped by signal).`,
      `3. Highlight any gaps the current repo must close (missing badges, unclear quickstart, etc.).`,
      "Do not modify the repo's existing README yet; work under the run artifacts directory.",
    ].join("\n"),
    { ...ctx, repoCtx, artifacts, request }
  );

  const outline = act(
    [
      "Plan a README outline tailored to the repo and the audiences provided.",
      `Use ${artifacts.referenceSignals} and ${artifacts.qualityGoals} as inputs.`,
      `Write ${artifacts.outline} (Markdown) describing section order, talking points, owners, and evidence needed.`,
      `Write ${artifacts.acceptanceChecklist} mapping each quality signal to concrete acceptance checks (JSON array).`,
      "Make the outline easy to diff/resume; include anchors that will map to headings.",
    ].join("\n"),
    { ...ctx, repoCtx, artifacts, referenceSignals }
  );

  const readmeDraft = runQualityGate({
    task: {
      title: "Iterate README draft with traceability",
      prompt:
        [
          request,
          `Use ${artifacts.outline} as the narrative spine.`,
          `Write/update ${artifacts.draft} (Markdown) with full README content. Do not overwrite repo README.md directly.`,
          `Maintain ${artifacts.trustMatrix} (CSV) linking each trust/quality signal to evidence (badge path, status, source link).`,
          "Preserve clear subsections: Overview, Why It Matters, Quickstart, Architecture/Concepts, Trust/Badges, Maintenance & Ops, Contribution, FAQ/Troubleshooting.",
          "Whenever a badge/status is missing, add TODO comments plus source requirements in trust_signal_matrix.csv.",
        ].join("\n"),
    },
    ctx: { ...ctx, repoCtx, artifacts, outline, referenceSignals },
    develop: defaultDevelop,
    criteria: buildReadmeQualityCriteria(repoCtx.qualitySignals),
    threshold: quality.threshold,
    maxIters: quality.maxLoops,
    checkpoint: true,
  });

  const decisionLog = act(
    [
      "Document the gate result and next actions.",
      `Append or create ${artifacts.decisionLog} summarizing:`,
      "- Gate score + remaining gaps (if any).",
      "- Whether another iteration is needed or we're finalizing.",
      "- Owners + follow-ups for missing trust signals/badges.",
    ].join("\n"),
    { ...ctx, repoCtx, artifacts, readmeDraft }
  );

  const summary = act(
    [
      "Finalize the README deliverable for handoff.",
      `Polish ${artifacts.draft} into ${artifacts.finalReadme} (ready to replace repo README.md once approved).`,
      `Update ${artifacts.summary} (JSON) with:`,
      "- files touched or to be promoted into the repo",
      "- validation commands (lint/tests) that were run or must be run",
      "- unresolved follow-ups and owners",
      "- instructions for applying the new README to repo root safely",
    ].join("\n"),
    { ...ctx, repoCtx, artifacts, readmeDraft, decisionLog }
  );

  return {
    request,
    repoCtx,
    artifacts,
    referenceSignals,
    outline,
    readmeDraft,
    decisionLog,
    summary,
  };
};
