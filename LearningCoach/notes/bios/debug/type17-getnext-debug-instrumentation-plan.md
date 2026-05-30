# Type17 GetNext pure debug instrumentation plan

Date: 2026-05-29

Purpose: provide a temporary, observation-only debug patch plan for the intermittent Type17 issue where one DIMM record keeps Intel/base default strings such as `CPU0_DIMM_CH15S0`, `_AssetTag`, and default serial information.

This document is meant to be handed to an internal coding model or engineer. It describes where to add debug logs and how to interpret the next reproduction.

Important principle: this version must not change runtime behavior. It must only print values that already exist on the current execution path.

## Problem Summary

Observed symptom:

- After long reboot testing, one Type17 record occasionally keeps default strings.
- The affected record shows not only default `DeviceLocator`, but also default `AssetTag` and `SerialNumber`.
- This means the record was likely not covered by the Tencent Type17 update pass, or the update failed invisibly.

Current highest-risk suspicion:

```c
EFI_SMBIOS_HANDLE SmbiosHandle;
```

In `TencentType17Update.c`, `SmbiosHandle` appears to be declared but not initialized before the first `SmbiosProtocol->GetNext()` call.

For PI SMBIOS `GetNext()`, the expected first input handle is:

```c
SMBIOS_HANDLE_PI_RESERVED   // normally 0xfffe
```

If the first input handle is an uninitialized stack value, `GetNext()` may treat it as "find record after this handle" instead of "find the first Type17 record". That can cause intermittent skip or cursor mismatch.

This debug version must only verify that suspicion. Do not initialize or repair `SmbiosHandle` in this patch.

## Files To Instrument

Use temporary debug only. Do not keep noisy logs in the final production patch.

1. `TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType17Update/TencentType17Update.c`
2. `TencentLegoPkg/Library/TencentSmbiosUpdateLib/TencentSmbiosUpdateLib.c`
3. `AmiCompatibilityPkg/Smbios/Smbios.c`

## Debug Tags

Use stable tags so logs can be searched easily:

```text
[T17DBG]
[SMBGET17]
[T17DBG][ERROR]
```

Recommended debug level:

```c
DEBUG_INFO
```

Use `DEBUG_ERROR` only for abnormal or final error summaries.

## Non-Invasive Rules

The goal is to reproduce the original failure. Therefore:

- Do not initialize `SmbiosHandle`.
- Do not change `GetNext()` branch logic.
- Do not change `UpdateString()` inputs.
- Do not change Type17 mapping logic.
- Do not add fallback logic.
- Do not add a final full SMBIOS table rescan in the first debug version.
- Do not convert any existing `continue`, `return`, or error handling path.
- Temporary local variables used only for logging are allowed.
- Logging return status from existing calls is allowed.

Bad for this debug version:

```c
SmbiosHandle = SMBIOS_HANDLE_PI_RESERVED;
```

Good for this debug version:

```c
InHandle = SmbiosHandle;
DEBUG ((DEBUG_INFO, "[T17DBG] GetNext InHandle=0x%04x\n", InHandle));
```

## Change 1: Add Type17 Caller-Side GetNext Logs

In `TencentType17Update.c`, around the existing `SmbiosProtocol->GetNext()` call, record the input handle and output handle.

Suggested temporary variables:

```c
EFI_SMBIOS_HANDLE InHandle;
EFI_STATUS        DevLocStatus;
```

Suggested log around the existing `GetNext()` call:

```c
InHandle = SmbiosHandle;

Status = SmbiosProtocol->GetNext (
                          SmbiosProtocol,
                          &SmbiosHandle,
                          &SmbiosType,
                          &Record,
                          NULL
                          );

DEBUG ((DEBUG_INFO,
  "[T17DBG] LOOP S%uC%uD%u GetNext InHandle=0x%04x Status=%r OutHandle=0x%04x Record=%p\n",
  Socket,
  Channel,
  Dimm,
  InHandle,
  Status,
  SmbiosHandle,
  Record
  ));
```

This log is the most important one. If the first `InHandle` is not `0xfffe`, the run has captured direct evidence that the cursor did not start from the standard first-record state.

If `GetNext()` fails, print and continue as current code does:

```c
if (EFI_ERROR (Status)) {
  DEBUG ((DEBUG_ERROR,
    "[T17DBG][ERROR] GetNext failed S%uC%uD%u InHandle=0x%04x Status=%r\n",
    Socket,
    Channel,
    Dimm,
    InHandle,
    Status
    ));
  continue;
}
```

After casting `Record` to `SMBIOS_TABLE_TYPE17 *`, print the key fixed fields and string indexes:

