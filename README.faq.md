# README Addendum -- FAQ & Troubleshooting

- **WSL vs native Windows?** Use WSL2. Native Bash variants (Git Bash, MSYS2) can miss `mktemp` and other POSIX tools.
- **`config not found`?** Run `./o init --global` (default path `~/.a5c/creds.env`) or set `O_CREDS_FILE=/path/to/creds.env`. Ensure `chmod 600` on the creds file.
- **Runner missing?** `./o doctor --show-install-hints` prints installation commands for codex, claude-code, gemini, and custom runners.
- **Where are logs?** `.a5c/runs/<id>/journal.jsonl` plus `prompts/` and `work_summaries/`. Scrub secrets before sharing.
- **How do I override config for one run?** Use `./o --file /absolute/path/to/creds.env "request"` or set `O_CREDS_FILE` in the shell session.
