# BIOS Roadmap

This roadmap is work-problem driven. Do not use it as a textbook checklist.

## Level 0: BIOS Code Survival

- Read functions, structs, macros, logs, config tables.
- Follow a local call chain.
- Identify data source and output target.
- Know where to add debug logs without changing behavior.

## Level 1: UEFI Runtime Model

- PEI, DXE, and SMM basic responsibilities.
- Driver entry and dependency expression.
- Protocol, HOB, PCD, event, and callback.
- Locate where a module runs and why it runs then.

## Level 2: Platform Data Flow

- BoardId, SKU, FRU, GPIO, SMBus, HOB, and PCD.
- Static config vs dynamic detection.
- How board differences enter final tables.

## Level 3: SMBIOS

- Type0, Type1, Type2, Type3, Type4, Type9, Type11, Type17, Type41.
- Table generation flow, string area, handle, and update/delete behavior.
- `dmidecode` verification.
- Current status: paused as a default learning focus. Return only after updated materials arrive or a current task requires it.

## Level 4: PCIe / PCI Enumeration

- BDF, Root Port, Downstream Port, Bridge.
- Secondary and Subordinate Bus.
- PCI IO Protocol and config-space reads.
- Link Width, Link Speed, Option ROM, Hotplug, and resource padding.

## Level 5: Debug And Modification Ability

- Add logs at data source, transformation, and output.
- Compare BIOS log, `dmidecode`, and `lspci`.
- Decide whether an issue is in enumeration, config, table generation, or display.
- Write a low-risk modification plan.

## Level 6: Owner Ability

- Design a platform-level solution.
- Govern multi-board data.
- Refactor config tables safely.
- Create review checklists for customer issues and version support.

## Current Priority

Until new materials say otherwise, prioritize higher-value BIOS owner skills:

- platform boot/data flow
- HOB and PCD usage
- PCIe topology and resource/debug reasoning
- build inclusion and override relationships
- failure localization and verification strategy
