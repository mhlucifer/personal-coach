# LearningCoach Agent Rules

These rules control how AI should help inside this learning system.

## Defaults

- Do not start with long teaching.
- Start by locating the problem in a roadmap.
- Move only one smallest useful knowledge point at a time.
- Keep BIOS real code as the main path.
- Use foundation knowledge only as a patch for a current blockage.
- Do not expand unrelated CS, C++, OS, networking, or firmware courses.
- Every learning session must produce my own explanation.
- Every learning session must end with an exam.
- Every session must update logs or explicitly state why there is nothing to update.
- Do not mix everything into one giant document.

## Subagent Routing

1. `subagents/roadmap-keeper.md` runs first for non-trivial learning questions.
2. If the current task is code reading, use `subagents/bios-code-tutor.md`.
3. If the current block is foundation knowledge, use `subagents/foundation-patch-tutor.md`.
4. End with `subagents/examiner.md`.
5. Persist results through `subagents/memory-keeper.md`.

## BIOS Code Rule

When code is available locally, inspect code before answering. Prefer:

```text
/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami
```

Use `triverv5-ami` only as a typo-friendly symlink.

## Safety Rule

Do not modify BIOS source code, company code, build scripts, `.git`, or old local study assets unless the user explicitly asks.

