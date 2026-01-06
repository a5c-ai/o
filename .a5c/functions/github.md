# github()

You are an execution agent running inside the target repo.

This verb is for general-purpose GitHub automation using the GitHub CLI (`gh`) only: issues, pull requests, releases, and GitHub Actions.

## CLI-only constraint
`github()` must operate via `gh` commands and their output. Do not provide direct GitHub API integration guidance (REST/GraphQL/SDKs) or non-CLI instructions as the primary method.

## When to use
- The task involves GitHub work: file/triage issues, review/merge PRs, publish releases, or interact with Actions.
- You need a reusable workflow: discover -> act -> verify, driven by `gh`.

## Preconditions
- `gh` is installed and available on PATH.
- You are authenticated: `gh auth status` (log in with `gh auth login` if needed).
- You are in the correct repo root (or pass `--repo OWNER/REPO` to `gh` commands).

## Safe default constraints
- Prefer the smallest correct change set.
- Don't rewrite published history or delete remote data unless explicitly requested.
- Don't bypass required checks/protections unless explicitly requested.

## Issues
- Discover:
  - `gh issue list --state open --limit 50`
  - `gh issue view <number> --comments`
- Act:
  - `gh issue create --title "..." --body "..." --label bug`
  - `gh issue edit <number> --add-label "triage" --add-assignee "@me"`
- Verify:
  - `gh issue view <number> --json state,labels,assignees,url`

## Pull requests
- Discover:
  - `gh pr list --state open --limit 50`
  - `gh pr view <number> --comments --checks`
- Act:
  - `gh pr checkout <number>`
  - `gh pr review <number> --approve` (or `--request-changes -b "..."`)
  - `gh pr merge <number> --merge --delete-branch` (use `--squash` / `--rebase` if requested)
- Verify:
  - `gh pr view <number> --json state,mergeable,merged,baseRefName,headRefName,url`

## Releases
- Discover:
  - `gh release list --limit 20`
  - `gh release view <tag> --json tagName,isDraft,isPrerelease,publishedAt,url`
- Act:
  - `gh release create <tag> --title "..." --notes "..."` (add `--draft` if requested)
  - `gh release upload <tag> <path-to-asset>`
- Verify:
  - `gh release view <tag> --json url,publishedAt,assets`

## GitHub Actions
Actions are one capability among others (alongside issues/PRs/releases).
- Discover:
  - `gh workflow list`
  - `gh run list --limit 20`
- Inspect:
  - `gh run view <run_id> --json status,conclusion,event,headSha,headBranch,workflowName,url,createdAt,updatedAt`
  - `gh run view <run_id> --log-failed`
  - `gh run download <run_id> -D .tmp/gh-artifacts` (if needed)
- Act:
  - `gh run rerun <run_id> --failed`
  - `gh run watch <run_id>`

## Deliverable (what to report back)
- What you discovered (issue/PR/release/run IDs and relevant `gh` output)
- What you changed (and files changed, if any)
- How you verified (the exact `gh ...` commands and their outcomes)
