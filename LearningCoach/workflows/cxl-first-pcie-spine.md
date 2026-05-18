# CXL-First PCIe Spine Workflow

Use this workflow to start CXL without falling into a full PCIe course.

## Session 1: Why CXL Starts As PCIe

- Learn: BDF, config space, Vendor ID / Device ID / Class Code.
- Output: explain how BIOS/OS first discovers a CXL device.
- Exam: identify what is PCIe-generic vs CXL-specific.

## Session 2: Capability Chain

- Learn: PCI Capability, Extended Capability, and why CXL uses DVSEC.
- Output: explain why CXL information is found after PCIe enumeration.
- Exam: trace from config-space discovery to CXL capability parsing.

## Session 3: BAR / MMIO / Resources

- Learn: BAR, MMIO window, resource allocation.
- Output: explain why CXL devices need address resources before higher-level use.
- Exam: debug a missing or incorrectly sized resource.

## Session 4: CXL.io / CXL.cache / CXL.mem

- Learn: what problem each protocol solves.
- Output: explain Type 1, Type 2, Type 3 devices.
- Exam: choose which protocol matters for a device scenario.

## Session 5: HDM Decoder

- Learn: why decoder exists and what it maps conceptually.
- Output: explain host address to device memory routing at owner level.
- Exam: localize a memory-not-visible issue.

## Session 6: ACPI Exposure

- Learn: CEDT, SRAT, HMAT only at the purpose level.
- Output: explain what firmware exposes to the OS.
- Exam: debug whether the failure is firmware exposure or OS consumption.

## Session 7: Review

- Build one page of personal memory:
  - PCIe discovery path
  - CXL-specific discovery path
  - memory exposure path
  - debug breakpoints

