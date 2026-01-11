<div align="center" id="hero">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./o-hero-dark.svg">
    <img src="./o-hero-light.svg" alt="o orchestration hero" width="720">
  </picture>
  <h1>babysitter -- Codify and run high-assurance agent processes</h1>
  <p>Stop babysitting your agents -- `./o` keeps orchestration prompts, quality gates, and audit trails versioned next to your code.</p>
  <p>
    <a href="#install" style="display:inline-block;padding:0.55rem 1.05rem;margin:0 0.25rem;border-radius:999px;background:#111;color:#fff;text-decoration:none;">Install</a>
    <a href="#how-it-works" style="display:inline-block;padding:0.55rem 1.05rem;margin:0 0.25rem;border-radius:999px;background:#f2f2f2;color:#111;text-decoration:none;">How it works</a>
    <a href="#examples" style="display:inline-block;padding:0.55rem 1.05rem;margin:0 0.25rem;border-radius:999px;background:#111;color:#fff;text-decoration:none;">Examples</a>
    <a href="#cli" style="display:inline-block;padding:0.55rem 1.05rem;margin:0 0.25rem;border-radius:999px;background:#f2f2f2;color:#111;text-decoration:none;">CLI</a>
  </p>
  <sub>Made by <a href="https://a5c.ai">a5c.ai</a>. For the deep dive, see <a href="/USER_GUIDE.md">USER_GUIDE.md</a>; this README is the fast-start view.</sub>
</div>

