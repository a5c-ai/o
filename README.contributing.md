# README Addendum -- Contributing

Keep this next to the compact README so maintainers can link detailed contribution expectations without bloating the landing page.

## Contribution Pathways
1. **Open an issue** describing scope, constraints, and "done" signals. Use templates to capture acceptance criteria.
2. **Pick a `good first issue`** from [GitHub labels](https://github.com/a5c-ai/o/labels/good%20first%20issue); each curated issue links to prior `.a5c/runs/<id>/` folders for reproducibility.
3. **Run the contributor checklist** before every PR:
   - `bash -n ./o`
   - `bash -n ./install.sh`
   - `./install.sh --smoke-test`
   - `./o doctor --show-install-hints`
4. **Open the PR** linking to your `.a5c/runs/<id>/` folder (prompts, work summaries, validation logs) so reviewers can audit decisions.

## Documentation + Handoff Expectations
- Update `README.md`, `INSTALL.md`, and `USER_GUIDE.md` whenever behavior, flags, or workflows change.
- Surface breaking changes in `USER_GUIDE.md#what-you-can-do-with-o-today` and in release notes.
- Attach `run_summary.json` (if produced) or a manual summary covering validation commands, promotion steps, and follow-ups.
