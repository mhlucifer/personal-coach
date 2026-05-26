# BIOS Debug Casebook

This is the index for reusable BIOS troubleshooting cases. The goal is to turn each incident into durable debugging capability: what happened, how we narrowed it down, what code paths mattered, and what to try next time.

## Case Index

| ID | Date | Area | Status | Symptom | Main Lesson | Case Note |
| --- | --- | --- | --- | --- | --- | --- |
| DBG-001 | 2026-05-20 | FVB / StandaloneMM / SMBIOS changes | Parked, not reproducible | `FwBlockServiceStandaloneMm.c` ASSERT and page fault after Type2 AssetTag / Type11 TDX related image changes | Separate source-change suspicion from machine-local flash/FV/NVRAM state; capture failing FV base address next time | [FVB StandaloneMM ASSERT](./fvb-standalonemm-assert-type11-assettag-case.md) |
| DBG-002 | 2026-05-25 | SMBIOS Type45 | Verified fixed | `dmidecode -t 45` showed BMC/TPM Type45 but no BIOS Firmware Type45 / BIOS version | Split Type45 producers first; BIOS Type45 is static table plus limited `DynamicUpdateBiosFirmwareInfo()` patching, so field values may come from different sources | [Type45 BIOS firmware version missing](./type45-bios-firmware-version-missing.md) |

## Case Rules

- Keep raw BIOS source trees, screenshots, private logs, and vendor docs local-only.
- Store only safe summaries, code paths, commands, reasoning steps, and lessons in GitHub.
- Each case should be self-contained enough to help on a different machine months later.
- Prefer exact function names and file paths over vague descriptions.
- For unresolved issues, record the next best capture point instead of forcing a fake conclusion.

## Reusable Debugging Patterns

### Static vs Dynamic SMBIOS

When a SMBIOS record is partly present, search visible strings from `dmidecode` first.

```sh
rg -n "\"BMC Firmware\"|\"TPM Firmware\"|\"BIOS Firmware\"" <bios-root>
```

- String in `.c` plus `SmbiosProtocol->Add()` usually means dynamic runtime generation.
- String in `.dt` / `.sdl` plus `#if TOKEN` usually means static build-time table generation.
- For static records, trace SDL defaults and platform/project overrides before trusting a package default.
- Some records are hybrid: the static table creates the base record, then runtime code patches only selected fields. For Type45 BIOS Firmware, `DynamicUpdateBiosFirmwareInfo()` patches Firmware ID, Release Date, and Associated Component Handle, but not Firmware Version, Manufacturer, or Image Size.

### ASSERT Near Platform Infrastructure

When an ASSERT lands in a shared platform service, avoid jumping straight to the latest feature change. First identify what the ASSERT means locally:

- What `Status` or pointer failed?
- What data structure was being parsed?
- Is the failing state produced by code, flash contents, NVRAM, HOBs, or build layout?
- Does cold reset, full flash, or NVRAM clear change reproducibility?

For FVB/flash cases, the next useful data point is often a base address, region name, or FV header dump.
