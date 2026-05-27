# Boot Retry enabled with no boot devices enters black screen

Date: 2026-05-27

Status: new, not analyzed.

## Symptom

When `Boot Retry` is set to `Enabled` and the server has no bootable/installable devices installed, the system enters a black screen and cannot enter the setup option interface.

Expected behavior:

- With no bootable devices installed, the system should enter the setup option interface instead of staying on a black screen.

## Scope

- Area: BIOS boot flow / BDS / boot retry policy / setup fallback.
- Trigger condition: `Boot Retry = Enabled`.
- Hardware condition: no bootable/installable devices installed.
- Current evidence: symptom report only. No log, code path, or root cause has been confirmed yet.

## Current Best Guess

Do not treat this as root cause yet.

The issue likely sits around the no-boot-device handling path when boot retry is enabled. The important question is whether the boot manager repeatedly retries an empty or invalid boot target and skips the expected setup fallback path.

Candidate areas to inspect later:

- Boot retry setup token / NVRAM variable ownership.
- BDS boot option enumeration when `BootOrder` is empty or all boot options are invalid.
- No-boot-device fallback policy.
- Setup entry path / setup hotkey path.
- Serial/video output state when the black screen appears.
- Any watchdog, retry counter, or loop guard used by the boot manager.

## Evidence Needed Next Time

Capture the following before changing code:

- Exact platform/image/branch.
- Whether the failure reproduces after cold boot, warm reset, and CMOS/NVRAM clear.
- Current setup value for `Boot Retry`.
- `BootOrder`, `BootNext`, and visible boot options if they can be queried.
- SOL/serial log from the last visible POST message through black screen.
- POST code or checkpoint at the black screen.
- Whether pressing setup hotkey during POST changes behavior.
- Whether installing one bootable device makes the system enter normal boot flow.
- Whether disabling `Boot Retry` makes the no-device case enter setup as expected.

## Root Cause

Unknown.

## Solution

Unknown.

Expected solution shape, if the later diagnosis confirms the current suspicion:

- Preserve boot retry behavior for valid boot targets.
- Add or restore a no-boot-device fallback so the system enters setup when there are no valid boot options.
- Avoid an infinite retry loop when `Boot Retry` is enabled but no bootable device exists.

## Verification

Minimum checks after a fix:

```sh
# observable target-side checks
# 1. Boot Retry = Enabled, no boot devices installed
# 2. Boot Retry = Disabled, no boot devices installed
# 3. Boot Retry = Enabled, one valid boot device installed
```

Expected:

- Case 1 enters setup option interface.
- Case 2 keeps the existing expected no-device behavior.
- Case 3 still boots or retries according to the configured boot retry policy.

## Debugging Method To Remember

For boot-flow issues, first separate three states:

1. No boot options exist.
2. Boot options exist but all fail.
3. Boot retry loops on a stale or invalid boot target.

These states can look similar from the screen, but they usually use different BDS branches and require different fixes.
