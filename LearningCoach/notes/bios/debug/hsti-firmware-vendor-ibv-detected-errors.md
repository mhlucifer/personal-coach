# HSTI Firmware Vendor IBV detected errors warning

Date: 2026-05-29

Status: mechanism clarified. Exact failing security item still needs the full POST detail line or HSTI error string.

## Symptom

During boot, when the server reaches the POST screen, it prints a warning similar to:

```text
Firmware Vendor (IBV) detected errors
```

This can look like a BIOS defect or a firmware runtime failure to customers if the meaning is not explained.

## Confirmed Meaning

This warning is expected HSTI display behavior when HSTI has recorded security check failures for the IBV role and the project policy asks POST to show them.

Example:

- If Secure Boot is not enabled, HSTI may report a security configuration warning.
- The warning does not necessarily mean the BIOS image is broken.
- The header alone does not identify the root cause. The specific line under the header identifies which HSTI check failed.
- The display is policy-driven by the HSTI error action setting.
- The underlying pass/fail result is driven by HSTI test modules and platform security configuration.

## 2026-05-30 AMI Reply Notes

AMI pointed out that the generic POST header:

```text
Firmware Vendor (IBV) detected errors
```

must be read together with the detailed error lines below it.

Example detailed lines from the AMI reply:

```text
0x00110001 RollBack Firmware Error. - Please enable Firmware Rollback Protection.
0x00120001 Secure Boot Bypass Error. - Please disable Bypass capability.
```

AMI interpretation:

- `0x00110001 RollBack Firmware Error` corresponds to Firmware Rollback Protection. Setting `IGNORE_IMAGE_ROLLBACK` to `1` can trigger this failure because rollback protection is effectively bypassed/ignored.
- `0x00120001 Secure Boot Bypass Error` corresponds to Secure Boot bypass/security configuration. AMI described this as related to Secure Boot option not being enabled / bypass capability not being disabled.
- `AmiHsti.uni` contains the corresponding error strings. Searching the `#string` content in that file can map a POST error line back to the exact HSTI item.

User question to AMI:

```text
Is there a method to check or print which concrete item / verification caused
the "Firmware Vendor (IBV) detected errors" message?
```

AMI reply:

- Refer to `AmiHstiPkg.chm` release notes, `Release Notes -> Notes`.
- The AMI HSTI module contains code to perform all IBV tests and report the errors found.
- The warning is not tied to a specific OS version. AMI explicitly replied that avoiding these HSTI warnings is unrelated to the OS version.

AMI listed the module's covered checks as:

- Verification of crypto strength.
- Verification that no off-board device with built-in DMA controllers can use them.
- Verification of MOR support when TPM support is enabled.
- Verification that Firmware Rollback Protection is enabled.
- Verification that all Secure Boot bypasses are disabled.
- Verification that the default test key provided by AMI is not being used in the BIOS.
- Verification that CSM is disabled when Secure Boot is enabled.
- Verification of signed firmware update.
- Verification that the system is not in Maintenance Mode.

Practical tracing method from this reply:

1. Capture the full POST text, not only the `Firmware Vendor (IBV) detected errors` header.
2. Search the detailed error line or error code in `AmiHsti.uni`.
3. Map the string to the HSTI check function / implemented bit.
4. Decide whether the product requirement is to fix the security setting or suppress the POST display through `AmiPcdHstiErrorAction`.

## 2026-05-30 Code Trace Details

The POST header is only the role header. It is selected by the HSTI role table:

```text
AmiHsti.c -> HandleTestResult()
  Role = PLATFORM_SECURITY_ROLE_PLATFORM_IBV
  Token = AMI_HSTI_ROLE_PLATFORM_IBV
  String = "Firmware Vendor(IBV) detected errors:"
```

The concrete failing items come from error strings appended earlier by the individual HSTI tests. The two observed error codes decode as:

```text
0x00110001 = TestBit 0x0011 + ErrorNum 0x0001
           = bit 17, Firmware Rollback Protection

0x00120001 = TestBit 0x0012 + ErrorNum 0x0001
           = bit 18, Secure Boot Bypass
```

This is because `ReportError(BitNum, ErrorNum, Token)` formats the HII string in `AmiHsti.uni`:

```text
AMI_HSTI_ERROR_FIRMWARE_ROLLBACK:
  "0x%04X%04X RollBack Firmware Error..."

AMI_HSTI_ERROR_SECURE_BOOT_BYPASS:
  "0x%04X%04X Secure Boot Bypass Error..."
```

Current implemented bitmap:

