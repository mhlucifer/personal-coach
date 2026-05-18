# CXL Roadmap

Current direction: CXL-first, with only the PCIe spine needed to understand CXL.

Do not start by learning all of PCIe. Learn the PCIe pieces that explain how BIOS/OS discover, configure, map, and expose CXL devices.

## Level 0: PCIe Spine For CXL

- Topology: Root Complex, Root Port, Switch, Endpoint, BDF.
- Config space: Vendor ID, Device ID, Class Code, Capability, Extended Capability.
- BAR and MMIO: why firmware and OS allocate address resources.
- Link basics: speed, width, training result, and debug visibility.
- Services to recognize: Hotplug, AER, ACS, ATS, PASID, PRI.

Success: explain why a CXL device is first discovered as a PCIe device.

## Level 1: CXL Mental Model

- CXL.io: PCIe-like control and discovery path.
- CXL.cache: device coherently caching host memory.
- CXL.mem: host accessing device-attached memory.
- Device types: Type 1, Type 2, Type 3.

Success: explain what each protocol is for without reading the full spec.

## Level 2: CXL Discovery And Capabilities

- CXL DVSEC.
- DOE as a mailbox-like discovery mechanism.
- CDAT as device-provided information for platform/OS decisions.
- Basic relationship between PCIe enumeration and CXL-specific discovery.

Success: identify which part is standard PCIe and which part becomes CXL-specific.

## Level 3: Memory Decode And Exposure

- HDM Decoder purpose.
- Host-managed device memory window.
- Interleave idea at a conceptual level.
- ACPI visibility: SRAT, HMAT, CEDT at owner-level.

Success: explain how CXL memory becomes visible and usable to the OS.

## Level 4: BIOS Owner View

- What firmware must initialize or expose.
- What OS handles later.
- Where logs should be added for discovery, resource, and memory-map issues.
- How to localize a failure: PCIe enumeration, CXL discovery, decoder setup, ACPI exposure, or OS consumption.

Success: produce a debug plan for a CXL device not appearing or memory not being exposed.

## Paused / Later

- Full PCIe spec coverage.
- Full CXL spec reading from page 1.
- Deep coherency protocol details.
- Performance tuning before basic discovery and exposure are clear.

