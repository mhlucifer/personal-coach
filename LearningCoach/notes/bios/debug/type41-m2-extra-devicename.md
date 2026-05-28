# Type41 causes one PCIe M.2 to show extra DeviceName

Date: 2026-05-28

Status: initial analysis. The team has already suspected SMBIOS Type41, especially an incorrect segment or BDF field.

## Symptom

Platform has two `SSSTC PJ1-GW1920P` PCIe M.2 devices. In OS, running `lspci -vvv -s <BDF>` for the two M.2 devices shows different output:

- One M.2 device has an extra `DeviceName` line.
- The other M.2 device does not.

This is suspicious because two same-model PCIe M.2 devices normally should not differ in `DeviceName` unless firmware/ACPI/SMBIOS provides a label for only one matching PCI device.

## Key Model

Linux can expose a PCI device label/name from firmware metadata. `lspci` may print it as:

```text
DeviceName: <name>
```

For this case, the important firmware source is SMBIOS Type41:

```text
SMBIOS Type41 = Onboard Devices Extended Information
```

Type41 contains:

- `ReferenceDesignation`: human-readable device name string.
- `DeviceType`: onboard device type and enabled bit.
- `SegmentGroupNum`: PCI segment.
- `BusNum`: PCI bus.
- `DevFuncNum`: PCI device/function packed as `(Device << 3) | Function`.

If a Type41 record's `SegmentGroupNum:BusNum:DevFuncNum` matches a real PCI device, OS tools can attach that Type41 `ReferenceDesignation` to the PCI device. Therefore:

> A wrong Type41 segment/BDF can make an unrelated PCIe device show a misleading `DeviceName`.

## Local Code Anchors

Current v5 Type41 implementation:

```text
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType41Update/TencentType41Update.c
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType41Update/TencentType41Update.h
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType41Update/TencentType41Update.sdl
```

Important code observations:

- `PciIo->GetLocation()` returns `SegmentNumber`, `BusNumber`, `DeviceNumber`, `FunctionNumber`.
- The code records `BusNum`, `DevNum`, `FuncNum`, `DeviceType`, and `DeviceTypeInstance`.
- But Type41 table writes `SegmentGroupNum = 0` instead of using the detected `SegmentNumber`.
- VGA path sets `DevNum[0] = ONBOARD_VGA_DEV_NUM` instead of the detected `DeviceNumber`.
- SATA path uses fixed macros for bus/device/function.

Risky lines/logic:

```c
Status = PciIo->GetLocation (
         PciIo,
         &SegmentNumber,
         &BusNumber,
         &DeviceNumber,
         &FunctionNumber
         );
```

But later:

```c
Type41Table->SegmentGroupNum = 0;
Type41Table->BusNum = BusNum[Index];
Type41Table->DevFuncNum = (DevNum[Index] << 3) | FuncNum[Index];
```

This loses the actual segment.

## Current Best Guess

The extra `DeviceName` on one M.2 probably means:

1. A Type41 entry exists.
2. Its `ReferenceDesignation` string is being exported as a PCI device label.
3. The Type41 record's segment/bus/dev/function accidentally matches one of the two M.2 devices.
4. The match is probably accidental, caused by `SegmentGroupNum` being hardcoded to `0` or by wrong `BusNum/DevFuncNum`.

The team's "segment is wrong" finding fits this perfectly. On a multi-segment PCIe platform, `Bus:Device.Function` alone is not globally unique. `Segment:Bus:Device.Function` is the real identity. If Type41 forces segment 0, a device intended to be described on another segment may collide with a different device on segment 0.

## How To Judge

Run these checks on the machine:

1. Compare the two M.2 BDFs:

```bash
lspci -nn | grep -i 'ssstc\|nvme'
lspci -vvv -s <m2_a_bdf>
lspci -vvv -s <m2_b_bdf>
```

2. Dump Type41:

```bash
dmidecode -t 41
```

3. For each Type41 record, write down:

```text
Reference Designation / DeviceName
Segment Group Number
Bus Address
Device/Function or DevFunc value
Device Type
```

4. Match Type41 to PCI device:

```text
Type41 SegmentGroupNum == PCI domain/segment
Type41 BusNum          == PCI bus
Type41 DevFuncNum      == (PCI device << 3) | PCI function
```

Example:

```text
PCI BDF: 0000:8a:00.0
Segment/domain = 0000
Bus            = 0x8a
Device         = 0
Function       = 0
DevFuncNum     = (0 << 3) | 0 = 0
```

If the Type41 record matches only the M.2 that prints `DeviceName`, the cause is confirmed.

## How To Fix

Fix direction:

1. Do not hardcode `SegmentGroupNum = 0` unless the platform really has only segment 0.
2. Store the detected `SegmentNumber` next to `BusNum/DevNum/FuncNum`.
3. When creating or updating Type41, write:

