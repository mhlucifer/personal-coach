# Bug Window Sync Rules

Date: 2026-05-25

Purpose: preserve BIOS/debug troubleshooting results in a way that is easy to find from GitHub `main`, even if a future chat window has no memory of this conversation.

## Role of This Window

This window is for bug/debug work:

- BIOS issue triage
- SMBIOS / setup / firmware table debugging
- ASSERT and boot failure analysis
- casebook updates after a bug is understood or fixed

Learning plans, CXL study flow, IELTS work, and broad coaching memory should stay in the learning/coaching window unless the user explicitly asks to record a debug lesson here.

## Source of Truth

GitHub `main` is the source of truth for durable debug notes.

Do not leave important debug knowledge only on a temporary branch. The user should be able to open the repository default branch and see the latest casebook.

## Branch Policy

Temporary branches or temporary worktrees are allowed for isolation, especially when the local `main` worktree has unrelated dirty changes.

Required finish state:

1. Add or update the debug case note.
2. Update `LearningCoach/notes/bios/debug/casebook.md` if this is a new or closed case.
3. Update `CHANGELOG.md` with the change point and not-uploaded scope.
4. Commit the safe Markdown changes.
5. Merge or fast-forward the result back to `main`.
6. Push `main` to GitHub.
7. Delete remote temporary branches unless the user explicitly wants to keep them.

The user should not need to switch branches to see completed debug notes.

## Upload Scope

Safe to upload:

- Markdown case summaries
- code path names and function names
- reasoning steps
- verification commands
- sanitized symptoms and conclusions

Do not upload by default:

- `code-repositories/`
- raw BIOS source trees
- screenshots from machines or BMC/SOL
- private logs
- raw vendor specs or confidential documents
- local working folders such as PPT/build/export scratch directories

If a screenshot proves a result, write a text summary of the important fields instead of uploading the image.

## Casebook Rule

Every meaningful bug should become one case note when possible:

```text
LearningCoach/notes/bios/debug/<short-case-name>.md
```

Each case should answer:

- What was the symptom?
- Which code paths were checked?
- What evidence narrowed the issue down?
- What was the root cause or best current guess?
- What fixed it or what should be captured next time?
- What reusable debugging method did we learn?

Use `_case-template.md` for new issues.

## New Window Reminder

If this file is read in a new Codex window, follow this default workflow:

1. Treat this as the BIOS/debug window.
2. Keep raw/source/private material local-only.
3. Use temporary branch/worktree if needed, but merge finished debug notes back to `main`.
4. Make GitHub `main` the final durable memory.
5. Keep the casebook growing.
