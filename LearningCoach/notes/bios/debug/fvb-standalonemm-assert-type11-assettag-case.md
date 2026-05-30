# FVB StandaloneMM ASSERT after Type2 AssetTag / Type11 TDX changes

Date: 2026-05-20

Status: temporarily parked. The current image has run overnight reboot testing without reproducing the ASSERT.

## Background

This case was seen while debugging a TriRiver V5 BIOS image that included two nearby SMBIOS changes:

- Type 2 Asset Tag generation changed from a direct FRU/baseboard value to a computed `PCBxx-BTxx-SKxx` style value, with fallback to the original FRU/baseboard value.
- Type 11 added a fifth OEM string for TDX version.

The same code path later became hard to reproduce. One machine had previously crashed after flashing or after someone else may have reflashed it, then recovered only after a physical restart. On the current machine, repeated flashing/reboot testing did not hit the issue again.

## Symptom

Serial log showed:

```text
DXE_ASSERT!: [FwBlockServiceStandaloneMm] ... FwBlockServiceStandaloneMm.c (1550):
!(((RETURN_STATUS)(Status)) >= 0x8000000000000000ULL)

!!!! X64 Exception Type - 0E (#PF - Page-Fault)
```

Important interpretation: this ASSERT is an `ASSERT_EFI_ERROR(Status)` style failure. It means `Status` is an error, not that the code expected an error.

## Local Code Meaning

Relevant local source:

```text
/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/OakStream/Intel/ServerPlatformPkg/Platform/SpiFvbServicesStandaloneMm/FwBlockServiceStandaloneMm.c
/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/OakStream/Intel/ServerPlatformPkg/Platform/SpiFvbServicesStandaloneMm/FvbInfo.c
```

The failing area is in `GetFvbHeader()`:

- It finds `gEfiFlashMapHobGuid`.
- It walks flash map entries for firmware volume block regions.
- It casts the flash map base address to an FV header.
- It calls `ValidateFvHeader()`.
- If the FV header is invalid, it sets `WriteBack = TRUE` and calls `GetFvbInfo(BaseAddress, ...)` to find a known static FV description.
- The ASSERT at about line 1550 means `GetFvbInfo()` returned an error.

So the immediate low-level meaning is:

> A flash map entry pointed to an FV base whose header looked invalid or corrupt, and the platform static FVB info table did not have a matching fallback entry for that base.

The later page fault is likely secondary: after the ASSERT, the code may continue far enough to dereference missing/invalid FVB info.

## Current Best Guess

This does not currently look like a deterministic Type 11 or Type 2 runtime logic crash.

The strongest clues are:

- The same image stopped reproducing after physical restart / later reboot loops.
- Another same-board test path did not fail consistently.
- The ASSERT is inside StandaloneMM FVB initialization, before ordinary SMBIOS string update logic would normally be the direct cause.

Most likely categories:

1. Machine-local flash state issue: dirty or corrupt FV header, NVRAM, variable store, runtime-updatable region, or preserved flash area.
2. Partial/incremental flash issue: the update method may preserve a region that should have been erased after the image layout or FV contents changed.
3. Flash map versus actual flash contents mismatch: a flash map entry points to a base address whose contents no longer look like the expected FV.
4. Cold-reset sensitivity: warm reboot may preserve a bad state that AC power removal, BMC reset, or physical restart clears.
5. Less likely but still worth checking: Type 11 string count/token generation or new module size/layout changed the final FV image enough to expose a stale flash region problem.

## Related Change Areas to Recheck

Type 2 Asset Tag:

```text
TencentLegoPkg/Dxe/TencentFruSmbios/TencentFruSmbios.c
TencentLegoPkg/Dxe/TencentFruSmbios/TencentFruSetup.c
TencentLegoPkg/Dxe/TencentFruSmbios/TencentFruSmbios.inf
TencentLegoPkg/Dxe/TencentFruSmbios/TencentFruSmbios.sdl
```

Checks:

- `Type2Structure->AssetTag = 0x05` is only the SMBIOS string index, not the real Asset Tag value.
- `TencentFruSmbios.c` updates Type 2 string number 5.
- `TencentFruSetup.c` may update setup/PCD backing values.
- For invalid PCD detection, prefer fallback if any one field is invalid:

```c
if (PcbVer == 0xFF || BoardType == 0xFF || SkuId == 0xFF) {
  // fallback to original FRU/baseboard asset tag
}
```

Type 11 TDX string:

```text
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType11Update/TencentType11Update.c
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType11Update/TencentType11Update.sdl
```

Checks:

- `NUMBER_OF_OEM_STRINGS` must be 5.
- `TDX_VERSION_VALUE` should be generated like existing string tokens.
- `OemString5` must be allocated, checked, used with string number 5, and freed.
- `UpdateString` statuses for strings 1 through 5 should all be logged.

## If It Reappears

Capture before changing anything:

- Full serial log from reset until ASSERT.
- Whether any `OemUpdateSmbios11` or Type 2 AssetTag debug appears before the ASSERT.
- Exact image version, build path, and whether the flash was full erase or update-preserve mode.
- Whether AC power was removed, BMC was cold reset, CMOS/NVRAM was cleared, or only warm reboot was used.

Add temporary FVB debug near the failing ASSERT:

```c
DEBUG ((DEBUG_ERROR, "GetFvbInfo failed BaseAddress=%08x Status=%r\n", *BaseAddress, Status));
```

Add temporary FV header debug before or around `ValidateFvHeader()`:

