# personal-coach

This repository stores my personal learning coach system and my own learning outputs.

It does not contain BIOS source code, company code, build scripts, or large original study materials. Local code repositories and raw IELTS materials stay on this Mac and are used only as read-only references.

## Main Areas

- `LearningCoach/`: Markdown-based coach system, subagents, workflows, roadmaps, notes, exams, and logs.
- `LearningCoach/references/source-index.md`: local-only reference index for BIOS code and old learning assets.
- `LearningCoach/sync/`: GitHub sync rules for using this coach from both the company Mac and the Windows desktop.
- `CHANGELOG.md`: every upload must record changed files, intent, and excluded local-only materials.

## Upload Rule

Before each commit or push:

1. Update `CHANGELOG.md`.
2. Run `git status --ignored --short`.
3. Confirm `code-repositories/`, `data/`, and `english/ielts/` are ignored.
4. Confirm local high-value documents stay under ignored local-only folders.
5. Commit only coach system files, safe shared memory, personal notes, templates, exams, and logs.

## First Learning Prompt

```text
今天从 CXL-first PCIe Spine 开始：先学为什么 CXL 设备首先通过 PCIe BDF 和 Config Space 被发现，请按 daily-learning-loop 带我学。
```