```text
HstiAmi.sdl
  AmiPcdHstiImplementedTestBitmap = 0x3F0000
  AmiPcdHstiFirmwareRollbackImplementationBit = 17
  AmiPcdHstiSecureBootBypassImplementationBit = 18
```

So these two checks are intended to run in the current project policy.

Rollback failure path:

```text
RollBackProtection.c
  TestBit = PcdGet8(AmiPcdHstiFirmwareRollbackImplementationBit)  // 17
  if bit 17 is implemented:
      if (!PcdGetBool(AmiPcdFirmwareRollbackProtection))
          ReportError(17, 1, AMI_HSTI_ERROR_FIRMWARE_ROLLBACK)
```

The SDL mapping sets `AmiPcdFirmwareRollbackProtection = TRUE` only when:

```text
IGNORE_IMAGE_ROLLBACK = 0
IGNORE_RUNTIME_UPDATE_IMAGE_REVISION_CHECK = 0
```

In the current tree, project/CRB tokens set `IGNORE_IMAGE_ROLLBACK = 1`, so the rollback-protection PCD is likely left at its DEC default `FALSE`. That explains `0x00110001`. To prove it in a build, check the final generated PCD value for `AmiPcdFirmwareRollbackProtection`.

Secure Boot bypass failure path:

```text
SecureBootBypass.c
  Error = TRUE
  Read EFI variable "SecureBoot"
  if SecureBoot == 1:
      if !PcdGetBool(AmiPcdSecureBootBypass):
          Error = FALSE
  if Error:
      ReportError(18, 1, AMI_HSTI_ERROR_SECURE_BOOT_BYPASS)
```

This means the check fails when Secure Boot is disabled or the Secure Boot variable cannot be read. If Secure Boot is enabled, it passes only when bypass capability is disabled. In the current tree, `ENABLE_IMAGE_EXEC_POLICY_OVERRIDE` defaults to `0`, so the bypass PCD is likely safe/false; the more likely trigger is runtime `SecureBoot = 0`. To prove it, capture the runtime Secure Boot variable and the final generated PCD value for `AmiPcdSecureBootBypass`.

Display policy path:

```text
HstiAmi.sdl
  AmiPcdHstiErrorAction = 0x0010

AmiHsti.c -> HandleTestResult()
  RoleAction = (Action >> (Index * 4)) & 0x0F
```

Role order is IHV, IBV, OEM, ODM. Therefore `0x0010` means `IBV action = 1`: display IBV errors in POST and continue boot. Setting this PCD to `0x0000` suppresses the POST warning display, but does not make the rollback or Secure Boot checks pass.

Customer-facing conclusion:

```text
This is expected HSTI display behavior under the current policy. The current
image is configured to display IBV HSTI findings during POST. The observed
findings are Firmware Rollback Protection and Secure Boot Bypass/Secure Boot
configuration. If the product requirement is to avoid showing these warnings
for this customer scenario, AmiPcdHstiErrorAction can be set to 0. If the
requirement is to pass the security checks, the corresponding security
configuration must be enabled/fixed instead of only suppressing display.
```

## Code Path

Main path:

```text
HstiEntryPoint
  -> publish default IBV HSTI table with implemented bits
  -> ReadyToBoot: AmiHsti_PerformTestsAndPublish
       -> RunTests
          -> HSTI_TEST_LIST entries
             -> ReportError(...) on failed check
             -> HstiLibSetFeaturesVerified(...) on passed check
  -> AfterReadyToBoot: HandleTestResult
       -> HstiLibGetTable for IHV/IBV/OEM/ODM roles
       -> compare Implemented vs Verified bits
       -> append role title and error strings
       -> DisplayHstiErrors according to AmiPcdHstiErrorAction
```

Important code anchors:

- `AmiHsti.c`: `HstiEntryPoint` creates the IBV HSTI table, sets implemented bits from `AmiPcdHstiImplementedTestBitmap`, registers `ReadyToBoot` test execution, and registers `AfterReadyToBoot` display handling only when `AmiPcdHstiErrorAction != 0`.
- `AmiHsti.c`: `RunTests` executes `HSTI_TEST_LIST`.
- `AmiHsti.c`: `ReportError` appends error strings to the IBV HSTI table.
- `AmiHsti.c`: `HandleTestResult` reads role tables, checks whether implemented bits were verified, and displays errors based on per-role action nibbles.
- `HstiAmi.sdl`: `IbvImplementedHstiTests` decides which test functions are linked into `HSTI_TEST_LIST`.

## Configuration Knob

Relevant PCD:

