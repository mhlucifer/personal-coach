# Shared Memory

This file is safe common memory for the company Mac and Windows desktop.

## Current Decisions

- SMBIOS, Type9, and Type41 are paused as default learning topics.
- Updated SMBIOS material will be classified later before that topic returns.
- Current learning direction is CXL-first PCIe spine.
- Raw documents and high-value work materials stay local-only and are not uploaded.
- GitHub sync is for safe memory, rules, logs, templates, and personal summaries.
- Non-public Intel/BWG/EDS/register-spec materials stay in ignored local-only folders.
- AI help may use topic names, chapter names, short paraphrases, and narrow questions;
  do not upload full PDFs, copied tables, register definitions, screenshots, or large excerpts.

## Current Focus Pool

- CXL device discovery through PCIe
- PCIe BDF / config space / capabilities needed for CXL
- CXL.io / CXL.cache / CXL.mem mental model
- HDM Decoder and CXL memory exposure
- platform boot and data flow
- HOB / PCD / config path
- PCIe topology and resource/debug reasoning
- build inclusion and override chain
- failure localization and verification strategy

## Next Action

Start with:

```text
Why is a CXL device first discovered as a PCIe device through BDF and Config Space?
```

Use `roadmap/cxl-roadmap.md` and `workflows/cxl-first-pcie-spine.md`.

## Cross-Device Privacy Rule

Both Windows and Mac follow the same boundary:

```text
local-only evidence -> own summary -> safe GitHub memory
```

Use local files for evidence, but sync only learning strategy, indexes, questions,
weakness logs, and summaries written in your own words.
