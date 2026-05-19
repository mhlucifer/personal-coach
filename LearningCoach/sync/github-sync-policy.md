# GitHub Sync Policy

This repository is the shared memory layer for the company Mac and the Windows desktop.

## Goal

Use GitHub to share safe learning state across devices:

- coach rules
- roadmaps
- workflows
- templates
- exam banks
- safe notes
- weakness and question logs
- shared memory

## Same Strategy On Both Devices

Both devices must follow the same rules:

1. Pull before starting a session.
2. Keep raw materials in ignored local-only folders.
3. Update `CHANGELOG.md` before every upload.
4. Run `git status --ignored --short`.
5. Confirm source trees and local materials are ignored.
6. Commit only GitHub-safe memory.
7. Push after the session if shared memory changed.

## Local-Only Material

Each device can have its own local source trees and documents. They do not need identical paths.

Never upload:

- `code-repositories/`
- `data/`
- `english/ielts/`
- `local-materials/`
- `LearningCoach/local/`
- `LearningCoach/inbox/`
- `LearningCoach/references/private/`

Also never upload raw non-public vendor material:

- Intel BWG / EDS / register specifications
- customer-team or platform-enablement PDFs
- copied tables, register definitions, or large document excerpts
- screenshots containing internal paths, customer data, board details, or document text

## Shared Memory Rule

Use `LearningCoach/logs/shared-memory.md` for cross-device continuity. Keep it short and safe:

- current focus
- paused topics
- active weaknesses
- next action
- recent decisions

## NDA / Vendor Document Rule

For non-public documents, use AI assistance only through safe prompts:

- ask about concepts or relationships
- provide chapter names or keywords
- provide short paraphrases in your own words
- ask for a study plan or mental model

Avoid sending raw pages, full sections, copied tables, or exact register text.

