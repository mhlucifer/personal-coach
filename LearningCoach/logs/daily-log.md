# Daily Log

## 2026-05-18

- System: LearningCoach v2 initialized.
- Main route: BIOS code reading.
- Focus update: SMBIOS/Type9/Type41 are paused until updated materials arrive.
- CXL spec received and classified as local-only material.
- First suggested CXL task: learn why CXL devices are first discovered through PCIe BDF and Config Space.

## 2026-05-20 Day 1 Plan

- Official day: Day 1 / W01D1.
- Target status: `C` minimum, `A` if energy allows.
- Topic: why CXL devices are first discovered through PCIe BDF and Config Space.
- Roadmap location: `roadmap/cxl-roadmap.md` Level 0 and `workflows/cxl-first-pcie-spine.md` Session 1.
- Source code / material:
  - `LearningCoach/workflows/cxl-first-pcie-spine.md`
  - `LearningCoach/roadmap/cxl-roadmap.md`
  - `code-repositories/tririverv5-ami/MdePkg/Include/IndustryStandard/Cxl.h`
  - `code-repositories/tririverv5-ami/MdePkg/Include/IndustryStandard/Cxl30.h`
- One smallest point: explain why CXL discovery starts as ordinary PCIe discovery before CXL-specific capabilities matter.

### Minimum `C` Session

1. Locate, 5 minutes: write the real question in one sentence.
2. Learn, 25 minutes: read CXL roadmap Level 0 and workflow Session 1; inspect `Cxl.h` / `Cxl30.h` only for names and structures, not full spec depth.
3. Output, 10 minutes: write five sentences explaining BDF, config space, Vendor ID / Device ID / Class Code, and where CXL-specific discovery begins.
4. Exam, 10 minutes: answer:
   - What is BDF?
   - What is PCI config space used for?
   - Which fields prove a device exists before the OS knows it is CXL?
   - What is PCIe-generic vs CXL-specific?
   - What would `lspci` show before CXL memory is usable?
5. Persist, 5 minutes: update `logs/365-progress.md` with `C` or better.

### Standard `A` Extension

- Trace one local code anchor related to CXL root bridge or PCIe resource exposure.
- Add one concept card for `PCIe discovery -> CXL capability discovery`.
- Record a 2-minute IELTS speaking answer: "Explain CXL to a new firmware engineer."

### Game Gate

- No game before the minimum `C` session is complete.
- If the day starts badly, run `workflows/drift-recovery-loop.md` instead of rewriting the plan.

## Template

- Date:
- Topic:
- Roadmap location:
- Source code / material:
- One smallest point:
- My explanation:
- Exam result:
- Weakness added:
- Next action:
