# BIOS debug case index

Date: 2026-05-30

Purpose: keep BIOS debug cases grouped by failure model so future cases can be extended without becoming a flat pile of notes.

## Categories

### SMBIOS table generation and update

These cases are about what OS tools see from SMBIOS (`dmidecode`, `lspci DeviceName`) and how BIOS static tables or runtime update modules produce those records.

| Case | Status | Core Conclusion | Next Useful Action |
|---|---|---|---|
| [Type45 missing BIOS firmware version](./type45-bios-firmware-version-missing.md) | Confirmed / fixed direction known | BMC and TPM Type45 are dynamic, but BIOS Type45 comes from static SMBIOS data and was compiled out by `FIRMWARE_INVENTORY_INFO = 0`. | Confirm requirement, confirm Type45 BIOS version source matches Type0 / `BIOS_VERSION`, and confirm manufacturer / image size expected values. |
| [Type41 M.2 extra DeviceName](./type41-m2-extra-devicename.md) | Confirmed / verified fixed | Type41 `Onboard VGA` was mapped to an M.2 BDF because PCI segment/BDF identity was wrong, especially hardcoded segment `0`. | Keep the fixed verification pattern: `dmidecode -t 41`, `lspci -D`, and `lspci -vvv -s <m2_bdf> \| grep -i DeviceName`. |
| [Type17 DIMM locator reverts to Intel default](./type17-dimm-locator-reverts-to-intel-default.md) | Pending reproduction | One Type17 record keeps base strings, suggesting the Tencent Type17 update pass missed that record or update failed invisibly. Current first log sample looks like a good boot and exposes a false-positive detector issue. | Refine the debug detector so `DIMM0A0` is not flagged as default, then reproduce first and decide fix. |
| [Type17 GetNext pure debug instrumentation](./type17-getnext-debug-instrumentation-plan.md) | Debug recipe | Observation-only logs for `GetNext` cursor, Type17 handle mapping, and string update status. | Ensure `UpdateDeviceLocator` prints `Status=%r`; keep the debug patch behavior-preserving. |
| [FVB ASSERT after Type2 AssetTag / Type11 TDX changes](./fvb-standalonemm-assert-type11-assettag-case.md) | Parked / not reproduced | ASSERT is in StandaloneMM FVB path; current evidence points more to flash/FV/NVRAM state or update method than deterministic SMBIOS string logic, but Type2/Type11 code still needs defensive handling. | If it reappears, collect failing FV base address and full serial log before changing more code. |

### Boot, setup, and policy behavior

These cases are about boot flow, user-visible setup behavior, and policy-controlled warnings.

| Case | Status | Core Conclusion | Next Useful Action |
|---|---|---|---|
| [Boot Retry enabled with no boot devices black screen](./boot-retry-enabled-no-device-black-screen.md) | New / pending test | Expected behavior should be entering setup or offering setup path when no bootable device exists. Current suspicion is Boot Retry path may loop/wait before setup UI gets control. | Reproduce with devices removed, capture serial log and setup variable state, then trace boot manager / retry policy. |
| [HSTI Firmware Vendor IBV detected errors warning](./hsti-firmware-vendor-ibv-detected-errors.md) | Mechanism clarified / AMI reply recorded | This warning is expected when HSTI detects missing security configuration. `AmiPcdHstiErrorAction` controls whether to display, key-wait, hang, or suppress. Detailed lines map to checks such as rollback protection and Secure Boot bypass. | For customer explanation, state it is a policy/security warning, not a crash; use full detail line plus `AmiHsti.uni` to identify the failed check. |

### Intermittent or environment-sensitive failures

These need special handling because one successful reboot does not prove the issue is gone.

| Case | Status | Why It Is Tricky | Debug Principle |
|---|---|---|---|
| [Type17 DIMM locator reverts to Intel default](./type17-dimm-locator-reverts-to-intel-default.md) | Pending reproduction | Failed only after many reboots; likely state/order/cursor sensitive. | First debug build must not alter behavior; only log the original path. |
| [FVB StandaloneMM ASSERT](./fvb-standalonemm-assert-type11-assettag-case.md) | Parked | Failed on one machine / flash path, then disappeared after physical restart and stress testing. | Capture failing FV base and flash/update mode before attributing to nearby SMBIOS changes. |

## Case Status Meanings

- Confirmed: evidence points to a specific mechanism or code path.
- Verified fixed: user has tested the expected output after patch.
- Pending reproduction: we have hypotheses, but must reproduce with logs before changing behavior.
- Parked: issue is not currently reproducible; keep notes and exact next debug steps.
- Expected behavior: behavior is intentional or configurable, but may need customer-facing explanation.

## Standard Case Template

For future cases, use this shape:

```text
# Short case title

Date:
Status:

## Symptom
What the user/customer sees.

## Evidence
Command output, screenshot, serial log, exact handle/BDF/type.

## Code Anchors
Files/functions/macros/tokens involved.

## Current Interpretation
What the evidence proves and what is still unknown.

## Root Cause Draft
One paragraph that can be pasted into an issue or report.

## Solution Draft
What to change or what policy/configuration explains the behavior.

## Verification
Commands and expected output.

## Next If Reappears
Minimal logs to add and what each result means.
```

## Current Big Patterns

1. SMBIOS bugs should start from OS-visible output, then map each visible string or BDF back to one producer.
2. Static SMBIOS records require SDL/token override tracing; dynamic records require `SmbiosProtocol->Add()` / `UpdateString()` tracing.
3. PCI identity must include segment/domain, not just bus/device/function.
4. Intermittent boot bugs need observation-only debug first; do not add a likely fix before capturing the bad run.
5. Policy warnings such as HSTI need both code mechanism and customer-facing behavior explanation.
