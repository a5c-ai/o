import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";
import { runRecurringForever } from "../runners/recurring.js";

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

export const incidentResponse = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Incident response runbook",
      prompt:
        "Produce an incident response execution plan. Include: " +
        "immediate mitigations, verification signals, comms cadence, " +
        "ownership, and rollback options. Keep it fast to execute.",
      input,
    },
    ctx,
    [
      "Prioritizes safe, reversible mitigations",
      "Defines verification signals and decision points",
      "Includes comms cadence and ownership",
    ],
    opts
  );
};

export const deploy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Deploy plan",
      prompt:
        "Draft a deploy plan. Include: prerequisites, rollout steps, " +
        "health checks, rollback plan, and post-deploy validation.",
      input,
    },
    ctx,
    [
      "Prereqs and steps are unambiguous",
      "Health checks and success criteria are defined",
      "Rollback plan is practical and tested",
    ],
    opts
  );
};

export const postmortem = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Postmortem",
      prompt:
        "Write a blameless postmortem. Include: impact, timeline, " +
        "root cause(s), detection gaps, what went well, what didn't, " +
        "and action items with owners and target dates.",
      input,
    },
    ctx,
    [
      "Timeline and impact are clear and factual",
      "Root causes and contributing factors are identified",
      "Action items are specific with owners and dates",
    ],
    opts
  );
};

export const capacityReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Capacity review",
      prompt:
        "Produce a capacity review. Include: current load, bottlenecks, " +
        "forecast, and recommendations (quick wins and longer-term).",
      input,
    },
    ctx,
    [
      "Identifies bottlenecks and constraints explicitly",
      "Recommendations are prioritized with expected impact",
      "Includes monitoring signals to validate changes",
    ],
    opts
  );
};

export const monitorTriage = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Monitoring alert triage",
      prompt:
        "Triage the monitoring alert. Output JSON: " +
        "{\"alert\": string, \"severity\": \"low\"|\"med\"|\"high\", " +
        "\"likelyCause\": string, \"checks\": string[], \"mitigation\": string[], \"escalateTo\": string}",
      input,
    },
    ctx,
    [
      "Severity and escalation path are justified",
      "Checks are ordered from fastest to most informative",
      "Mitigations are safe and reversible",
    ],
    opts
  );
};

export const buildFixerWorkflow = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Build fixer workflow (CI-agnostic)",
      prompt:
        "Design an execution workflow to fix failing CI builds for this repo. " +
        "Be CI-provider agnostic: support GitHub Actions plus at least one non-GitHub CI provider (e.g., GitLab CI, Azure Pipelines, CircleCI, Jenkins). " +
        "First, discover the CI provider using repo artifacts and record the evidence used. " +
        "Provider heuristics (use as primary signals): " +
        "`.github/workflows/*` => GitHub Actions; `.gitlab-ci.yml` => GitLab CI; `azure-pipelines.yml` or `azure-pipelines.yaml` => Azure Pipelines; " +
        "`.circleci/config.yml` => CircleCI; `Jenkinsfile` => Jenkins; otherwise `unknown`. " +
        "If `ci.provider` is GitHub Actions, use the `github()` verb template for all GitHub/Actions CLI interactions (see `.a5c/functions/github.md`) " +
        "and do not embed ad-hoc `gh` instruction lists in prose. For non-GitHub providers, select and use the appropriate provider CLI if available " +
        "(or fall back to provider-neutral shell + file inspection) and never force GitHub tooling. " +
        "Output a single JSON object only (no markdown) using this provider-neutral schema (provider-specific and deprecated fields must be optional): " +
        '{ "ci": {"provider": "github"|"gitlab"|"azure"|"circleci"|"jenkins"|"unknown", "providerReason": string, "cli": string}, "providerPrereqs": string[], "discoveryCommands": string[], "runInspection": {"identifyFailingRun": string[], "inspectRun": string[], "fetchLogs": string[], "downloadArtifacts": string[]}, "rerunCommands": string[], "localRepro": {"commands": string[], "notes": string[]}, "providerSpecific": object|null } ' +
        "`ci.cli` must be the provider CLI tool name (e.g., `gh`, `glab`, `az`, `circleci`, `jenkins`, or `shell` if no dedicated CLI is used). " +
        "If `ci.provider === \"github\"`, the command strings themselves must use `github()`-scoped steps; `ci.cli` should still just name the CLI (typically `gh`). " +
        "If `ci.provider === \"github\"` and you need to include legacy GitHub-only prerequisites, you may add an optional `deprecated` object: `{ \"ghPrereqs\": string[] }`. " +
        "Requirements: always populate `ci.provider` and `ci.providerReason`; commands must be appropriate for the chosen provider; " +
        "GitHub-specific command entries must only appear when `ci.provider === \"github\"` and must be expressed as `github()`-scoped steps.",
      input,
    },
    ctx,
    [
      "Provider selection is evidence-based and recorded in ci.providerReason",
      "Output JSON schema is provider-neutral and unambiguous",
      "GitHub Actions workflows use github() for CLI interactions; non-GitHub providers do not",
      "Includes concrete discovery and inspection/rerun steps (or safe fallbacks)",
    ],
    opts
  );
};

