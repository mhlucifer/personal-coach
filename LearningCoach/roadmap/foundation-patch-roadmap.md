# Foundation Patch Roadmap

Foundation is not the main path. Use it only when BIOS code reading exposes a specific gap.

## Patch Areas

- C pointer and address basics.
- Struct and struct array access.
- Function pointer and callback.
- Macro expansion and conditional compilation.
- Bit operations and packed fields.
- `enum`, `typedef`, `const`, `static`, and `extern`.
- Compile/link basics for INF, library class, and module inclusion.
- Memory layout for allocated firmware data structures and buffers.
- Debug thinking: observe source, transform, output.
- Basic lists and arrays used in firmware code.

## Depth Rule

For each patch, stop after the user can explain the current code line or block. Deeper study goes to `logs/questions.md` unless it blocks today's task.
