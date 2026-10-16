# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6", "jsonschema>=4.20"]
# ///
"""Validate spec/pieces.yaml against spec/pieces.schema.json, plus cross-reference checks."""
import json
import sys
from pathlib import Path

import jsonschema
import yaml

root = Path(__file__).resolve().parent.parent
schema = json.loads((root / "pieces.schema.json").read_text())
doc = yaml.safe_load((root / "pieces.yaml").read_text())

errors = [f"{'/'.join(map(str, e.path)) or '<root>'}: {e.message}"
          for e in jsonschema.Draft202012Validator(schema).iter_errors(doc)]

pieces = doc.get("pieces", []) if isinstance(doc, dict) else []
ids = [p.get("id") for p in pieces]
for dup in {i for i in ids if ids.count(i) > 1}:
    errors.append(f"duplicate id: {dup}")
known = set(ids)
for p in pieces:
    for ref in p.get("composes", []):
        if ref not in known:
            errors.append(f"{p.get('id')}: composes unknown piece '{ref}'")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"ok: {len(pieces)} pieces valid ({sum(bool(p['mvp']) for p in pieces)} mvp)")
