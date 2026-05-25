# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a GitHub issue, reporting a bug, or requesting a feature. | issue-creation | C:\Users\EduardoChami\.config\opencode\skills\issue-creation\SKILL.md |
| When creating a pull request, opening a PR, or preparing changes for review. | branch-pr | C:\Users\EduardoChami\.config\opencode\skills\branch-pr\SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | C:\Users\EduardoChami\.config\opencode\skills\go-testing\SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". | judgment-day | C:\Users\EduardoChami\.config\opencode\skills\judgment-day\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### issue-creation
- Blank issues are disabled — MUST use a template (bug report or feature request)
- Every issue gets `status:needs-review` automatically on creation
- A maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, not issues
- Search existing issues for duplicates before creating new ones
- Bug Report auto-labels: `bug`, `status:needs-review`; Feature Request: `enhancement`, `status:needs-review`
- Use `gh issue create --template` with proper template selection

### branch-pr
- Every PR MUST link an approved issue with `Closes/Fixes/Resolves #N` — no exceptions
- Every PR MUST have exactly one `type:*` label (type:bug, type:feature, type:docs, type:refactor, type:chore, type:breaking-change)
- Branch names MUST match: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Commit messages MUST follow conventional commits: `^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+`
- Run shellcheck on modified scripts before pushing
- PR body must contain: linked issue, PR type checkbox, summary (1-3 bullets), changes table, test plan, contributor checklist
- Never add `Co-Authored-By` trailers to commits

### go-testing
- Use table-driven tests for pure functions with multiple cases
- Test Bubbletea Model state transitions directly via `m.Update(msg)` — no teatest needed for simple state tests
- Use `teatest.NewTestModel()` for full TUI flow integration tests with key sequences
- Use golden file testing for visual output comparison (`-update` flag to regenerate)
- Mock system dependencies via interfaces; use `t.TempDir()` for file operations
- Test both success and error cases for functions returning errors
- File organization: `*_test.go` mirrors source files; `testdata/` for golden files
- Commands: `go test ./...`, `go test -cover ./...`, `go test -short ./...` (skip integration)

### judgment-day
- Launch TWO judge sub-agents in parallel via `delegate` (async) — never sequential, never do the review yourself
- Neither judge knows about the other — no cross-contamination between delegations
- Resolve skills BEFORE launching judges: read registry → match by code/task context → inject `## Project Standards (auto-resolved)` block
- Orchestrator synthesizes verdict: confirmed (both agree), suspect (only one), contradiction (disagree)
- WARNING classification: `WARNING (real)` = normal user can trigger; `WARNING (theoretical)` = requires contrived scenario → report as INFO, do NOT fix
- After Fix Agent returns, IMMEDIATELY re-launch judges in parallel for re-judgment — never push/commit before re-judgment completes
- After 2 fix iterations, ASK user before continuing — never escalate automatically
- NEVER declare `JUDGMENT: APPROVED` until: Round 1 clean OR Round 2 has 0 confirmed CRITICALs + 0 confirmed real WARNINGs
- NEVER run git push/commit after fixes until re-judgment completes

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | C:\Users\EduardoChami\Desktop\edchami webpage\AGENTS.md | Index — Next.js agent rules with breaking change warnings |
