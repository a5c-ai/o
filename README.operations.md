# README Addendum -- Operations & Runbooks

## Maintenance Runbooks

| Runbook | Owner | Trigger | Output |
| --- | --- | --- | --- |
| `./o doctor --show-install-hints` audit | Ops/Platform | Weekly or after runner upgrades | Updated hints committed to `INSTALL.md` |
| Installer smoke replay | Release Engineering | Pre-tag + nightly | `./install.sh --smoke-test` log stored under `.a5c/runs/<id>/artifacts` |
| README/guide refresh | Technical Writing + QE | Every docs update | Latest run artifacts summarized and linked |
| Incident escalation | Maintainers | Sev-1 bug or security report | Dedicated issue + Discord bridge with response template |

## Release Cadence
- **Stable tags**: cut every Friday 17:00 UTC. Use `git checkout tags/<tag>` to roll back.
- **Nightly builds**: published automatically after every green CI run; `./o --version` prints `nightly-<commit>`.
- **CI workflows**: `bash lint` and `installer smoke` must stay green; corresponding badges live near the top of the README.

## Ops Tips
- Re-run `./o doctor --show-install-hints` whenever OS images, runner CLIs, or credentials change.
- Keep `.a5c/runs/<id>/journal.jsonl` and `state.json` around until a release is finalized so you can audit or resume unfinished work.
- Capture environment diffs (OS, shell, runner versions) inside `run_summary.json` for reproducibility.
