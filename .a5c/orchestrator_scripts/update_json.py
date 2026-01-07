import argparse
import json
from pathlib import Path


def set_path(obj, path: str, value):
    parts = path.split(".")
    cur = obj
    for p in parts[:-1]:
        if p not in cur or not isinstance(cur[p], dict):
            cur[p] = {}
        cur = cur[p]
    cur[parts[-1]] = value


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Update a JSON file in-place via --set dotted.path=<json_value> (repeatable)."
    )
    ap.add_argument("file", type=Path)
    ap.add_argument("--set", dest="sets", action="append", default=[])
    ap.add_argument("--pretty", action="store_true")
    args = ap.parse_args()

    obj = {}
    if args.file.exists():
        obj = json.loads(args.file.read_text(encoding="utf-8-sig"))

    for s in args.sets:
        if "=" not in s:
            raise SystemExit(f"Invalid --set (missing '='): {s}")
        key, raw = s.split("=", 1)
        value = json.loads(raw)
        set_path(obj, key, value)

    args.file.parent.mkdir(parents=True, exist_ok=True)
    if args.pretty:
        args.file.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    else:
        args.file.write_text(json.dumps(obj, separators=(",", ":"), ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
