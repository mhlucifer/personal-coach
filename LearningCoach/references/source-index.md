# Source Index

This file records local read-only references. Do not upload source code into this repository.

## Main Local BIOS Codebase

```text
/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami
```

Typo-friendly symlink:

```text
/Users/tzy/code/personal-coach/code-repositories/triverv5-ami
```

## Old Learning Assets

Keep these in place. Use them as read-only references.

```text
/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/.ai_knowledge
/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/smbios-learning-studio
/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/学习
/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/总结
```

## First BIOS Anchors

These anchors are references only. They are not the default learning queue.

## Paused SMBIOS Anchors

SMBIOS/Type9/Type41 are paused until updated materials arrive.

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

## Paused Call Chain

```text
TencentType9UpdateMain
  -> UpdateSmbiosType9TableSysSlot
    -> FindAllRootBridgeAndDownStreamPort
```

## Current Anchor Selection Rule

When the user provides new high-value materials, classify them first and then pick one current anchor from:

- platform flow
- HOB / PCD / config path
- PCIe topology
- build inclusion / override chain
- debug and verification strategy
