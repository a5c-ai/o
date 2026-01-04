# User Guide: `o` (orchestration agent runner)

`o` is a repeatable, repo-local orchestration workflow for running an AI coding agent on real codebases. It turns a request into a structured run with a consistent prompt, predictable artifacts on disk, and explicit checkpoints where you can review and steer.

Instead of hoping a single pass is "good enough", `o` is designed for quality convergence: the agent produces work, the run evaluates it against criteria, and the loop repeats until a threshold is met. Because the process and artifacts are recorded, outcomes are more predictable and auditable, and you can re-run the same workflow later.

You keep using the runner you already prefer (for example: `codex`, `claude-code`, `gemini`, or a `custom` runner). `o` provides the lightweight, repo-local structure around that runner so agent work is easier to operate day to day.

> Platform note: `o` is Bash. On Windows, use **WSL2** (recommended) or **Git Bash/MSYS2**.

## How quality convergence works

At a high level, an orchestration run follows a simple loop:

- `act()` produces work (code changes, notes, patches, etc).
- `score()` evaluates the work against explicit criteria and returns feedback.
- If the score is below a threshold, the run iterates: `act()` improves the work using the feedback, then `score()` re-evaluates.
- `breakpoint()` pauses the run for human steering or approval at important moments (before risky steps, after a plan, when tradeoffs are needed).

---

## Table of Contents

