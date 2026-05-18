# BIOS Exam Bank

## Type9 Starter Set

1. Concept: Why is SMBIOS Type9 a slot table rather than a device table?
2. Code trace: Trace `TencentType9UpdateMain -> UpdateSmbiosType9TableSysSlot -> FindAllRootBridgeAndDownStreamPort`.
3. Modification risk: What could break if `SlotID` mapping changes without checking board slot numbering?
4. Debug: Which logs would you add to prove `RootBridge->CurrentLinkWidth` affected `SlotDataBusWidth`?
5. Boundary: What should happen when `CurrentLinkWidth == 0`?

## Type41 Starter Set

1. Concept: What is the difference between Type9 and Type41?
2. Code trace: Why does Type41 use a ReadyToBoot event?
3. Modification risk: What could break if a missing onboard device is still kept in Type41?
4. Debug: How would you verify Bus/Dev/Fun in Type41?
5. Boundary: What happens if the SMBIOS protocol cannot be located?

