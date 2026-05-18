# Shared Memory

This file is safe common memory for the company Mac and Windows desktop.

## Current Decisions

- SMBIOS, Type9, and Type41 are paused as default learning topics.
- Updated SMBIOS material will be classified later before that topic returns.
- Current learning direction is CXL-first PCIe spine.
- Raw documents and high-value work materials stay local-only and are not uploaded.
- GitHub sync is for safe memory, rules, logs, templates, and personal summaries.

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
