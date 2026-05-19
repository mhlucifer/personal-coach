# Source Index

This file records local references for study. Do not upload company source code,
raw documents, or copied internal excerpts into this repository.

## Main Local BIOS Codebase

The current TriRiver V5 source tree is kept locally under an ignored directory:

```text
code-repositories/tririverv5-ami
```

Use it for code tracing, `rg`, build-path reading, and tutor questions. It should
stay local-only.

## Local Raw Materials

Original documents and extracted raw references are kept under:

```text
local-materials/tririver-v5/raw-documents
```

This directory is ignored by git. Use it as evidence while writing your own
summaries, but do not copy raw internal content into public notes.

Current local categories:

- `00_inbox`: new unsorted files.
- `01_ami_aptio_training`: AMI/AptioV and UEFI phase fundamentals.
- `02_uefi_boot_setup_nvram`: Boot, Setup, and NVRAM.
- `03_smbios_acpi_ras_smi`: SMBIOS, ACPI, SMI, and RAS.
- `04_pcie_and_pci_bus`: PCIe and PCI bus materials.
- `05_intel_platform_gnr`: Intel platform references; local-only.
- `06_project_design_and_templates`: project designs and templates.
- `90_extracted_docx_workspace`: extracted document workspaces.

Foundation local materials:

- `local-materials/foundation/computer-architecture`: local-only books and
  architecture references.

## Local Detailed Learning Notes

Detailed BIOS notes imported for study are under an ignored private directory:

```text
LearningCoach/references/private/tririver-v5
```

Important subfolders:

- `smbios-learning-studio`: SMBIOS Type9/Type41/SPD CRC and related study docs.
- `self-learning-import`: imported personal learning notes.
- `codex-shared-references`: reusable BIOS trace, debug, build, and glossary notes.

The public notes area keeps only the study index:

```text
LearningCoach/notes/bios/tririver-v5/README.md
```

## Available SMBIOS Anchors

SMBIOS/Type9/Type41 are available anchors for work tasks and later study. They
are not the default learning queue unless explicitly selected.

Type9:

```text
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType9Update/TencentType9Update.c
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType9Update/TencentType9Update.h
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType9Update/TencentType9Update.inf
```

Type41:

```text
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType41Update/TencentType41Update.c
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType41Update/TencentType41Update.h
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType41Update/TencentType41Update.inf
```

SMBIOS update inclusion:

```text
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentSmbiosUpdate.cif
TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentSmbiosUpdate.sdl
TencentLegoPkg/Library/TencentSmbiosUpdateLib/TencentSmbiosUpdateLib.c
TencentLegoPkg/Library/TencentSmbiosUpdateLib/TencentSmbiosUpdateLib.inf
```

## Current Call Chain

```text
TencentType9UpdateMain
  -> UpdateSmbiosType9TableSysSlot
    -> FindAllRootBridgeAndDownStreamPort
```

## Current Anchor Selection Rule

When new high-value materials arrive, classify them first and then pick one
current anchor from:

- platform flow
- HOB / PCD / config path
- PCIe topology
- build inclusion / override chain
- debug and verification strategy
