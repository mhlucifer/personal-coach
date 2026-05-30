# BIOS Debug Casebook

This is the index for reusable BIOS troubleshooting cases. The goal is to turn each incident into durable debugging capability: what happened, how we narrowed it down, what code paths mattered, and what to try next time.

## Case Index

| ID | Date | Area | Status | Symptom | Main Lesson | Case Note |
| --- | --- | --- | --- | --- | --- | --- |
| DBG-001 | 2026-05-20 | FVB / StandaloneMM / SMBIOS changes | Parked, not reproducible | `FwBlockServiceStandaloneMm.c` ASSERT and page fault after Type2 AssetTag / Type11 TDX related image changes | Separate source-change suspicion from machine-local flash/FV/NVRAM state; capture failing FV base address next time | [FVB StandaloneMM ASSERT](./fvb-standalonemm-assert-type11-assettag-case.md) |
| DBG-002 | 2026-05-25 | SMBIOS Type45 | Verified fixed | `dmidecode -t 45` showed BMC/TPM Type45 but no BIOS Firmware Type45 / BIOS version | Split Type45 producers first; BIOS Type45 is static table plus limited `DynamicUpdateBiosFirmwareInfo()` patching, so field values may come from different sources | [Type45 BIOS firmware version missing](./type45-bios-firmware-version-missing.md) |
| DBG-003 | 2026-05-27 | Boot flow / BDS / Boot Retry | New, not analyzed | `Boot Retry = Enabled` and no boot devices installed leads to black screen instead of setup option interface | Separate no-boot-option, failed-boot-option, and retry-loop states before choosing a fix | [Boot Retry enabled no-device black screen](./boot-retry-enabled-no-device-black-screen.md) |
| DBG-004 | 2026-05-28 | SMBIOS Type41 / PCI labels | Initial analysis | One of two same-model PCIe M.2 devices shows an extra `DeviceName` in `lspci -vvv` | Match Type41 `SegmentGroupNum:Bus:DevFunc` to PCI domain/BDF; do not hardcode segment on multi-segment systems | [Type41 M.2 extra DeviceName](./type41-m2-extra-devicename.md) |
| DBG-005 | 2026-05-28 | SMBIOS Type17 / memory strings | Initial analysis | One DIMM record intermittently shows Intel/base default locator, asset tag, and serial-related strings after reboot testing | If several Type17 strings stay default together, suspect the record was not hit by the post-update pass, not only a string formatter bug | [Type17 locator reverts to Intel default](./type17-dimm-locator-reverts-to-intel-default.md) |
| DBG-006 | 2026-05-30 | HSTI / security policy / POST warning | Mechanism clarified | POST prints `Firmware Vendor (IBV) detected errors` | The header is only a role summary; the detailed error code/string maps to the concrete HSTI check. `AmiPcdHstiErrorAction` controls display behavior, not whether the security check passes. | [HSTI Firmware Vendor IBV detected errors](./hsti-firmware-vendor-ibv-detected-errors.md) |

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

### Boot Retry / No Boot Device

When a no-device boot issue appears only with Boot Retry enabled, separate these cases before chasing code:

- No boot options exist.
- Boot options exist but all are invalid or fail.
- Boot retry is looping on a stale or invalid boot target.

The screen symptom can be identical, but the BDS branch and fix can be different.

### SMBIOS Post-Update Miss

When several fields in the same SMBIOS record keep base/default strings, do not debug only the visible field. First ask whether the record was reached by the post-update module at all.

For Type17, useful split points are:

- Did `SmbiosProtocol->GetNext()` enumerate the bad handle?
- Did the loop map that handle to the expected `Socket/Channel/Dimm`?
- Did every `UpdateString()` return success?
- Did another module overwrite the record after the update?

Stable identity should beat implicit order. Prefer a pre-assigned handle, a parsed default locator, or generating the final string at the table creation source over assuming "the next Type17 record equals the next logical DIMM".

### SMBIOS Type41 / PCI DeviceName

When only one of multiple same-model PCIe devices shows `DeviceName`, inspect SMBIOS Type41 before assuming the device is special.

Type41 maps a human-readable `ReferenceDesignation` to PCI identity through:

```text
SegmentGroupNum + BusNum + DevFuncNum
```

On a multi-segment platform, `Bus:Device.Function` alone is not globally unique. A hardcoded segment can make Type41 accidentally label an unrelated PCI device.