> Governance: Maintained by the a5c.ai Core team under the [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Extra detail lives in the addenda: [`README.contributing.md`](./README.contributing.md), [`README.operations.md`](./README.operations.md), [`README.support.md`](./README.support.md), [`README.security.md`](./README.security.md), [`README.faq.md`](./README.faq.md).

## <a id="badges"></a>Trust & Distribution

<p align="center">
  <a href="https://github.com/a5c-ai/o"><img src="https://img.shields.io/badge/Maintainer-a5c.ai-ff3366?style=for-the-badge" alt="Maintainer a5c.ai"></a>
  <a href="https://github.com/a5c-ai/o/releases"><img src="https://img.shields.io/github/v/tag/a5c-ai/o?label=stable&style=for-the-badge" alt="Stable version"></a>
  <a href="https://github.com/a5c-ai/o/commits/main"><img src="https://img.shields.io/github/commits-since/a5c-ai/o/latest/main?label=nightly&style=for-the-badge" alt="Nightly delta"></a>
  <a href="https://github.com/a5c-ai/o/actions"><img src="https://img.shields.io/badge/CI-bash%20lint-green?logo=githubactions&style=for-the-badge" alt="CI bash lint"></a>
  <a href="https://github.com/a5c-ai/o/actions"><img src="https://img.shields.io/badge/CI-installer%20smoke-green?logo=githubactions&style=for-the-badge" alt="CI installer smoke"></a>
  <a href="https://github.com/a5c-ai/o/blob/main/LICENSE"><img src="https://img.shields.io/github/license/a5c-ai/o?style=for-the-badge" alt="License"></a>
  <a href="https://github.com/a5c-ai/o"><img src="https://img.shields.io/badge/Homebrew%20tap-ready-24292f?style=for-the-badge" alt="Homebrew tap"></a>
  <a href="https://github.com/a5c-ai/o/labels/good%20first%20issue"><img src="https://img.shields.io/badge/PRs-Welcome-0A1?style=for-the-badge" alt="PRs Welcome"></a>
</p>

## <a id="overview"></a>What is `babysitter`?

`babysitter` is a Utility that wraps your preferred agent runner with:
- **Repo-local processes** stored in `.a5c/processes/` so the same workflow runs every time.
- **Event-sourced runs** under `.a5c/runs/<id>/` that capture prompts, work, and checkpoints.
- **Quality loops** that iterate until the work meets a score you set.
- **Human-in-the-loop breakpoints** where you approve plans, pivot scope, or stop the loop.

Personas served:
- **Contributors** replay the same prompt/process combo and see exactly what changed.
- **Maintainers/decision makers** get predictable release cadence and visible audit trails.
- **Ops/platform teams** can diagnose or resume runs because artifacts and doctor hints are recorded.

## <a id="how-it-works"></a>How Runs Work

1. `./o "your request"` creates `.a5c/runs/<id>/` with `inputs.json`, `code/main.js`, `state.json`, `journal.jsonl`, prompts, work summaries, and artifacts.
2. `act()` produces work; `score()` evaluates it against explicit checks; the loop repeats until the score clears the configured bar.
3. `breakpoint()` events pause the loop for human steering (approve plan, confirm pivot, accept risk).
4. Configuration is resolved via `O_CREDS_FILE` (or `--global | --local | --file PATH`), so secrets stay outside prompts.
5. Every run is auditable: you can diff artifacts, inspect prompts, or rerun the process later.

## <a id="examples"></a>Example Use Cases

### 1. Upgrade the README with quality gates
```bash
./o "Revamp README.md: research references, draft, score >= 0.93, summarize follow-ups."
```
- Process: `technical_writing.js#readmeQualityLoop` is selected automatically.
- Artifacts: research JSON + outline, `README.draft.md`, `README.final.md`, `run_summary.json`.
- Technical detail: `score()` enforces the rubric before the loop exits; everything lands under `.a5c/runs/<id>/artifacts/`.

### 2. Triage flaky tests with a scoped pivot
```bash
./o "Audit flaky auth tests, propose mitigations, and pivot to fix the highest-impact issue."
```
- Investigation notes are captured in `.a5c/runs/<id>/work_summaries/`.
- A breakpoint lets you update `inputs.json` (for example, focus on `auth_refresh_test.sh`) so subsequent `act()` steps implement a narrow fix plus regression tests.
- `journal.jsonl` records every hypothesis and fix attempt, making it easy to hand the run to another engineer.

Find more scenarios (release prep, migrations, troubleshooting) in [USER_GUIDE.md](/USER_GUIDE.md#end-to-end-orchestration-examples).

## <a id="install"></a>Install & Verify

| Track | Command | Verification | Notes |
| --- | --- | --- | --- |
| Stable (tagged) | `curl -fsSL https://raw.githubusercontent.com/a5c-ai/o/main/install.sh \| bash -s -- --to .` | `shasum -a 256 ./o`, `bash -n ./o` | Weekly tags every Friday. Roll back via `git checkout tags/<tag>`. |
| Nightly | `curl -fsSL ... install.sh \| bash -s -- --to . --nightly` | `./o --version` prints `nightly-<commit>`; `./install.sh --smoke-test` | Auto-published after green CI; rerun stable to undo. |
| Homebrew | `brew tap a5c/tap && brew install o-cli` | `brew info o-cli`, `./o doctor --show-install-hints` | macOS/Linux convenience install. |
| Manual clone | `git clone https://github.com/a5c-ai/o && cd o && chmod +x ./o` | `./o help` | Best for audits or offline work. |

After any install/upgrade, run `./o doctor --show-install-hints` to confirm dependencies and runner CLIs.

## <a id="quickstart"></a>Quickstart

```bash
./o init --global         # writes ~/.a5c/creds.env (use --local for repo-scoped config)
./o doctor --show-install-hints
./o "spec and implement a CLI onboarding flow"
```

Expected artifacts: `.a5c/runs/<id>/inputs.json`, `code/main.js`, `state.json`, `journal.jsonl`, `prompts/`, `work_summaries/`, plus deliverables under `artifacts/`.

Need deeper CLI help or troubleshooting flows? Jump to:
- [USER_GUIDE.md#quickstart](/USER_GUIDE.md#quickstart)
- [USER_GUIDE.md#configuration](/USER_GUIDE.md#configuration)
- [USER_GUIDE.md#copypaste-recipes](/USER_GUIDE.md#copypaste-recipes)

## <a id="cli"></a>Essential CLI Commands

| Command | Purpose | Tips |
| --- | --- | --- |
| `./o init [--global|--local|--file PATH]` | Create/update creds + config | Defaults to `~/.a5c/creds.env`. Use `--local` for repo-scoped config or `--file` for explicit paths. |
| `./o doctor --show-install-hints` | Validate setup | Prints missing runner instructions; useful before long runs or CI promotions. |
| `./o [--global|--local|--file PATH] "request"` | Run an orchestration | Generates a fresh run folder; use CLI flags to select creds per invocation. |
| `./o help` | CLI usage | Shows the full command matrix and flag descriptions. |

## <a id="usage"></a>Usage & Docs at a Glance

| Topic | Where to look | Quick link |
| --- | --- | --- |
| Core CLI flags | `./o help`, [`USER_GUIDE.md`](/USER_GUIDE.md#cli-overview) | `./o --help` |
| Credentials | `~/.a5c/creds.env` or `.a5c/creds.env` | `./o init --global` / `./o init --local` |
| Custom runners | `.a5c/functions/`, `USER_GUIDE.md#runner-presets` | `./o doctor --show-install-hints` |
| Process library | `.a5c/processes/` | `rg --files .a5c/processes` |
| Extended docs | `README.contributing.md`, `README.operations.md`, `README.support.md`, `README.security.md`, `README.faq.md`, `USER_GUIDE.md`, `INSTALL.md` | `./o "open docs"` |

## <a id="architecture"></a>Architecture Snapshot

- **CLI entrypoint (`./o`)** -- dispatches work to the selected process and records results.
- **`.a5c/functions/`** -- Markdown templates describing reusable actions (`act`, `score`, `plan`, etc.).
- **`.a5c/processes/`** -- JavaScript workflows for roles (technical writing, release prep, bug fixes).
- **`.a5c/runs/<id>/`** -- per-request audit folders containing inputs, journal, state, prompts, work summaries, and artifacts.
- **`.a5c/orchestrator_scripts/`** -- helper scripts that keep prompts, CLI commands, and journal updates consistent across platforms.

## <a id="more"></a>More References

- Contribution workflow: [`README.contributing.md`](./README.contributing.md)
- Operations runbooks and release cadence: [`README.operations.md`](./README.operations.md)
- Community/support touchpoints: [`README.support.md`](./README.support.md)
- Security + disclosure process: [`README.security.md`](./README.security.md)
- FAQ / troubleshooting: [`README.faq.md`](./README.faq.md)

---
Need even more depth? Jump to [USER_GUIDE.md](/USER_GUIDE.md) (concepts + recipes) and [INSTALL.md](/INSTALL.md) (environment setup).