```text
Name       = AmiPcdHstiErrorAction
GuidSpace  = gAmiHstiPkgTokenSpaceGuid
PcdType    = PcdsFixedAtBuild
DataType   = Uint32
Project SDL default = 0x0010
```

Meaning:

```text
Each role uses 4 bits:
bits 0-3   IHV
bits 4-7   IBV
bits 8-11  OEM
bits 12-15 ODM

Per-role action:
0x0 - No action
0x1 - Display errors in POST and continue boot
0x2 - Display errors in POST and proceed boot upon key press
0x3 - Display errors in POST and hang
```

Therefore `0x0010` means:

```text
IHV action = 0
IBV action = 1  -> display IBV errors in POST, then continue boot
OEM action = 0
ODM action = 0
```

Setting the whole PCD to `0x0000` suppresses HSTI POST display/action for all roles. It does not prove that the security checks passed.

## Implemented IBV Checks

The project SDL maps `AmiPcdHstiImplementedTestBitmap` to `0x3F0000` and maps the implemented IBV test bits as:

```text
bit 16: Crypto Strength
bit 17: Firmware Rollback Protection
bit 18: Secure Boot Bypass
bit 19: No Test Key
bit 20: External Device DMA
bit 21: MOR Support
```

The following tests exist in the module but are mapped to `0xFF` in the current SDL, so they are not included by the current implemented bitmap:

```text
SecureBootCsmDisable
ManufacturingMode
SignedFirmwareUpdate
SecureUpdateWithDefaultKey
```

## Behavior To Judge

When this bug is investigated, distinguish these behaviors:

1. Did HSTI run?
   - `HstiEntryPoint` registers the callbacks.
   - `ReadyToBoot` runs `RunTests`.

2. Which checks are supposed to run?
   - Determined by `AmiPcdHstiImplementedTestBitmap` and the per-check bit PCDs.

3. Which check failed?
   - Determined by the exact error string after `Firmware Vendor (IBV) detected errors`.
   - The header alone is not enough.

4. What does `AmiPcdHstiErrorAction` do?
   - It controls whether POST displays, waits, continues, or hangs.
   - It does not fix Secure Boot, rollback protection, DMA, MOR, key, or crypto policy.

5. Is the product requirement to pass HSTI or only to suppress POST warning?
   - Passing HSTI requires fixing the failed security setting.
   - Suppressing the warning only requires changing the display/action policy.

## Owner Confirmation

The HSTI module owner confirmed:

- Customers can choose the behavior based on their own product requirement.
- If a customer does not want the POST warning displayed, setting `AmiPcdHstiErrorAction` to `0` is allowed.
- There is no issue with disabling the message display through this PCD.
- The CRB default should not be changed from the Oak CRB side, because CRB needs to keep a common policy compatible with different customer security requirements.

## Customer Explanation

The POST warning is not a boot failure. It is a security compliance reminder generated by the HSTI module when security configuration checks detect that some implemented IBV checks were not verified.

For a customer platform, there are two valid choices:

1. Keep the warning enabled if the product wants POST-time visibility for missing security configurations.
2. Disable the display by setting `AmiPcdHstiErrorAction = 0` if the product requirement is to avoid showing this warning during POST.

The recommended customer-side decision is to confirm the platform security policy first. If the customer expects the platform to satisfy HSTI security requirements, capture the exact detailed error line and fix that security item. If the customer only wants to suppress the POST warning for this product stage, use the PCD policy override.

## Verification

After changing the PCD:

1. Build the BIOS image.
2. Flash the image.
3. Boot to POST.
4. Confirm whether the HSTI warning behavior matches the configured action:
   - IBV nibble `0`: no IBV message/action.
   - IBV nibble `1`: IBV message shown, boot continues.
   - IBV nibble `2`: IBV message shown, key press required.
   - IBV nibble `3`: IBV message shown, system hangs.

Also capture the full warning text. The line after `Firmware Vendor (IBV) detected errors` is the root-cause clue.

## Root Cause Draft

The POST warning is triggered because the IBV HSTI table has one or more implemented bits that were not marked verified, and `AmiPcdHstiErrorAction` has IBV action set to display. The message display is expected behavior. The actual root cause is the specific failed HSTI item, which must be read from the detailed error string.

## Solution Draft

Confirm the customer's intended security policy. If the product requires the HSTI checks to pass, capture the detailed HSTI error string and fix the corresponding security configuration. If the product only wants to suppress the POST warning, set the relevant role action in `AmiPcdHstiErrorAction` to `0`; setting the whole value to `0x0000` suppresses all roles. Do not request CRB to disable this globally, because CRB must keep a common default policy for multiple customer scenarios.