```c
Type41Table->SegmentGroupNum = (UINT16) SegmentNum[Index];
Type41Table->BusNum = BusNum[Index];
Type41Table->DevFuncNum = (DevNum[Index] << 3) | FuncNum[Index];
```

4. For dynamically detected devices, prefer the actual `DeviceNumber` and `FunctionNumber` from `PciIo->GetLocation()` instead of fixed device/function macros.
5. Only create Type41 for devices that are truly onboard according to the platform requirement. Do not label ordinary removable PCIe M.2 drives as onboard unless that is explicitly required.

Suggested local data structure change:

```c
UINT16 SegmentNum[ONBOARD_DEVICE_EXT_COUNT] = {0};
UINT8  BusNum[ONBOARD_DEVICE_EXT_COUNT] = {0};
UINT8  DevNum[ONBOARD_DEVICE_EXT_COUNT] = {0};
UINT8  FuncNum[ONBOARD_DEVICE_EXT_COUNT] = {0};
```

When a device is detected:

```c
SegmentNum[Index] = (UINT16) SegmentNumber;
BusNum[Index] = (UINT8) BusNumber;
DevNum[Index] = (UINT8) DeviceNumber;
FuncNum[Index] = (UINT8) FunctionNumber;
```

## Review Questions Before Fix

- Is the M.2 supposed to have a `DeviceName` at all?
- If yes, should both M.2 devices have names, and what should those names be?
- If no, which Type41 entry is accidentally matching it?
- Is Type41 intended only for onboard VGA/SATA on this platform, or should it include PCIe M.2 devices too?
- Does the platform have multiple PCI segments/domains?
- Are the observed M.2 BDFs stable across cold boot and reboot?

## Root Cause Draft

The BIOS Type41 table incorrectly described an onboard device with an incorrect PCI identity. In particular, `SegmentGroupNum` was hardcoded to `0` instead of using the segment returned by PCI enumeration. As a result, the Type41 record accidentally matched one of the PCIe M.2 NVMe devices in the OS. Linux associated the Type41 `ReferenceDesignation` string with that PCI device, so `lspci -vvv` printed an extra `DeviceName` for only one M.2.

## Solution Draft

Update Type41 generation to use the real PCI segment/bus/device/function returned by `EFI_PCI_IO_PROTOCOL.GetLocation()` for dynamically detected onboard devices. Validate each Type41 record against the expected onboard device list, and remove or correct any Type41 entry that points to removable M.2 NVMe devices unintentionally. After the fix, verify `dmidecode -t 41` and `lspci -vvv -s` for both M.2 devices: only devices that are intentionally described by Type41 should show `DeviceName`, and identical M.2 devices should have consistent output.

## 2026-05-28 Fix Review Notes

The intranet model's suggested direction is valid:

- Add a `SegmentNum[]` array.
- Save the segment returned by `PciIo->GetLocation()`.
- Use `SegmentNum[Index]` when writing `Type41Table->SegmentGroupNum`.

Recommended refinements:

1. Use `UINT16 SegmentNum[]`, not `UINT8`, because Type41 defines `SegmentGroupNum` as `UINT16`.
2. For the VGA entry, store the real `DeviceNumber` and `FunctionNumber` returned by `GetLocation()` instead of forcing device/function to `0`.
3. If `ONBOARD_DEVICE_EXT_COUNT` is still `1`, do not write `BusNum[1]`, `DevNum[1]`, `FuncNum[1]`, or `SegmentNum[1]`. Guard the SATA branch or remove it until SATA Type41 is actually required.

Preferred shape for the VGA path:

```c
if (VendorDeviceId == ONBOARD_VGA_VENDORDEVICEID) {
  DevicePresentBitmap |= BIT0;

  SegmentNum[0] = (UINT16) SegmentNumber;
  BusNum[0]     = (UINT8) BusNumber;
  DevNum[0]     = (UINT8) DeviceNumber;
  FuncNum[0]    = (UINT8) FunctionNumber;

  DeviceType[0]         = VIDEO_CONTROLLER_ENABLE;
  DeviceTypeInstance[0] = 0x01;
}
```

Both Type41 creation and Type41 update paths should write:

```c
Type41Table->SegmentGroupNum = SegmentNum[Index];
Type41Table->BusNum          = BusNum[Index];
Type41Table->DevFuncNum      = (DevNum[Index] << 3) | FuncNum[Index];
```

Verification:

```bash
dmidecode -t 41
lspci -D -nn | grep -i 'vga\|display\|non-volatile\|nvme\|ssstc'
lspci -D -vvv -s <m2_a_bdf>
lspci -D -vvv -s <m2_b_bdf>
```

The Type41 entry should match the intended onboard device, not either M.2 device.
