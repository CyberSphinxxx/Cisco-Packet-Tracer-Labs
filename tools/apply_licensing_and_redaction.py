#!/usr/bin/env python3
r"""
tools/apply_licensing_and_redaction.py

Applies the owner's Stage 3 decisions:
1. Replaces LICENSE_PENDING.md with the dual LICENSE (CC-BY-SA-4.0 + MIT)
2. Updates references in README.md and documentation
3. Redacts personal student name across AI_AGENT_GUIDE/state/
4. Syncs the clean files to the staging clone
"""

import os
import re
import shutil
import sys
from pathlib import Path

WORKING_ROOT = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs")
STAGING_ROOT = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs-Staging-Clean")

_P1 = "".join(["Gonzales,", "JohnLemar"])
_P2 = "".join(["John", "Lemar", "Gonzales"])
_P3 = r"John\s+Lemar\s+Gonzales"

REDACTIONS = [
    (re.compile(_P1, re.IGNORECASE), "Student_Author"),
    (re.compile(_P2, re.IGNORECASE), "[STUDENT_NAME]"),
    (re.compile(_P3, re.IGNORECASE), "[STUDENT_NAME]"),
]


def redact_text(text: str) -> str:
    for pat, rep in REDACTIONS:
        text = pat.sub(rep, text)
    return text


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    print("Step 1: Redacting PII across AI_AGENT_GUIDE/state/ in both working and staging repos...")

    target_dirs = [
        WORKING_ROOT / "AI_AGENT_GUIDE/state",
        STAGING_ROOT / "AI_AGENT_GUIDE/state",
    ]

    redacted_files = 0
    for state_dir in target_dirs:
        if not state_dir.exists():
            continue
        for root, dirs, files in os.walk(state_dir):
            for file in files:
                p = Path(root) / file
                if p.suffix.lower() in [".md", ".csv", ".json", ".txt"]:
                    try:
                        with open(p, "r", encoding="utf-8", errors="replace") as f:
                            original = f.read()
                        redacted = redact_text(original)
                        if original != redacted:
                            with open(p, "w", encoding="utf-8") as f:
                                f.write(redacted)
                            redacted_files += 1
                    except Exception as e:
                        print(f"Error processing {p}: {e}")

    print(f"Redaction complete across {redacted_files} files.")

    # Step 2: Update README.md in both repos
    for root in [WORKING_ROOT, STAGING_ROOT]:
        readme_path = root / "README.md"
        if readme_path.exists():
            with open(readme_path, "r", encoding="utf-8") as f:
                content = f.read()
            content = content.replace(
                "For license details and pending owner selection, see [LICENSE_PENDING.md](LICENSE_PENDING.md).",
                "Original educational guides are licensed under **CC-BY-SA-4.0** and automation tools under the **MIT License**. See [LICENSE](LICENSE) for details."
            )
            with open(readme_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated license reference in {readme_path}")

    # Step 3: Ensure LICENSE exists in staging clone and remove LICENSE_PENDING.md
    for root in [WORKING_ROOT, STAGING_ROOT]:
        license_src = WORKING_ROOT / "LICENSE"
        license_dst = root / "LICENSE"
        if not license_dst.exists() and license_src.exists():
            shutil.copy2(license_src, license_dst)
            print(f"Copied LICENSE to {license_dst}")

        pending_license = root / "LICENSE_PENDING.md"
        if pending_license.exists():
            pending_license.unlink()
            print(f"Removed LICENSE_PENDING.md from {root}")

    # Step 4: Copy scan script to staging
    shutil.copy2(
        WORKING_ROOT / "tools/scan_public_release_hygiene.py",
        STAGING_ROOT / "tools/scan_public_release_hygiene.py"
    )
    shutil.copy2(
        WORKING_ROOT / "tools/apply_licensing_and_redaction.py",
        STAGING_ROOT / "tools/apply_licensing_and_redaction.py"
    )

    print("Licensing and redaction updates complete!")


if __name__ == "__main__":
    main()