```c
SmbiosType17 = (SMBIOS_TABLE_TYPE17 *) Record;

DEBUG ((DEBUG_INFO,
  "[T17DBG] BEFORE S%uC%uD%u Handle=0x%04x DevLocIdx=%u BankLocIdx=%u SerialIdx=%u AssetIdx=%u Present=%u Enabled=%u Size=0x%x\n",
  Socket,
  Channel,
  Dimm,
  SmbiosHandle,
  SmbiosType17->DeviceLocator,
  SmbiosType17->BankLocator,
  SmbiosType17->SerialNumber,
  SmbiosType17->AssetTag,
  SysMemMapDimmInfo->Present,
  SysMemMapDimmInfo->Enabled,
  SmbiosType17->Size
  ));
```

This is enough even if optional string decoding is inconvenient. If there is already a helper to read SMBIOS optional strings by index, also print the actual current `DeviceLocator`, `SerialNumber`, and `AssetTag`.

## Change 2: Check And Log DeviceLocator Update Status

Currently `UpdateType17DeviceLocator()` is called without checking the return value.

Change:

```c
UpdateType17DeviceLocator(SmbiosProtocol, SmbiosHandle, SmbiosType17, Socket, Channel, Dimm);
```

To:

```c
DevLocStatus = UpdateType17DeviceLocator (
                 SmbiosProtocol,
                 SmbiosHandle,
                 SmbiosType17,
                 Socket,
                 Channel,
                 Dimm
                 );

DEBUG ((DEBUG_INFO,
  "[T17DBG] UpdateDeviceLocator S%uC%uD%u Handle=0x%04x Status=%r\n",
  Socket,
  Channel,
  Dimm,
  SmbiosHandle,
  DevLocStatus
  ));
```

In current v5 code, `UpdateType17DeviceLocator()` already returns `EFI_STATUS`, so this should only capture its existing return value.

## Change 3: Log UpdateString Status For SN And AssetTag

After Serial Number `UpdateString()`:

```c
DEBUG ((DEBUG_INFO,
  "[T17DBG] UpdateSN S%uC%uD%u Handle=0x%04x StringId=%u Status=%r\n",
  Socket,
  Channel,
  Dimm,
  SmbiosHandle,
  SerialNumberId,
  Status
  ));
```

After Asset Tag `UpdateString()`:

```c
DEBUG ((DEBUG_INFO,
  "[T17DBG] UpdateAssetTag S%uC%uD%u Handle=0x%04x StringId=%u Status=%r\n",
  Socket,
  Channel,
  Dimm,
  SmbiosHandle,
  AssetTagId,
  Status
  ));
```

These two logs decide whether the record was reached but update failed, or the record was never reached.

## Change 4: Add Type17-Only Debug Inside SmbiosPiGetNextStructure

In `AmiCompatibilityPkg/Smbios/Smbios.c`, inside `SmbiosPiGetNextStructure()`, add Type17-only temporary logs.

Important:

- Do not print for all SMBIOS types. This function is generic and can be called many times.
- Do not modify `StrucPtr`, `SmbiosHandle`, `Type`, `Record`, or `Status` for debug purposes.
- Capture input values into local variables, then print them.

At function entry:

```c
EFI_SMBIOS_HANDLE InHandle;
EFI_SMBIOS_TYPE   ReqType;
BOOLEAN           IsType17Debug;

InHandle = (SmbiosHandle != NULL) ? *SmbiosHandle : 0xffff;
ReqType = (Type != NULL) ? *Type : 0xff;
IsType17Debug = (Type != NULL && *Type == EFI_SMBIOS_TYPE_MEMORY_DEVICE);

if (IsType17Debug) {
  DEBUG ((DEBUG_INFO,
    "[SMBGET17] IN ReqType=0x%02x InHandle=0x%04x TypePtr=%p RecordPtr=%p\n",
    ReqType,
    InHandle,
    Type,
    Record
    ));
}
```

Add branch logs in the Type != NULL path:

```c
if (IsType17Debug) {
  DEBUG ((DEBUG_INFO,
    "[SMBGET17] Branch=%a InHandle=0x%04x\n",
    (*SmbiosHandle == SMBIOS_HANDLE_PI_RESERVED) ? "FirstByType" : "NextAfterHandle",
    *SmbiosHandle
    ));
}
```

When `FindStructureHandle()` fails in the `Type != NULL && *SmbiosHandle != SMBIOS_HANDLE_PI_RESERVED` branch:

```c
if (IsType17Debug) {
  DEBUG ((DEBUG_ERROR,
    "[SMBGET17][ERROR] Input handle not found InHandle=0x%04x ReqType=0x%02x\n",
    InHandle,
    ReqType
    ));
}
```

At `GetNext_Exit`, after `Status` is known and before return:

