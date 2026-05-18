# 7 Day BIOS Code Reading Start

Each day is 45-60 minutes and must end with exam questions and a log update.

## Day 1: Type9 Is A Slot Table

Read `TencentType9Update.inf` and `TencentType9UpdateMain`.

Output: module entry, protocols, dependency, and runtime phase.

## Day 2: Type9 Main Loop

Read `UpdateSmbiosType9TableSysSlot`.

Output: old Type9 delete path, RootBridge enumeration path, new Type9 add path.

## Day 3: PCI IO And BDF

Read `FindAllRootBridgeAndDownStreamPort`.

Output: explain `EFI_PCI_IO_PROTOCOL`, `GetLocation`, BDF, and downstream-port detection.

## Day 4: RootBridge To Type9

Trace how `ROOT_BRIDGE` fields become Type9 fields.

Output: explain `SlotID`, `BusNum`, `DevFuncNum`, `SlotType`, and `SlotDataBusWidth`.

## Day 5: Static vs Dynamic Type9

Compare `StaticSmbiosType9Table` and `UpdateSmbiosType9TableSysSlot`.

Output: when static fallback is used and what risk it avoids.

## Day 6: Type41

Read `TencentUpdateSmbiosType41 -> OemUpdateSmbiosType41Table`.

Output: difference between onboard device and slot.

## Day 7: Review And Exam

Use the five required exam types for Type9 and Type41.

Output: update `weakness.md` and choose next week's three priorities.

