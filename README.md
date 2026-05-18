# personal-coach

This repository stores my personal learning coach system and my own learning outputs.

It does not contain BIOS source code, company code, build scripts, or large original study materials. Local code repositories and raw IELTS materials stay on this Mac and are used only as read-only references.

## Main Areas

- `LearningCoach/`: Markdown-based coach system, subagents, workflows, roadmaps, notes, exams, and logs.
- `LearningCoach/references/source-index.md`: local-only reference index for BIOS code and old learning assets.
- `CHANGELOG.md`: every upload must record changed files, intent, and excluded local-only materials.

## Upload Rule

Before each commit or push:

1. Update `CHANGELOG.md`.
2. Run `git status --ignored --short`.
3. Confirm `code-repositories/`, `data/`, and `english/ielts/` are ignored.
4. Commit only coach system files, personal notes, templates, exams, and logs.

## First Learning Prompt

```text
今天我想学习 Type9 里 UpdateSmbiosType9TableSysSlot 如何从 PCIe RootBridge 生成 SMBIOS Type9，请按 daily-learning-loop 带我学。
```

