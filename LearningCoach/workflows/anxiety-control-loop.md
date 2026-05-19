# Anxiety Control Loop

Use this when the user says things like:

- "这是不是不系统？"
- "我是不是基础太差？"
- "我是不是应该先学 CSAPP/C++/OS？"
- "我感觉学不明白。"
- "这个方向有没有用？"

## Required Answer

1. Anxiety type.
2. Whether it blocks the current task.
3. If it blocks the task, the one smallest patch to learn.
4. If it does not block the task, put it in the later list.
5. Today's next smallest action.

## Course Anxiety Gate

Use this when the anxiety is "I am not learning systematically enough" or
"watching a course may be more efficient."

A course is allowed only when at least one condition is true:

- The same gap blocks three separate sessions.
- The current code, spec, or log cannot be understood without the missing
  concept.
- The gap blocks this week's artifact.

If a course is allowed:

- Write three questions before watching.
- Watch only the relevant chapter.
- Produce one concept card or one verification artifact.
- Stop when the current task is unblocked.

If a course is not allowed:

- Add the anxiety to `logs/questions.md`.
- Return to the current smallest code, log, or spec action.

## Do Not

- Comfort vaguely.
- Recommend a full course before mapping the current task.
- Let anxiety create more scope.
