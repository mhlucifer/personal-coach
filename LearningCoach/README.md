# LearningCoach v2

LearningCoach v2 is a practical study system for BIOS/UEFI work, English learning, AI agent learning, and personal review. Its main path is BIOS code reading.

The rule is simple:

```text
real code problem -> roadmap location -> smallest knowledge patch -> output -> exam -> memory update
```

## How To Use It Daily

Use one of these prompts:

```text
今天我想学习 Type9 里 PciIo 遍历和固定 BDF 的区别，请按 daily-learning-loop 带我学。
```

```text
我看不懂这个函数，请按 code-reading-loop 带我追。
```

```text
我焦虑这个知识点不系统，请按 anxiety-control-loop 帮我定位。
```

## Daily Loop

1. 5 minutes: locate the problem in the roadmap.
2. 25 minutes: learn one code-grounded point.
3. 10 minutes: explain it in my own words.
4. 10 minutes: answer five exam questions.
5. 5 minutes: update log, weakness, and open questions.

## Weekly Review

At the end of each week:

- List what I studied.
- Separate what I can explain from what I only heard.
- Move weak points into `logs/weakness.md`.
- Pick only three priorities for next week.

## Local References

BIOS source code is not stored in this GitHub repository. Use `references/source-index.md` to find local read-only sources.

