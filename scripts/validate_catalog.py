#!/usr/bin/env python3
"""Validate the website catalogs against the current SneppX-Alg repository."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOGS = ("data/components.json", "data/features.json")


def validate_catalog(path: Path, core_root: Path) -> list[str]:
    errors: list[str] = []
    try:
        records = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"{path.relative_to(ROOT)}: cannot read valid JSON: {exc}"]

    if not isinstance(records, list):
        return [f"{path.relative_to(ROOT)}: expected a JSON array"]

    seen_ids: set[str] = set()
    for index, record in enumerate(records):
        label = f"{path.relative_to(ROOT)}[{index}]"
        if not isinstance(record, dict):
            errors.append(f"{label}: expected an object")
            continue

        record_id = record.get("id")
        if not isinstance(record_id, str) or not record_id.strip():
            errors.append(f"{label}: missing non-empty id")
        elif record_id in seen_ids:
            errors.append(f"{label}: duplicate id {record_id!r}")
        else:
            seen_ids.add(record_id)

        for field in ("title", "description", "source"):
            value = record.get(field)
            if not isinstance(value, str) or not value.strip():
                errors.append(f"{label}: missing non-empty {field}")
                continue
            if field == "source":
                target = (core_root / value.rstrip("/")).resolve()
                if core_root not in target.parents and target != core_root:
                    errors.append(f"{label}: source path escapes core repository: {value}")
                elif not target.exists():
                    errors.append(f"{label}: source does not exist in core repository: {value}")

        test_path = record.get("test")
        if test_path:
            if not isinstance(test_path, str):
                errors.append(f"{label}: test must be a path string")
            else:
                target = (core_root / test_path.rstrip("/")).resolve()
                if core_root not in target.parents and target != core_root:
                    errors.append(f"{label}: test path escapes core repository: {test_path}")
                elif not target.exists():
                    errors.append(f"{label}: test does not exist in core repository: {test_path}")

    print(f"{path.relative_to(ROOT)}: validated {len(records)} records")
    return errors



def validate_pwa_assets() -> list[str]:
    """Check precached paths and ensure every HTML page opts into the PWA."""
    errors: list[str] = []
    service_worker = ROOT / "sw.js"
    try:
        worker_text = service_worker.read_text(encoding="utf-8")
    except OSError as exc:
        return [f"sw.js: cannot read service worker: {exc}"]

    assets = re.findall(r"^\s*'([^']+)'", worker_text, flags=re.MULTILINE)
    if not assets:
        errors.append("sw.js: no precache assets found")

    for asset in assets:
        relative = Path(asset)
        if relative.is_absolute() or ".." in relative.parts:
            errors.append(f"sw.js: unsafe precache path: {asset}")
            continue
        target = (ROOT / relative).resolve()
        if ROOT.resolve() not in target.parents and target != ROOT.resolve():
            errors.append(f"sw.js: precache path escapes website root: {asset}")
        elif not target.exists():
            errors.append(f"sw.js: precache asset does not exist: {asset}")

    for page in sorted(ROOT.glob("*.html")):
        html = page.read_text(encoding="utf-8")
        label = page.relative_to(ROOT)
        if 'rel="manifest"' not in html:
            errors.append(f"{label}: missing web app manifest link")
        if "js/sw-register.js" not in html:
            errors.append(f"{label}: missing service worker registration")
        if 'id="hamburger"' in html and (
            'aria-controls="siteNav"' not in html or 'id="siteNav"' not in html
        ):
            errors.append(f"{label}: mobile navigation control is not connected to its nav")

    print(f"sw.js: validated {len(assets)} precache entries and {len(list(ROOT.glob('*.html')))} HTML pages")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--core", type=Path, required=True, help="Path to a checkout of SneppX/sneppx-alg")
    args = parser.parse_args()
    core_root = args.core.resolve()
    if not core_root.is_dir():
        parser.error(f"core repository directory does not exist: {core_root}")

    errors: list[str] = []
    for relative in CATALOGS:
        errors.extend(validate_catalog(ROOT / relative, core_root))
    errors.extend(validate_pwa_assets())

    if errors:
        print("\nCatalog validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print("Catalog validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