```c
DEBUG ((DEBUG_ERROR,
  "Check FV Base=%08x Sig=%08x Rev=%x HeaderLength=%x FvLength=%lx\n",
  *BaseAddress,
  (*FwVolHeader)->Signature,
  (*FwVolHeader)->Revision,
  (*FwVolHeader)->HeaderLength,
  (*FwVolHeader)->FvLength
));
```

Then map the failing `BaseAddress` to the platform flash layout and identify which FV or preserved region is involved.

## Suggested Next Debug Matrix

If the ASSERT becomes reproducible again, test in this order:

1. Full erase/full flash on the failing machine, including NVRAM/runtime-updatable regions if the process allows it.
2. Clear CMOS/NVRAM and load defaults.
3. BMC cold reset and AC power cycle.
4. Known-good old BIOS on the same machine.
5. New BIOS with Type 11 TDX change removed but Type 2 AssetTag change kept.
6. New BIOS with Type 2 AssetTag/setup/PCD changes removed but Type 11 TDX change kept.
7. Clean build versus incremental build.

## Practical Conclusion

Keep the source changes under suspicion, but do not overfit to them yet. The current evidence points more strongly to a transient or machine-local flash/FV/NVRAM state problem. The next useful data point is the failing FV base address from `FwBlockServiceStandaloneMm.c`, because that tells us whether the bad region is related to the changed modules or to a preserved platform flash area.

## 2026-05-28 Addendum: Type2 AssetTag Hardening Notes

Later review of the Type2 AssetTag change found two separate risk classes:

1. The intermittent FVB ASSERT still does not look proven as a deterministic Type2/Type11 logic crash.
2. The Type2 AssetTag implementation itself should still be hardened, because it touches SMBIOS strings and PCD-backed setup values.

Important crash clue:

```text
CR2 = 0x60E
```

This looks more like a NULL or invalid pointer plus offset access than a pure stack overflow. A stack overflow would more likely fault near the current stack pointer or a guard page. Therefore, changing a large local buffer to heap is useful hardening, but it is probably not the full root cause by itself.

AssetTag code review points:

- `PcdTencentPCBVer`, `PcdTencentBoardType`, and `PcdTencentSKUID` default to `0xFF`; treat `0xFF` as invalid/unprogrammed unless the platform owner confirms otherwise.
- If `0` is also not a valid encoded value, treat `0` as invalid too.
- Every branch must initialize the final `AsciiString` before calling `SmbiosProtocol->UpdateString`.
- `PcdGetPtr(AmiPcdBaseBoardAssetTag)` must be checked before `StrCmp`, `StrSize`, or `GetValidSMBIOSString`.
- `GetValidSMBIOSString()` calls `StrSize(UnicodeStr)` internally, so passing NULL can crash immediately.
- If converting `AsciiString` back to Unicode for `PcdSetPtrS`, allocate the Unicode buffer from heap or guarantee the PCD implementation copies the data before the stack buffer goes out of scope.
- `PcdSetPtrS` takes the buffer size as an in/out parameter. Reinitialize `SizeofBuffer` before each separate `PcdSetPtrS` call.

Preferred shape:

```c
ZeroMem (AsciiString, MAX_SMBIOS_STRING_SIZE);

PcbVer    = PcdGet8 (PcdTencentPCBVer);
BoardType = PcdGet8 (PcdTencentBoardType);
SkuId     = PcdGet8 (PcdTencentSKUID);

if (PcbVer != 0xFF && BoardType != 0xFF && SkuId != 0xFF) {
  AsciiSPrint (
    AsciiString,
    MAX_SMBIOS_STRING_SIZE,
    "PC%02X-BT%02X-SK%02X",
    PcbVer,
    BoardType,
    SkuId
    );
} else {
  UnicodeString = (CHAR16 *) PcdGetPtr (AmiPcdBaseBoardAssetTag);
  if (UnicodeString == NULL ||
      PcdDefaultString == NULL ||
      StrCmp (UnicodeString, PcdDefaultString) == 0) {
    AsciiStrCpyS (AsciiString, MAX_SMBIOS_STRING_SIZE, DefaultString2);
  } else {
    GetValidSMBIOSString (AsciiString, UnicodeString);
  }
}

Status = SmbiosProtocol->UpdateString (
                           SmbiosProtocol,
                           &SmbiosHandle,
                           &StringNumber,
                           AsciiString
                           );
```

If the value also needs to be written back to PCD:

```c
BufSize = (AsciiStrLen (AsciiString) + 1) * sizeof (CHAR16);
UnicodeBuf = AllocateZeroPool (BufSize);
if (UnicodeBuf != NULL) {
  Status = AsciiStrToUnicodeStrS (
             AsciiString,
             UnicodeBuf,
             BufSize / sizeof (CHAR16)
             );
  if (!EFI_ERROR (Status)) {
    SizeofBuffer = StrSize (UnicodeBuf);
    PcdSetPtrS (AmiPcdBaseBoardAssetTag, &SizeofBuffer, (VOID *) UnicodeBuf);

    SizeofBuffer = StrSize (UnicodeBuf);
    PcdSetPtrS (PcdSystemAssetTag, &SizeofBuffer, (VOID *) UnicodeBuf);
  }
  FreePool (UnicodeBuf);
}
```

The practical recommendation is:

- Keep the Type2 fix, but make it boring and defensive.
- Do not rely on the FVB ASSERT being fixed until the same flash/update path has been stress-tested on the previously failing machine.
- If the FVB ASSERT appears again, collect the failing FV base address before changing more SMBIOS logic.
