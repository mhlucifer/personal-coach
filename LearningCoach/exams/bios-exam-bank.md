# BIOS Exam Bank

## Current High-Value Starter Set

1. Concept: In the selected BIOS topic, what is the difference between data source, transformation, and output?
2. Code trace: Trace the selected path from entry point to final consumer.
3. Modification risk: Which board, phase, or config assumption could break if this path changes?
4. Debug: Where would you add the first three logs, and what value should each prove?
5. Boundary: What input, board variant, or missing dependency would invalidate the normal path?

## Paused SMBIOS / Type9 Set

Use this only after updated materials arrive or the user asks.

1. Concept: Why is SMBIOS Type9 a slot table rather than a device table?
2. Code trace: Trace `TencentType9UpdateMain -> UpdateSmbiosType9TableSysSlot -> FindAllRootBridgeAndDownStreamPort`.
3. Modification risk: What could break if `SlotID` mapping changes without checking board slot numbering?
4. Debug: Which logs would you add to prove `RootBridge->CurrentLinkWidth` affected `SlotDataBusWidth`?
5. Boundary: What should happen when `CurrentLinkWidth == 0`?

## Paused Type41 Set

Use this only after updated materials arrive or the user asks.

1. Concept: What is the difference between Type9 and Type41?
2. Code trace: Why does Type41 use a ReadyToBoot event?
3. Modification risk: What could break if a missing onboard device is still kept in Type41?
4. Debug: How would you verify Bus/Dev/Fun in Type41?
5. Boundary: What happens if the SMBIOS protocol cannot be located?