export const buildFixerForever = async (
  task,
  ctx = {},
  {
    intervalMs = 15 * 60 * 1000,
    runOnce,
    name = "build_fixer",
    logger,
    ...workflowOpts
  } = {}
) => {
  const defaultRunOnce = async () => buildFixerWorkflow(task, ctx, workflowOpts);
  const effectiveRunOnce =
    typeof runOnce === "function" ? () => runOnce(task, ctx, workflowOpts) : defaultRunOnce;

  return runRecurringForever({
    name,
    intervalMs,
    logger,
    runOnce: effectiveRunOnce,
  });
};

export const infraChangePlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Infrastructure change plan",
      prompt:
        "Draft an infrastructure change plan. Include: " +
        "scope, dependencies, rollout and rollback, safety checks, " +
        "and a validation plan.",
      input,
    },
    ctx,
    [
      "Defines scope and dependencies clearly",
      "Rollout/rollback and safety checks are credible",
      "Validation plan ties to observable signals",
    ],
    opts
  );
};

export const defineSLOs = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Define SLOs",
      prompt:
        "Define SLOs for a service. Output JSON: " +
        "{\"service\": string, \"slos\": [{\"name\": string, \"sli\": string, \"target\": string, \"window\": string}], " +
        "\"alerts\": [{\"name\": string, \"signal\": string, \"threshold\": string, \"runbook\": string}], " +
        "\"errorBudgetPolicy\": string[]}",
      input,
    },
    ctx,
    [
      "SLIs are measurable and tied to user impact",
      "Alerts are actionable and reference runbooks",
      "Error budget policy includes decision guidance (freeze/escalate)",
    ],
    opts
  );
};

export const gameDayPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Game day plan",
      prompt:
        "Create a game day / chaos exercise plan. Output JSON: " +
        "{\"objective\": string, \"scenarios\": [{\"name\": string, \"inject\": string, \"expected\": string, \"rollback\": string}], " +
        "\"prereqs\": string[], \"guardrails\": string[], \"roles\": string[], \"timeline\": string[], \"followUps\": string[]}",
      input,
    },
    ctx,
    [
      "Scenarios are safe, reversible, and targeted",
      "Guardrails and rollback steps are explicit",
      "Follow-ups include concrete improvements and owners implied",
    ],
    opts
  );
};

export const runbook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Runbook",
      prompt:
        "Write a runbook. Include: triggers, quick triage, diagnostics, mitigations, " +
        "rollback options, and verification. Keep it copy/paste friendly.",
      input,
    },
    ctx,
    [
      "Runbook is executable under pressure (ordered, minimal steps)",
      "Includes clear verification signals and rollback options",
      "Calls out safety constraints and blast radius considerations",
    ],
    opts
  );
};