- [What you can do with `o` (today)](#what-you-can-do-with-o-today)
- [What `o` is (and what it solves)](#what-o-is-and-what-it-solves)
- [Why this is different from just running an agent once](#why-this-is-different-from-just-running-an-agent-once)
- [End-to-end orchestration examples](#end-to-end-orchestration-examples)
- [Quickstart](#quickstart)
- [Installation](#installation)
  - [Install via `install.sh` (recommended)](#install-via-installsh-recommended)
  - [Install from a clone](#install-from-a-clone)
  - [Install scaffold via `./o init --install`](#install-scaffold-via-o-init---install)
- [CLI overview](#cli-overview)
- [Configuration](#configuration)
  - [Where config is read from (resolution order)](#where-config-is-read-from-resolution-order)
  - [Config file format (KV-only)](#config-file-format-kv-only)
  - [What `./o init` writes](#what-o-init-writes)
  - [Runner presets (codex / claude-code / gemini / custom)](#runner-presets-codex--claude-code--gemini--custom)
- [How `o` runs a request](#how-o-runs-a-request)
- [Event-sourced run model (`.a5c/runs/`)](#event-sourced-run-model-a5cruns)
  - [Directory layout](#directory-layout)
  - [How to inspect a run](#how-to-inspect-a-run)
- [Copy/paste recipes](#copypaste-recipes)
  - [Basic: init -> doctor -> run](#basic-init---doctor---run)
  - [Use local vs global config](#use-local-vs-global-config)
  - [Override config via `O_CREDS_FILE`](#override-config-via-o_creds_file)
  - [Custom runner templates (trust boundary)](#custom-runner-templates-trust-boundary)
  - [Gemini template overrides](#gemini-template-overrides)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Windows notes (WSL2 / Git Bash / PowerShell)](#windows-notes-wsl2--git-bash--powershell)

---

## Why this is different from just running an agent once

Running an agent ad hoc can be useful, but it is hard to repeat and hard to review. `o` is designed around a "run" that leaves an artifact trail:

- **Auditability:** the generated prompt and key context are written to disk, so you can see what was asked and what happened.
- **Repeatability:** the same repo-local prompt and the same config resolution rules apply each time, so runs are comparable.
- **Collaboration:** you can share a run directory (after sanitizing) so someone else can review outcomes or pick up where you left off.
- **Safer defaults:** secrets live in a creds file (and artifacts are typically gitignored) instead of leaking into copy/paste history.
- **Artifact trail:** `.a5c/runs/` acts as the working folder for agent work, which helps debugging and postmortems.

## End-to-end orchestration examples

The examples below show what "orchestrating" looks like in practice: you run one command, and the orchestration prompt (`.a5c/o.md`) drives a loop of `act()` and `score()`, with explicit breakpoints for you to steer.

Each example includes a small pseudo `code/main.js` sketch to make the control flow concrete. Your exact `main.js` is created/selected by the orchestration and saved under `.a5c/runs/<run_id>/code/main.js`.

### Example 1: Multi-step workflow (research -> plan -> implement -> verify -> document)

Goal:

- Add a small feature safely, with tests and docs, without losing context.

What you run:

```bash
./o "Add feature X: research existing patterns, propose a plan, implement with tests, verify locally, and update USER_GUIDE.md with usage notes."
```

Expected run artifacts:

- `.a5c/runs/<run_id>/inputs.json` (feature scope, constraints, repo notes)
- `.a5c/runs/<run_id>/code/main.js` (the multi-phase process)
- `.a5c/runs/<run_id>/journal.jsonl` (event history across phases)
- `.a5c/runs/<run_id>/state.json` (derived state: current phase, last scores, decisions)
- `.a5c/runs/<run_id>/prompts/001_*.md` (prompts for research/plan/implement/verify/doc)
- `.a5c/runs/<run_id>/work_summaries/001_*.md` (captured agent outputs per phase)

Process sketch (pseudo `code/main.js`):

```javascript
import { act, score, breakpoint, inputs } from "@a5c/not-a-real-package";

let context = inputs;
breakpoint("confirm feature goal + constraints", context);

const research = act("research existing code patterns + risks", context);
breakpoint("review research notes", research, context);

const plan = act("write step-by-step plan (include tests + docs)", { research, ...context });
breakpoint("approve plan", plan, context);

let work, scored;
do {
  work = act("implement plan step + tests + docs updates", { plan, ...context });
  scored = score({ work, checks: ["build", "tests", "lint"], ...context });
  if (scored.scoreCard.reward_total < 0.8) breakpoint("fix issues from score feedback", scored, work);
} while (scored.scoreCard.reward_total < 0.8);
```

How to steer:

- At "confirm feature goal + constraints": paste any non-negotiables (APIs to avoid, file boundaries, performance targets).
- At "approve plan": request re-planning if the plan is missing tests, migration steps, or rollback strategy.
- When score is low: read the feedback and tell the orchestrator which failures are acceptable (rare) vs must-fix; add clarifying constraints to `inputs.json` if needed.

How to verify:

- Cheap checks: `git diff`, run the repo's normal build/tests, and spot-check any updated docs.
- Read artifacts: start with `.a5c/runs/<run_id>/work_summaries/` for human-readable progress, then open `.a5c/runs/<run_id>/journal.jsonl` to see what was attempted and why.

### Example 2: Quality evaluation loop (score threshold + iteration)

Goal:

- Tighten code quality (tests, edge cases, style) until a threshold is met.

What you run:

```bash
./o "Refactor module Y for readability and safety, add missing tests, and iterate until quality score >= 0.85."
```

Expected run artifacts:

- `.a5c/runs/<run_id>/code/main.js` (explicit `score()` gate and loop)
- `.a5c/runs/<run_id>/journal.jsonl` (each iteration logged as an event)
- `.a5c/runs/<run_id>/state.json` (latest score + iteration counter)
- `.a5c/runs/<run_id>/prompts/00*_*.md` (per-iteration prompts)
- `.a5c/runs/<run_id>/work_summaries/00*_*.md` (per-iteration outputs and deltas)

Process sketch (pseudo `code/main.js`):

```javascript
import { act, score, breakpoint, inputs } from "@a5c/not-a-real-package";

let context = inputs;
breakpoint("confirm scoring rubric + threshold", context);

let work = null;
let scored = { scoreCard: { reward_total: 0.0 } };
while (scored.scoreCard.reward_total < 0.85) {
  work = act("improve code + tests for module Y", { lastScore: scored, ...context });
  scored = score({ work, rubric: ["correctness", "tests", "readability"], ...context });
  breakpoint("review score feedback and steer next iteration", scored, work);
}
```

How to steer:

- At the rubric breakpoint: define what "good" means (for example, "prefer small functions; no behavior change; add tests for edge cases A/B/C").
- If the score stalls: tell the orchestrator to change tactic (add characterization tests first, reduce scope, or split into smaller steps).
- If a score comment is wrong: correct it explicitly at the breakpoint so the next iteration does not chase the wrong target.

How to verify:

- Cheap checks: run the smallest relevant test command for module Y; scan for behavior changes with `git diff`.
- Read artifacts: compare successive `.a5c/runs/<run_id>/work_summaries/` entries to confirm the loop is converging and not thrashing.

### Example 3: Creating a new run inside the session (and approving `code/main.js`)

Goal:

- Start from a high-level request, have the orchestration create a fresh run id and a process, then explicitly approve the process code before work begins.

What you run:

```bash
./o "Create a run to triage flaky tests: propose an investigation plan, run minimal diagnostics, implement the smallest fix, and summarize root cause + prevention."
```

Expected run artifacts:

- `.a5c/runs/<run_id>/code/main.js` (newly generated/selected process program)
- `.a5c/runs/<run_id>/inputs.json` (structured goals, constraints, definitions of "fixed")
- `.a5c/runs/<run_id>/journal.jsonl` (includes an event capturing your approval of `code/main.js`)
- `.a5c/runs/<run_id>/state.json` (tracks the current statement/phase)
- `.a5c/runs/<run_id>/prompts/001_*.md` and `.a5c/runs/<run_id>/work_summaries/001_*.md` (first prompts and outputs after approval)

Process sketch (pseudo `code/main.js`):

```javascript
import { act, score, breakpoint, inputs } from "@a5c/not-a-real-package";

breakpoint("approve run inputs and process code (main.js)", {
  inputs,
  main: "proposed code/main.js contents",
});

let work = act("investigate flakes + propose hypothesis", inputs);
breakpoint("pick investigation branch", work, inputs);

let scored;
do {
  work = act("apply smallest fix + add regression check", { work, ...inputs });
  scored = score({ work, checks: ["re-run flaky tests", "sanity suite"], ...inputs });
  if (scored.scoreCard.reward_total < 0.8) breakpoint("approve next attempt (or reduce scope)", scored, work);
} while (scored.scoreCard.reward_total < 0.8);
```

How to steer:

- At the approval breakpoint: edit or request edits to `.a5c/runs/<run_id>/inputs.json` (tighten scope, name the flaky tests, define "done").
- Also at approval: ask for a simpler `code/main.js` if it is over-engineered, or add breakpoints where you want explicit review gates.
- When score is low: decide whether to iterate (another hypothesis) or cut scope (stabilize the top offender first) and record that decision in the run (journal/state).

How to verify:

- Cheap checks: re-run the specific flaky tests a few times, then run the smallest representative suite you trust.
- Read artifacts: open `.a5c/runs/<run_id>/code/main.js` to confirm the approved process, and read `.a5c/runs/<run_id>/journal.jsonl` for the exact sequence of investigations and changes.

### Example 4: Realigning mid-run when scope changes (capture it and continue)

Goal:

- Handle "actually, do this instead" without losing traceability: update run inputs, record the pivot, and continue from a new plan.

What you run:

```bash
./o "Audit authentication flow for risks and propose fixes. If we discover a critical issue, pivot to implementing the smallest safe mitigation."
```

Expected run artifacts:

- `.a5c/runs/<run_id>/inputs.json` (original scope plus updated scope after pivot)
- `.a5c/runs/<run_id>/journal.jsonl` (an explicit scope-change event)
- `.a5c/runs/<run_id>/state.json` (updated current objective and phase)
- `.a5c/runs/<run_id>/prompts/00*_*.md` (before and after pivot prompts)
- `.a5c/runs/<run_id>/work_summaries/00*_*.md` (audit findings, then mitigation work)

Process sketch (pseudo `code/main.js`):

```javascript
import { act, score, breakpoint, inputs } from "@a5c/not-a-real-package";

let context = inputs;
let findings = act("audit auth flow and write findings", context);
breakpoint("review findings; decide whether to pivot scope", findings, context);

if (findings.criticalIssue) {
  context = { ...context, objective: "mitigate critical issue", findings };
  breakpoint("confirm updated scope (inputs/state/journal)", context);
}

let work, scored;
do {
  work = act("implement next step for current objective", context);
  scored = score({ work, ...context });
  if (scored.scoreCard.reward_total < 0.8) breakpoint("steer: refine scope or requirements", scored, context);
} while (scored.scoreCard.reward_total < 0.8);
```

How to steer:

- At the pivot breakpoint: state the new scope in one sentence, and ask the orchestrator to record it (journal) and reflect it in `inputs.json` so the next iteration reads the updated intent.
- If the pivot changes priorities (for example, "mitigation first, cleanup later"), explicitly defer non-critical items and keep them in the run notes so they are not silently dropped.
- When score is low during the pivot: reduce to the smallest acceptable mitigation and add a follow-up item to document the longer-term fix.

How to verify:

- Cheap checks: verify the mitigation with the smallest reproducible scenario (a targeted test, a local request, or a minimal integration check).
- Read artifacts: use `.a5c/runs/<run_id>/work_summaries/` to confirm the pivot decision and `.a5c/runs/<run_id>/inputs.json` to confirm the run is now operating on the updated scope.

---

## Quickstart

```bash
# 1) Create/update your config (writes global config by default)
./o init

# 2) Validate your setup
./o doctor --show-install-hints

# 3) Run a request
./o "review this repo and propose a test strategy"
```

Expected outcome:

- `./o init` writes a creds/config file (by default: `~/.a5c/creds.env`).
- `./o doctor` confirms the config is readable and your chosen runner CLI is installed/configured.
- `./o "..."` launches your chosen runner and feeds it a temporary prompt generated from `.a5c/o.md`.
- The orchestration prompt typically creates a run directory under `.a5c/runs/` and appends events/artifacts there.

---

## Installation

### Install via `install.sh` (recommended)

`install.sh` installs `./o` and `.a5c/` templates into a target directory.

```bash
curl -fsSL https://raw.githubusercontent.com/a5c-ai/o/main/install.sh | bash -s -- --to .
```

Expected outcome:

- `./o` exists and is executable (when `chmod` is supported).
- `./.a5c/o.md`, `./.a5c/functions/`, and `./.a5c/processes/` exist.
- `./.gitignore` is updated with a managed block that ignores:
  - `.a5c/creds.env`
  - `.a5c/creds.env.tmp.*`
  - `.a5c/runs/`

More details: `INSTALL.md`.

### Install from a clone

```bash
git clone https://github.com/a5c-ai/o
cd o
chmod +x ./o
./o help
```

Expected outcome:

- `./o help` prints usage and defaults.

### Install scaffold via `./o init --install`

`./o` includes a small "scaffold installer" that copies `o` and `.a5c/` templates into another directory and updates that directory's `.gitignore`.

```bash
# From a repo that already has ./o + .a5c/
./o init --install --to ../my-target-repo
```

Expected outcome:

- `../my-target-repo/o` exists.
- `../my-target-repo/.a5c/` contains `o.md`, `functions/`, and `processes/`.
- `../my-target-repo/.gitignore` has a managed block ignoring `.a5c/creds.env`, `.a5c/creds.env.tmp.*`, and `.a5c/runs/`.

---

## CLI overview

`./o help` prints the source-of-truth usage:

```text
Usage:
  o init [--global|--local|--file PATH] [--yes]
  o init --install [--to DIR] [--force] [--yes]
  o doctor [--global|--local|--file PATH] [--show-install-hints]
  o [--global|--local|--file PATH] "your request here"
  o help
```

---

## Configuration

### Where config is read from (resolution order)

`./o` resolves the creds/config file in this order:

1. `O_CREDS_FILE` (explicit override)
2. `~/.a5c/creds.env` (global)
3. `.a5c/creds.env` (local, next to `./o`)

Important: if nothing exists yet, `./o` defaults to *the global path* (`~/.a5c/creds.env`) when telling you where to create config.

You can also choose a target per command:

```bash
./o init --global
./o init --local
./o init --file /absolute/path/to/creds.env

./o doctor --global
./o doctor --local
./o doctor --file /absolute/path/to/creds.env

./o --global "your request"
./o --local "your request"
./o --file /absolute/path/to/creds.env "your request"
```

Expected outcome:

- The `--global/--local/--file` flags set `O_CREDS_FILE` for that invocation.

### Config file format (KV-only)

The config file is an env-style file. `./o` parses it in a "KV-only" mode:

- Supports lines like `KEY=VALUE`
- Allows an optional leading `export ` (e.g. `export KEY=VALUE`)
- Ignores blank lines and comments (`# ...`)
- Rejects everything else (no shell code, no command substitution)

Value rules:

- If a value contains whitespace, it **must** be quoted (single or double quotes).
- Inline `# comments` are only stripped when they are preceded by whitespace (e.g. `KEY=value # comment`).

Example:

```bash
cat > ~/.a5c/creds.env <<'EOF'
# --- A5C managed by `o init` ---
A5C_PROVIDER_NAME="openai"
A5C_SELECTED_CLI_COMMAND="codex"
A5C_SELECTED_MODEL="gpt-5.2"
OPENAI_API_KEY="YOUR_API_KEY"
# --- End A5C managed ---

# Unmanaged content below is preserved by `o init`
export SOME_OTHER_SETTING="some value with spaces"
EOF
```

Expected outcome:

- `./o doctor` reads the file without executing it as shell code.

### What `./o init` writes

`./o init` writes (or updates) a managed block in the chosen creds file, delimited by:

- `# --- A5C managed by \`o init\` ---`
- `# --- End A5C managed ---`

Re-running `./o init` is designed to be safe:

- If the managed block markers exist, only the contents *inside* the block are rewritten.
- If the markers don't exist, `./o init` prepends a new managed block and then appends the previous file contents below it.

### Runner presets (codex / claude-code / gemini / custom)

`./o init` asks you for:

- Runner preset: `codex`, `claude-code`, `gemini`, or `custom`
- Provider (varies by preset)
- Model (stored as `A5C_SELECTED_MODEL`)
- Any required API keys (depending on provider)
- Optional command templates for `gemini` and `custom` runners

The managed block will include:

- `A5C_SELECTED_CLI_COMMAND` (the preset you selected)
- `A5C_PROVIDER_NAME`
- `A5C_SELECTED_MODEL`

Provider-specific required keys:

- **codex + openai**
  - `OPENAI_API_KEY`
- **codex + azure**
  - `AZURE_OPENAI_PROJECT_NAME` (your Azure OpenAI project/resource name)
  - `AZURE_OPENAI_API_KEY`
- **claude-code + anthropic**
  - `ANTHROPIC_API_KEY`
- **claude-code + bedrock / vertex**
  - `./o init` can set `A5C_PROVIDER_NAME` to `bedrock` or `vertex`, but it does not prompt for provider-specific credentials for these options.
  - You are responsible for any required cloud credentials/config for the Claude Code CLI in your environment.
- **gemini + gemini**
  - `GEMINI_API_KEY`

Runner-specific optional settings:

- `A5C_GEMINI_COMMAND_TEMPLATE` (must include `{{prompt_path}}`)
- `A5C_GEMINI_INSTALL_COMMAND` (shown by `./o doctor --show-install-hints`)
- `A5C_CUSTOM_COMMAND_TEMPLATE` (must include `{{prompt_path}}`)
- `A5C_CUSTOM_INSTALL_COMMAND` (shown by `./o doctor --show-install-hints`)

Concrete example configs (placeholders only):

```bash
# OpenAI via codex
A5C_SELECTED_CLI_COMMAND="codex"
A5C_PROVIDER_NAME="openai"
A5C_SELECTED_MODEL="gpt-5.2"
OPENAI_API_KEY="YOUR_API_KEY"
```

```bash
# Azure OpenAI via codex
A5C_SELECTED_CLI_COMMAND="codex"
A5C_PROVIDER_NAME="azure"
A5C_SELECTED_MODEL="gpt-5.2"
AZURE_OPENAI_PROJECT_NAME="my-azure-resource"
AZURE_OPENAI_API_KEY="YOUR_AZURE_OPENAI_API_KEY"
```

```bash
# Anthropic via claude-code
A5C_SELECTED_CLI_COMMAND="claude-code"
A5C_PROVIDER_NAME="anthropic"
A5C_SELECTED_MODEL="claude-3-5-sonnet-latest"
ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY"
```

```bash
# Gemini via gemini
A5C_SELECTED_CLI_COMMAND="gemini"
A5C_PROVIDER_NAME="gemini"
A5C_SELECTED_MODEL="gemini-2.0-flash"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

---

## How `o` runs a request

When you run:

```bash
./o "your request here"
```

`./o`:

1. Loads config from the resolved creds file (KV-only parsing).
2. Creates a temporary file via `mktemp`.
3. Renders `.a5c/o.md` into that temp file by replacing `{{request}}` with your request text.
4. Invokes your selected runner preset:
   - **codex / claude-code:** echoes the full runner command and runs it with an instruction to read the prompt file.
   - **gemini / custom:** builds a command by substituting `{{prompt_path}}` and executes it via `bash -lc`.

Expected outcome:

- Your runner CLI receives a prompt that points at the rendered prompt file path.
- Any run artifacts are created by the orchestration instructions inside `.a5c/o.md` (not by `./o` directly).

---

## Event-sourced run model (`.a5c/runs/`)

The orchestration prompt (`.a5c/o.md`) describes an event-sourcing model for tracking work:

- `.a5c/o.md` is the orchestration "driver" prompt that tells the runner how to structure work.
- `.a5c/functions/` contains prompt templates for agent function calls (e.g. `act()`, `score()`).
- `.a5c/processes/` contains reusable "process code" the orchestration can reference when generating `code/main.js`.
- A run is identified by a **run id** and stored under `.a5c/runs/<run_id>/`.
- Work is tracked as an append-only sequence of events in `journal.jsonl`.
- Derived state is materialized in `state.json`.
- Prompts sent to sub-agents and their returned work summaries are saved under `prompts/` and `work_summaries/`.
- A process "program" lives in `code/main.js` (plus any referenced process code from `.a5c/processes/`).

### Directory layout

A typical run directory looks like this:

```text
.a5c/runs/<run_id>/
  inputs.json
  journal.jsonl
  state.json
  code/
    main.js
  prompts/
    001_*.md
    002_*.md
  work_summaries/
    001_*.md
    002_*.md
  orchestrator/
    (optional helper scripts for the run)
```

What each artifact is for:

- `inputs.json`: structured inputs for the orchestration process (what the run is trying to do).
- `code/main.js`: the process "code" that defines the orchestration steps and when to call agent functions like `act()` / `score()`.
- `journal.jsonl`: append-only event log. It's intended to be the canonical history you can replay/inspect.
- `state.json`: snapshot derived from the journal (current position in the process, accumulated outputs, etc.).
- `prompts/`: the actual prompt files that were fed to an agent tool (inputs).
- `work_summaries/`: the captured outputs from those agent runs (outputs).
- `orchestrator/`: helper scripts/tools used by the orchestrator (when run-specific).

### How to inspect a run

```bash
ls .a5c/runs/
ls .a5c/runs/<run_id>/
```

Expected outcome:

- You see one or more run directories and their artifacts.

Debugging workflow (typical):

1. Read the latest `work_summaries/*` to understand what happened at a human level.
2. Inspect `journal.jsonl` to see the sequence of events and locate the failure point.
3. Open `state.json` to see the current derived state.
4. Open `prompts/*` to confirm what instructions were actually sent.

---

## Copy/paste recipes

### Basic: init -> doctor -> run

```bash
./o init
./o doctor --show-install-hints
./o "summarize this repo and suggest next steps"
```

Expected outcome:

- `./o init` prompts for runner/provider/model and writes the managed block in your creds file.
- `./o doctor` prints `...: OK` for the selected runner and ends with `config: OK (...)`.
- The runner opens an interactive session and begins following `.a5c/o.md`.

### Use local vs global config

Use **global** config (`~/.a5c/creds.env`):

```bash
./o init --global
./o doctor --global
./o --global "implement a small refactor and run tests"
```

Expected outcome:

- Your global config is used regardless of any `.a5c/creds.env` in the repo.

Use **local** config (`.a5c/creds.env` next to `./o`):

```bash
./o init --local
./o doctor --local
./o --local "add a minimal CI check"
```

Expected outcome:

- The repo-local `.a5c/creds.env` is used for this repo only.

### Override config via `O_CREDS_FILE`

This is the highest-precedence config selection mechanism.

```bash
O_CREDS_FILE="$HOME/.a5c/creds.env" ./o doctor
O_CREDS_FILE="$HOME/.a5c/creds.env" ./o "your request"
```

Expected outcome:

- `./o` ignores the default search order and uses the file you specify.

### Custom runner templates (trust boundary)

Custom runner templates are executed on your machine via `bash -lc` and therefore define a trust boundary.

Minimum requirement:

- `A5C_CUSTOM_COMMAND_TEMPLATE` **must include** `{{prompt_path}}` (and should quote it).
- Keep secrets in the creds file (e.g. `OPENAI_API_KEY="..."`), not embedded directly in the template string.

Example template (runner accepts a prompt file path):

```bash
# In your creds.env (recommended), or exported in your shell:
A5C_CUSTOM_COMMAND_TEMPLATE="my-runner --prompt-file {{prompt_path}}"
```

Expected outcome:

- `./o doctor` accepts the template.
- `./o "..."` substitutes the actual temp file path and runs: `bash -lc "<expanded command>"`.

Quoting-safe variant (recommended pattern):

```bash
A5C_CUSTOM_COMMAND_TEMPLATE="my-runner --prompt-file '{{prompt_path}}'"
```

Expected outcome:

- The prompt path is treated as a single argument even if it contains spaces.

### Gemini template overrides

The gemini preset can use:

- `A5C_GEMINI_COMMAND_TEMPLATE` (preferred), or
- `A5C_CUSTOM_COMMAND_TEMPLATE` (legacy fallback for gemini)

Both must include `{{prompt_path}}`.

Example:

```bash
./o init   # choose runner=gemini when prompted
./o doctor --show-install-hints
```

Optional override (in your creds file):

```bash
A5C_GEMINI_COMMAND_TEMPLATE="gemini --model \"$A5C_SELECTED_MODEL\" \"read {{prompt_path}} and follow the instructions in the file\""
```

Expected outcome:

- `./o doctor` validates the template contains `{{prompt_path}}`.

---

## Troubleshooting

### `config not found. Run: ./o init`

Cause:

- No creds file exists at `O_CREDS_FILE`, `~/.a5c/creds.env`, or `.a5c/creds.env`.

Fix:

```bash
./o init
```

### `unsupported line in config (only KEY=VALUE supported)`

Cause:

- Your creds file contains a line that isn't a plain `KEY=VALUE` assignment (or `export KEY=VALUE`).

Fix:

- Replace shell snippets with plain assignments.
- Quote values that contain spaces.

### Runner CLI missing (`codex not found`, `claude not found`, `gemini not found`)

Fix:

```bash
./o doctor --show-install-hints
```

Expected outcome:

- `./o doctor` prints an install command hint for the configured runner.

### `A5C_CUSTOM_COMMAND_TEMPLATE must include {{prompt_path}}`

Cause:

- Your custom (or gemini) command template doesn't include the placeholder.

Fix:

- Add `{{prompt_path}}` to the template and re-run `./o doctor`.

### `mktemp is required` / `bash is required`

Cause:

- Your environment doesn't provide standard Unix tools.

Fix:

- Use **WSL2** (recommended on Windows) or install a bash environment that includes `mktemp`.

### `/usr/bin/env: 'bash\r': No such file or directory`

Cause:

- `./o` has CRLF line endings.

Fix (example):

```bash
dos2unix ./o
```

---

## Security notes

1. **Treat creds files as secrets.** By default `./o` uses `~/.a5c/creds.env`. Don't commit it.
2. **`./o init` updates `.gitignore`** (when using the installer/scaffold) to ignore `.a5c/creds.env` and `.a5c/runs/`.
3. **File permissions are best-effort.** `./o` tries to set creds file permissions to `600` and warns if it appears group/world accessible. On Windows-like filesystems this may not be enforceable.
4. **Runner presets may bypass sandboxing.**
   - The `codex` preset is invoked with `--dangerously-bypass-approvals-and-sandbox`.
   - The `claude-code` preset is invoked with `--dangerously-skip-permissions`.
   Use these only in environments where that trust model is acceptable.
5. **Custom runner trust boundary is yours.**
   - `A5C_CUSTOM_COMMAND_TEMPLATE` is executed via `bash -lc` on your machine.
   - Treat the runner binary/script as fully trusted code: it can read your repo and any credentials available in the environment.
6. **Run artifacts can be sensitive.** `.a5c/runs/` can contain prompts, work summaries, and other context. Share artifacts only after sanitizing.

---

## Windows notes (WSL2 / Git Bash / PowerShell)

### Recommended: WSL2

Run `o` inside WSL2 for the most Unix-like behavior (permissions, `mktemp`, quoting, etc.).

### Git Bash / MSYS2

Git Bash/MSYS2 can work, but validate with:

```bash
./o doctor --show-install-hints
```

If `chmod` or Unix permissions aren't enforced, `./o` may warn about config file permissions.

### PowerShell environment variables

If you need to force a specific creds file from PowerShell, set `O_CREDS_FILE` like this:

```powershell
$env:O_CREDS_FILE = "C:\path\to\creds.env"
bash ./o doctor
bash ./o "your request here"
```

Expected outcome:

- The Bash script sees `O_CREDS_FILE` and uses that file.

---