```c
if (IsType17Debug) {
  if (!EFI_ERROR (Status) && Record != NULL && *Record != NULL) {
    DEBUG ((DEBUG_INFO,
      "[SMBGET17] OUT Status=%r OutHandle=0x%04x RecType=0x%02x RecHandle=0x%04x RecLen=%u Rec=%p\n",
      Status,
      *SmbiosHandle,
      (*Record)->Type,
      (*Record)->Handle,
      (*Record)->Length,
      *Record
      ));
  } else {
    DEBUG ((DEBUG_ERROR,
      "[SMBGET17] OUT Status=%r OutHandle=0x%04x Record=%p\n",
      Status,
      (SmbiosHandle != NULL) ? *SmbiosHandle : 0xffff,
      (Record != NULL) ? *Record : NULL
      ));
  }
}
```

## How To Interpret Logs

Use this table after the next reproduction:

| Evidence | Meaning | Next Fix Direction |
|---|---|---|
| First `[T17DBG] GetNext InHandle` is not `0xfffe` | Strong evidence that the Type17 cursor starts from an unexpected value | The likely future fix is to initialize the cursor, but do not do it in this debug patch |
| `[SMBGET17][ERROR] Input handle not found` | Caller passed a stale/random/nonexistent handle | Confirms a cursor problem |
| Bad DIMM handle never appears in `[T17DBG] LOOP` logs | Existing enumeration path skipped one Type17 record | Investigate cursor start value or record traversal order |
| Handle appears but S/C/D is shifted | Type17 order does not match Socket/Channel/Dimm loop | Future fix should use a stable mapping instead of pure order |
| Handle appears, DeviceLocator status fails | `UpdateType17DeviceLocator()` / `UpdateString()` failed | Debug string index, handle, buffer, and SMBIOS string table |
| DeviceLocator succeeds but SN/Asset fail | Per-string update failure | Debug SN/Asset string index and input string |
| All existing update logs succeed but OS still shows default | A later module or later write may overwrite Type17 after this module | Find later Type17 writer or execution-order issue |

## Recommended Debug Patch Order

1. Add `[T17DBG]` caller-side GetNext input/output logs.
2. Add `[T17DBG]` DeviceLocator / SerialNumber / AssetTag update status logs.
3. Add `[SMBGET17]` logs inside `SmbiosPiGetNextStructure()` only for Type17.
4. Run long reboot test without any behavior-changing fix.
5. Save SOL log from the first bad boot.

## Suggested Internal Model Prompt

Please add temporary, observation-only debug instrumentation for the intermittent SMBIOS Type17 update miss.

Scope:

- Modify `TencentType17Update.c`, `TencentSmbiosUpdateLib.c`, and `AmiCompatibilityPkg/Smbios/Smbios.c`.
- Do not initialize `SmbiosHandle`. Do not change Type17 mapping logic. Do not add fallback logic. Do not change any branch behavior. This patch must preserve the original runtime behavior so the issue can reproduce.
- Add `[T17DBG]` logs in `TencentType17Update.c` for each Socket/Channel/Dimm loop: GetNext input handle, status, output handle, record pointer, Type17 string indexes, Present/Enabled, and all UpdateString statuses for DeviceLocator, SerialNumber, and AssetTag.
- Capture and log the existing return value from `UpdateType17DeviceLocator()`.
- Add `[SMBGET17]` logs inside `SmbiosPiGetNextStructure()` only when requested type is Type17. Log input handle, branch (`FirstByType` or `NextAfterHandle`), handle-not-found errors, status, output handle, returned record type/handle/length/pointer.
- Keep logs temporary and easy to remove.

Goal:

After one reproduction, the log must identify whether the issue is caused by unexpected SMBIOS handle input, GetNext enumeration skip, Socket/Channel/Dimm order mismatch, UpdateString failure, or a later overwrite.

## 2026-05-30 Debug Refinement From First Log Sample

The first reviewed log sample shows the detector may produce false positives:

```text
[T17DBG] Handle=0x8001 DevLoc=DIMM0A0 ...
[T17DBG] ERROR: Default DeviceLocator on handle 0x8001: DIMM0A0
```

`DIMM0A0` is expected project format, so the detector must not treat any `DIMM<socket><letter><dimm>` string as default.

Recommended detector rule:

```text
Bad DeviceLocator:
  CPU*_DIMM_CH*

Good DeviceLocator:
  DIMM0A0
  DIMM0B0
  DIMM1A0
```

For AssetTag, flag only known base/default placeholder patterns, such as strings ending in `_AssetTag`.

For `NO DIMM`, only flag it when the matching memory map entry says the DIMM is present/enabled.

Also ensure `UpdateDeviceLocator` prints `Status=%r`; a line without status is not enough to distinguish success from silent failure.
