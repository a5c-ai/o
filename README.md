# o - repo-local orchestration prompt runner

`o` is a small Bash runner that renders a repo-local orchestration prompt (`.a5c/o.md`) and runs it through your chosen agent CLI (`codex`, `claude-code`, `gemini`, or a `custom` runner).

It focuses on three practical problems when using agents for real work:

- Process-following: put the orchestration prompt and reusable process patterns in the repo, so "how we work" is versioned next to the code.
- Convergence to quality: use explicit quality criteria and evaluation loops (via the included process code patterns) to iterate until the result clears a threshold.
- Predictability: encourage reproducible runs by capturing inputs, prompts, work summaries, and an audit trail under a consistent `.a5c/runs/<run_id>/` convention (gitignored by default).

What this repo ships:

- `./o`: loads config, renders `.a5c/o.md` with your request, and executes the configured runner.
- `.a5c/`: templates for the orchestration prompt, function prompts, and reusable process patterns.

Platform note: `o` is Bash. On Windows, use WSL2 (recommended) or Git Bash/MSYS2.

Jump to: [Quickstart](#quickstart) | [Prerequisites](#prerequisites) | [Install](#install) | [Usage](#usage) | [Configuration](#configuration) | [How it works](#how-it-works) | [Why quality converges](#why-quality-converges) | [Security](#security-notes) | [Troubleshooting](#troubleshooting) | [Uninstall](#uninstall) | [Contributing](#contributing) | [`INSTALL.md`](INSTALL.md)

## Prerequisites

- **Bash** (macOS/Linux; Windows via **WSL2** or **Git Bash/MSYS2**)
- **curl** and **tar** (required by the installer)

## Quickstart

```bash
# 1) Install into the current directory (script + .a5c/ templates)
curl -fsSL https://raw.githubusercontent.com/a5c-ai/o/main/install.sh | bash -s -- --to .

# 2) Create/update your config (writes global config by default)
./o init

# 3) Validate your setup (use --show-install-hints for extra help)
./o doctor --show-install-hints

# 4) Run a request
./o "spec and implement a CLI onboarding flow"
```

## Install

### One-liner (no git required)

Installs `./o` + `.a5c/` templates into a target directory by downloading the repo tarball from GitHub:

```bash
curl -fsSL https://raw.githubusercontent.com/a5c-ai/o/main/install.sh | bash -s -- --to .
```

### Inspect-first (download, inspect, then run)

If you prefer not to run `curl | bash`, you can download the installer from the same raw URL, inspect it locally, then run it:

```bash
curl -fsSLo install.sh https://raw.githubusercontent.com/a5c-ai/o/main/install.sh
sed -n '1,200p' install.sh
bash ./install.sh --to .
rm -f ./install.sh
```

Installer flags:

- `--to DIR` target directory (default: current directory)
- `--force` overwrite existing `o` / `.a5c/{o.md,functions,processes}`
- `--no-gitignore` do not modify target `.gitignore`
- `--smoke-test` run local smoke tests in a temp dir (repo-only)
- `--help` show usage

### From a clone

```bash
git clone https://github.com/a5c-ai/o
cd o
chmod +x ./o
./o help
```

For full installation notes, see `INSTALL.md`.

## Usage

Core commands:

- `./o init` - interactive onboarding, writes a config file
- `./o doctor` - validates config + runner setup (`--show-install-hints` prints optional install hints)
- `./o help` - usage + defaults

Run a request (uses your configured runner):

```bash
./o "review this repo and propose a test strategy"
```

## Configuration

### Config file location

Default global config path: `~/.a5c/creds.env`

Resolution order:

1. `O_CREDS_FILE` (explicit override)
2. `~/.a5c/creds.env` (global)
3. `.a5c/creds.env` (local, next to `./o`)

You can also force a choice per command:

```bash
./o init --global
./o init --local
./o doctor --file /absolute/path/to/creds.env
./o --global "your request here"
```

### Config format (safe-by-default)

The config is an env-style file (`KEY=VALUE`). For safety, `o` only supports plain assignments (no shell code).

`./o init` writes a managed block delimited by:

- `# --- A5C managed by \`o init\` ---`
- `# --- End A5C managed ---`

Re-running `./o init` is idempotent: it rewrites only the managed block and preserves unmanaged content outside the markers (atomic write via temp file + `mv`).

### Runner presets

`o` supports the following runners:

- `codex` - providers: `openai` / `azure`
- `claude-code` - providers: `anthropic` / `bedrock` / `vertex`
- `gemini` - provider: `gemini`
- `custom` - execute your own command template

`./o init` will prompt you for the relevant API key(s) and write them to the selected config file.

## Custom runners (trust boundary)

Custom runners are powerful, but they are also your trust boundary:

- `A5C_CUSTOM_COMMAND_TEMPLATE` is executed via `bash -lc` on your machine.
- The template **must** include `{{prompt_path}}` and should quote it.
- Don't embed secrets in the command template itself; keep secrets in the creds file.
- Treat runner binaries as part of your threat model (you are executing them on your machine).

Example template (a runner that accepts a prompt file path):

```bash
A5C_CUSTOM_COMMAND_TEMPLATE='my-runner --prompt-file {{prompt_path}}'
```

Install hints:

- Set `A5C_CUSTOM_INSTALL_COMMAND` (optional) and run `./o doctor --show-install-hints`.

Gemini-specific overrides (optional):

- `A5C_GEMINI_COMMAND_TEMPLATE` (must include `{{prompt_path}}`)
- `A5C_GEMINI_INSTALL_COMMAND` (shown by `./o doctor --show-install-hints`)

## How it works

End-to-end flow (`./o "your request"`):

1. `./o` loads your creds file (KV-only parsing; no `source`).
2. It renders a temporary prompt from `.a5c/o.md` by substituting `{{request}}`.
3. It runs the selected runner preset (`codex`, `claude-code`, `gemini`) or a custom command template.
4. The orchestration prompt (not the Bash script) tells the agent how to structure work, including where to write artifacts.

What is in `.a5c/`:

- `.a5c/o.md`: the orchestration "driver" prompt.
- `.a5c/functions/`: prompt templates for `act()`, `develop()`, `score()`.
- `.a5c/processes/`: reusable process patterns expressed as code/pseudocode (e.g., planned work, test-driven loops, quality-gated iteration).

Run artifacts (by convention):

The default `.a5c/o.md` prompt expects the orchestrator to keep an audit trail and working state under `.a5c/runs/<run_id>/`, including:

- `inputs.json` (what was asked)
- `prompts/` and `work_summaries/` (what was sent to the runner and what came back)
- `journal.jsonl` (append-only event log)
- `state.json` (derived state for resuming)

Installers manage `.gitignore` to keep `.a5c/runs/` out of git by default.

## Why quality converges

`o` itself is intentionally thin; the "quality convergence" comes from using repeatable process patterns in the orchestration prompt:

- Make quality criteria explicit (what to evaluate, and what "good" means) instead of relying on implicit taste.
- Use an evaluation loop (act -> score -> fix) until the score clears a threshold; see `.a5c/functions/score.md` and example process patterns like `.a5c/processes/development/aspects/quality_gated_iterative.js`.
- Keep artifacts and feedback in the run directory so you can review, diff, and rerun with the same inputs and process.

## Security notes

- Credentials are stored locally in plain text at `~/.a5c/creds.env` by default; `o` attempts to enforce `chmod 600` and warns when permissions look unsafe.
- Treat `.a5c/runs/` as potentially sensitive (it can contain prompts, work summaries, and task context); keep it out of git.
- If you use `custom` runners, consider the creds file + runner template a single security boundary (review changes before re-running).

## Getting help

- Start with `./o help` and `./o doctor --show-install-hints` (they are the source of truth for flags + install hints).
- Check `INSTALL.md` for installation notes and `Troubleshooting` below for common errors.
- When asking for help, include sanitized output from `./o doctor` (avoid pasting secrets from your creds file).

## Troubleshooting

- "`config not found. Run: ./o init`" -> run `./o init` (or set `O_CREDS_FILE` / use `--file PATH`).
- "unsupported line in config" -> the creds file must be `KEY=VALUE` only (no shell snippets).
- Runner CLI missing -> run `./o doctor --show-install-hints` and follow the printed install command(s).
- Permission warnings -> consider `chmod 600 ~/.a5c/creds.env` and `chmod 700 ~/.a5c`.

## Uninstall

From a repo where you installed `o`:

```bash
rm -f ./o
rm -rf ./.a5c/
```

Optional (removes global config; only do this if you're not using it for other repos):

```bash
rm -f ~/.a5c/creds.env
```

## Verification (cheap)

```bash
bash -n ./o
./o help
./o init
./o doctor --show-install-hints
```

## Contributing

- Keep changes minimal and CLI-doc-accurate (README should match `./o help` and `./install.sh --help`).
- Run local checks:

```bash
bash -n ./o
bash -n ./install.sh
./install.sh --smoke-test
```

---

Created by a5c.ai
