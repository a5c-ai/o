import argparse
import json
from pathlib import Path


def read_text_guessing_encoding(path: Path) -> str:
    data = path.read_bytes()
    for enc in ("utf-8-sig", "utf-8", "utf-16", "utf-16-le", "utf-16-be", "cp1252"):
        try:
            return data.decode(enc)
        except Exception:
            continue
    return data.decode("utf-8", errors="replace")


def iter_candidate_offsets(text: str):
    for i, ch in enumerate(text):
        if ch == "{" or ch == "[":
            yield i


def extract_last_json(text: str):
    decoder = json.JSONDecoder()
    best_end = -1
    best_value = None
    for i in iter_candidate_offsets(text):
        try:
            value, end = decoder.raw_decode(text, i)
        except Exception:
            continue
        if end >= best_end:
            best_end = end
            best_value = value
    return best_value


def main():
    ap = argparse.ArgumentParser(
        description="Extract the last JSON object/array from a transcript-like file."
    )
    ap.add_argument("input", type=Path)
    ap.add_argument("-o", "--output", type=Path, default=None)
    ap.add_argument("--pretty", action="store_true")
    args = ap.parse_args()

    text = read_text_guessing_encoding(args.input)
    value = extract_last_json(text)
    if value is None:
        raise SystemExit(f"No JSON found in {args.input}")

    out = (
        json.dumps(value, indent=2, ensure_ascii=True)
        if args.pretty
        else json.dumps(value, separators=(",", ":"), ensure_ascii=True)
    )

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(out + "\n", encoding="utf-8")
    else:
        print(out)


if __name__ == "__main__":
    main()
