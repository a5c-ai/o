import argparse
import json
from datetime import datetime
from pathlib import Path


def _read_last_event_id(journal: Path) -> int:
    if not journal.exists():
        return 0

    # Read from the end to avoid loading huge journals.
    data = journal.read_bytes()
    if not data:
        return 0

    # Grab a chunk from the end and parse the last non-empty JSONL line.
    chunk = data[-256_000:]
    text = chunk.decode("utf-8", errors="replace")
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if not lines:
        return 0

    # If the chunk cut a line in half, try a few lines from the end.
    for ln in reversed(lines[-50:]):
        try:
            obj = json.loads(ln)
        except Exception:
            continue
        if "id" in obj:
            return int(obj["id"])
    return 0


def main() -> None:
    ap = argparse.ArgumentParser(description="Append a JSON event to a journal.jsonl file.")
    ap.add_argument("journal", type=Path)
    ap.add_argument("event", type=str)
    ap.add_argument("--data-json", type=str, default=None)
    ap.add_argument("--data-file", type=Path, default=None)
    ap.add_argument("--timestamp", type=str, default=None)
    ap.add_argument("--type", type=str, default="event")
    args = ap.parse_args()

    if args.data_file:
        data = json.loads(args.data_file.read_text(encoding="utf-8-sig"))
    else:
        data = json.loads(args.data_json) if args.data_json else {}
    last_id = _read_last_event_id(args.journal)
    next_id = last_id + 1

    ts = args.timestamp or datetime.now().astimezone().isoformat()
    entry = {"timestamp": ts, "event": args.event, "id": str(next_id), "type": args.type, "data": data}

    args.journal.parent.mkdir(parents=True, exist_ok=True)
    with args.journal.open("a", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(entry, separators=(",", ":"), ensure_ascii=False) + "\n")

    print(next_id)


if __name__ == "__main__":
    main()
