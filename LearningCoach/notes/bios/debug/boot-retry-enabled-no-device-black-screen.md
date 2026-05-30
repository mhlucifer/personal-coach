# Boot Retry enabled with no boot devices black screen

Date: 2026-05-30

Status: new case, pending reproduction and code trace.

## Symptom

When Boot Retry is set to enabled and the server has no bootable devices installed, the machine reaches the boot path but shows a black screen and cannot enter the setup option interface.

Expected behavior:

```text
If there is no bootable device, firmware should still provide a setup path or enter setup/options UI instead of staying black.
```

## Current Interpretation

This is not yet proven as a code defect. It needs a controlled reproduction with devices removed.

Initial likely directions:

- Boot Retry policy may keep retrying an empty boot list instead of falling through to setup.
- The no-boot-device path may be waiting for input or timeout on a console path that is not visible.
- Setup/hotkey handling may have already passed before Boot Retry reaches the no-device state.
- Boot option enumeration may produce an unexpected empty or invalid boot list when all devices are removed.
- A platform policy may intentionally suppress setup entry unless a specific hotkey or setup variable is set.

## Data Needed

Before changing code, capture:

```text
Boot Retry setting value
Boot mode
BootOrder / Boot#### variables
Whether setup hotkey is detected
Serial log from BDS / Boot Manager
Whether any PXE / UEFI shell / virtual media boot option exists
Whether the black screen is local video only or also SOL/serial
```

Useful OS / shell checks if available before removing devices:

```bash
efibootmgr -v
```

Useful firmware logs to add later, only if the issue reproduces:

```text
[BOOTRETRYDBG] BootRetry=%d BootOptionCount=%d
[BOOTRETRYDBG] Try Boot####=%04x Status=%r
[BOOTRETRYDBG] No boot option found, entering setup path=%d
[BOOTRETRYDBG] Setup hotkey detected=%d
[BOOTRETRYDBG] Console ready video=%d serial=%d
```

## Root Cause Draft

Pending. The current symptom suggests the Boot Retry no-device path may not transition into setup/options UI, but more evidence is needed to decide whether the firmware is looping over an empty boot list, waiting on an invisible console, or missing setup handoff.

## Verification

Reproduce matrix:

| Boot Retry | Boot Devices | Expected |
|---|---|---|
| Disabled | No devices | Enters setup/options or shows clear no-boot message |
| Enabled | No devices | Should still enter setup/options or show clear no-boot message |
| Enabled | One known-good device | Boots normally |
| Enabled | Device removed after boot order exists | Should not black-screen indefinitely |

First pass should be observational only. Do not patch policy until the exact branch is known.
