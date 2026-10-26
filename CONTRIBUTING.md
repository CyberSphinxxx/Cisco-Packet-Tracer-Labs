# Contributing to Cisco Packet Tracer Labs

Thank you for your interest in improving the **Cisco Packet Tracer Learning Library**! This repository provides open, accurate, high-quality educational guides and topologies for BSIT students and independent networking learners.

---

## 1. Content Policy and Intellectual Property

> [!CAUTION]
> **Zero Tolerance for Copyrighted / Proprietary Material:**
> - **DO NOT upload proprietary Cisco Networking Academy assessment packages (`.pka` files).**
> - **DO NOT upload instructor answer keys, test bank dumps, or exam solution documents.**
> - **DO NOT copy text verbatim from proprietary textbooks, course slides, or protected certification materials.**

All contributed lab tutorials, explanations, and topology diagrams must be **100% original work** authored by the contributor or accompanied by explicit written redistribution rights.

---

## 2. Lab Structure Standards

Every lab in this repository must live under its canonical category folder:

```text
labs/<category>/<slug>/
├── README.md        # Complete 11-section educational tutorial
├── metadata.json    # Machine-readable schema metadata
├── configs/         # Clean-text Cisco IOS configuration snippets (.txt or .ios)
└── assets/          # (Optional) Original .pkt binary or diagram assets
```

### Canonical Categories
All labs must belong to one of the 8 canonical categories:
- `network-fundamentals`
- `ip-addressing`
- `switching`
- `routing`
- `network-services`
- `network-security`
- `wireless-wan`
- `troubleshooting`

---

## 3. Mandatory 11-Section Lab Contract

All lab `README.md` documents must use the template at [`templates/lab-README.md`](templates/lab-README.md) and implement all 11 standardized level-2 headings:

1. `## Learning Objectives`
2. `## Prerequisites`
3. `## Topology`
4. `## Addressing Table`
5. `## Lab Tasks`
6. `## Configuration Walkthrough`
7. `## Verification`
8. `## Troubleshooting`
9. `## Key Takeaways`
10. `## References`
11. `## Files and Validation Status`

---

## 4. Honest Simulator Status Standard

We maintain strict technical honesty regarding simulator testing:
- If a lab was authored and technically reviewed through Cisco IOS documentation and RFCs, but has **not** been run through the physical Packet Tracer application, record its status as:
  ```json
  "status": {
    "documentation": "reviewed",
    "simulator": "not_tested",
    "simulator_evidence": null
  }
  ```
- **Never claim `tested_pass` without verifiable evidence.** Fabricated test results or false pass claims will result in immediate PR rejection.

---

## 5. Local Validation Before Submitting

Before submitting a Pull Request, you must verify that your lab passes all repository validation gates:

```bash
# 1. Run the offline static schema and link validator
python tools/validate_repo.py --root .

# 2. Run the automated unit test suite
python -m unittest discover -s tests -p "test_*.py" -v
```

Both commands must exit with code `0`.

---

## 6. Pull Request Process

1. **Fork the repository** and create a feature branch (`git checkout -b feature/my-new-lab`).
2. Follow the naming conventions:
   - Lab folder slug: lowercase kebab-case (e.g., `ospfv3-multi-area`).
   - Lab ID: Sequential `PTL-####` (check [`docs/lab-index.md`](docs/lab-index.md) for the next available ID).
3. Update [`docs/lab-index.md`](docs/lab-index.md) to register your new lab.
4. Run the validator and test suite locally.
5. Submit a Pull Request clearly describing the learning objectives, reference standards, and whether Packet Tracer binaries are included.
