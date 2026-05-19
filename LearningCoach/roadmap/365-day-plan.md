# 365-Day Plan

Period: 2026-05-20 to 2027-05-19.

This plan is intentionally challenging. It is not designed around perfect days.
It is designed around visible output, weekly recovery, and hard quarterly
deliverables.

## North Star

Become a server platform firmware engineer with a transferable specialty in:

```text
IIO / PCIe spine -> CXL handoff -> RAS evidence chain
```

C, OS, Python, AI, and IELTS are support systems for this main route. They are
not separate hobbies.

## Annual Deliverables

- Current platform IIO/CXL topology map.
- PCIe enumeration and resource allocation explanation, grounded in code and
  logs.
- CXL ACPI handoff checklist: CEDT, CHBS, CFMWS, SRAT, HMAT, SLIT, DSDT.
- Two complete IIO/PCIe/CXL/RAS RCA writeups from real or reconstructed cases.
- `CXL/RAS Firmware Triage Toolkit` prototype.
- Three English technical notes.
- IELTS full mock or official exam result, with a path to 7.0.

## Difficulty Model

The plan has three levels. Use all three.

| Level | Meaning | Weekly requirement |
|---|---|---|
| Floor | Do not disappear | 5 daily records, 1 small output, 1 review |
| Standard | Real progress | 3 outputs: BIOS note, tool/code work, IELTS output |
| Challenge | Career-changing work | 1 monthly demo or serious RCA, 1 quarterly hard artifact |

The year is successful if the standard line is met most weeks and every quarter
produces a hard artifact. It does not require 365 perfect days.

## Daily Status

Use one status per day in `logs/365-progress.md`.

| Status | Definition |
|---|---|
| S | Challenge day: 3.5 to 5 hours and visible output |
| A | Standard day: 2 to 3 hours and at least one task finished |
| C | Recovery day: 45 to 60 minutes, no zero |
| 0 | No meaningful learning record |

Rules:

- `C` is allowed.
- `0` is allowed, but two consecutive `0` days trigger the drift recovery loop.
- Games are allowed only after the day's three minimum tasks are complete.
- Do not compensate after midnight. Record the miss and recover tomorrow.

## Year Phases

### Q1: Build the Spine

Months: 2026-05-20 to 2026-08-19.

Focus:

- Boot and UEFI phase model.
- PCIe enumeration, BDF, BAR, bus number, bridge window.
- C for firmware: pointer, struct, bit operation, alignment, macro.
- IELTS diagnosis and base routine.

Deliverables:

- Boot phase and PCI enumeration map.
- `lspci -vvxxx` decode report.
- ACPI dump note for MCFG, SRAT, SLIT, HMAT, DSDT.
- First IELTS diagnosis table.

### Q2: Make It Platform-Specific

Months: 2026-08-20 to 2026-11-19.

Focus:

- IIO stack, root port, slot mapping, bifurcation.
- PCIe AER, hotplug, DPC, ownership, resource failure.
- Linux handoff: `/proc/iomem`, `dmesg`, sysfs, NUMA, IOMMU.
- Python CLI for hardware evidence collection.

Deliverables:

- Current platform IIO topology table.
- PCIe error RCA template.
- I/O and NUMA evidence report.
- Python script that collects PCIe, ACPI, dmesg, and platform summary data.

### Q3: CXL And AI Tooling

Months: 2026-11-20 to 2027-02-19.

Focus:

- CXL.io/cache/mem, Type 1/2/3, DVSEC, HDM decoder.
- CEDT, CHBS, CFMWS, SRAT, HMAT, SLIT, DSDT handoff.
- CXL Linux flow: cxl-cli, DAX/kmem, memory tier, common failure modes.
- RAG and agent basics, only with materials allowed for AI processing.

Deliverables:

- CXL discovery note.
- CXL ACPI handoff checklist.
- CXL bring-up checklist.
- Triage toolkit prototype with at least 10 evaluation cases.

### Q4: RCA, Portfolio, IELTS Finish

Months: 2027-02-20 to 2027-05-19.

Focus:

- Two deep real or reconstructed RCA cases.
- RAS evidence chain: AER, GHES, EDAC, MCE, rasdaemon, dmesg.
- Toolkit hardening and eval.
- IELTS final mock or official exam.
- English technical notes and interview stories.

Deliverables:

- Two full RCA writeups.
- `CXL/RAS Firmware Triage Toolkit` demo.
- Three English notes:
  - PCIe AER RCA.
  - CXL ACPI checklist.
  - IIO topology and performance analysis.
- Next-year direction decision.

## Monthly Themes

| Month | Technical theme | Tool/CS theme | IELTS theme | Main artifact |
|---|---|---|---|---|
| M1 | Boot + PCIe enumeration skeleton | C for firmware basics | Diagnosis | Boot + PCIe map |
| M2 | BDF, BAR, bus, bridge window | OVMF/EDK II demo | Reading/listening routine | `lspci` decode |
| M3 | ACPI basics | Python parser v0 | Task 2 paragraph | ACPI dump note |
| M4 | IIO topology | Tree/graph/interval basics | Technical summary | IIO topology table |
| M5 | AER/DPC/hotplug | CLI + SQLite | Speaking recording | PCIe RCA template |
| M6 | NUMA I/O and IOMMU | OS memory/DMA | Half mock | I/O evidence report |
| M7 | CXL protocols and types | RAG basics | Reading/listening 7 target | CXL discovery note |
| M8 | CEDT/CHBS/CFMWS | ACPI checker | Weekly writing feedback | CXL ACPI checklist |
| M9 | CXL RAS/hotplug | Agent + eval | Speaking mock | CXL bring-up checklist |
| M10 | Real ticket RCA 1 | Toolkit v1 | Full mock | RCA writeup 1 |
| M11 | Real ticket RCA 2 | Toolkit eval | Exam sprint | RCA writeup 2 |
| M12 | Portfolio and gaps | Toolkit demo | Exam or final mock | English notes + demo |

## Weekly Operating System

Default week:

- Monday: C for firmware, 90 minutes. IELTS listening, 30 minutes.
- Tuesday: BIOS/IIO code trace, 90 minutes. IELTS reading, 30 minutes.
- Wednesday: Python or algorithm tool work, 90 minutes. Speaking recording,
  15 minutes.
- Thursday: CXL/ACPI/Linux document and code bridge, 90 minutes. English
  technical summary.
- Friday: AI/RAG/eval, 90 minutes. IELTS writing paragraph or essay.
- Saturday: Project block, 3 to 5 hours.
- Sunday: Weekly review, 45 to 60 minutes.

Weekly outputs:

- One BIOS/IIO/CXL note.
- One code/tool experiment.
- One IELTS output.
- One review entry.

## Course Anxiety Rule

Do not start a full course because of anxiety.

Use a course only when one of these is true:

- The same gap blocks three separate sessions.
- The current code/spec/log cannot be understood without the missing concept.
- The missing concept blocks a weekly artifact.

When using a course:

- Write three questions before watching.
- Watch only the needed chapter.
- Produce one concept card or one verification artifact.
- Stop when the current task is unblocked.

## Success Criteria

By the end of the year, you should be able to explain and demonstrate:

- How a CXL device is first discovered as a PCIe device.
- How BIOS resource allocation affects OS enumeration.
- How ACPI tables expose CXL and NUMA information.
- How to separate BIOS, hardware, device, OS, and silicon reference code
  responsibility.
- How AI can help triage logs without replacing evidence-based debugging.
