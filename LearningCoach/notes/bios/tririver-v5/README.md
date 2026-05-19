# TriRiver V5 BIOS Study Index

This folder is the local study entry for TriRiver V5 BIOS work.

## What Lives Here

This folder keeps the public-safe study index.

Detailed local-only notes live under:

```text
LearningCoach/references/private/tririver-v5
```

Subfolders there:

- `smbios-learning-studio`: SMBIOS learning documents, including Type9, Type41,
  SPD CRC retry, and handoff notes.
- `self-learning-import`: imported personal firmware learning notes.
- `codex-shared-references`: reusable BIOS study references, including debug
  playbook, glossary, architecture notes, and build/override maps.

## What Does Not Live Here

The full source tree and raw internal documents are intentionally local-only:

```text
code-repositories/tririverv5-ami
local-materials/tririver-v5/raw-documents
```

Use those as evidence, then write summaries here in your own words.

## Suggested Study Order

1. Read `LearningCoach/references/private/tririver-v5/codex-shared-references/firmware-glossary.md`.
2. Read `LearningCoach/references/private/tririver-v5/codex-shared-references/current-v5-architecture.md`.
3. Study SMBIOS Type9 from `LearningCoach/references/private/tririver-v5/smbios-learning-studio/Type9-Dynamic-Silkprint-Tutor.md`.
4. Study Type41 from `LearningCoach/references/private/tririver-v5/smbios-learning-studio/Type41-PCIIO-BDF-VIDDID-Explanation.md`.
5. Study SPD CRC from `LearningCoach/references/private/tririver-v5/smbios-learning-studio/Spd-Crc-Retry-Teaching.md`.

## Working Rule

For every topic, keep the loop small:

```text
concept -> code entry -> data source -> failure case -> one-page summary
```
