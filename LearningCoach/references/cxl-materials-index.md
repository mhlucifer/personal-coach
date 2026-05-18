# CXL Materials Index

Raw CXL materials are local-only and ignored by Git.

## Local-Only Source

- CXL 3.1 specification PDF is stored under the ignored `local-materials/cxl/specs/` folder.
- PCI Express Base 5.0 PDF is stored under the ignored `local-materials/pcie/specs/` folder.
- Do not upload the PDF, screenshots, copied excerpts, or long spec text.

## Safe Shared Tags

- Route: BIOS / CXL
- Current method: CXL-first PCIe spine
- First learning point: why CXL devices are discovered through PCIe first
- Related roadmap: `roadmap/cxl-roadmap.md`
- Workflow: `workflows/cxl-first-pcie-spine.md`

## Reading Strategy

Use the spec as a reference, not as a book to read linearly.

Start from questions:

- How is the device discovered?
- Which PCIe capability points to CXL-specific information?
- What memory/resource window is required?
- How does firmware expose the result to the OS?
- Where can a BIOS engineer add logs or verify state?
