#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="install.sh"
REPO_OWNER="a5c-ai"
REPO_NAME="o"
REPO_REF_DEFAULT="main"

MANAGED_BEGIN="# --- a5c-ai/o install.sh managed ---"
MANAGED_END="# --- end a5c-ai/o install.sh managed ---"

usage() {
  cat <<'EOF'
Install `o` + `.a5c/` templates into a target directory.

Usage:
  install.sh [--to DIR] [--force] [--no-gitignore]
  install.sh --smoke-test
  install.sh --help

Options:
  --to DIR         Target directory (default: current directory)
  --force          Overwrite existing installed files/directories
  --no-gitignore   Do not create/update target .gitignore
  --smoke-test     Run local smoke tests in a temp dir
  --help           Show this help

Notes:
  - macOS/Linux supported. On Windows, use WSL2 or Git Bash/MSYS2.
  - This installer downloads the repo tarball from GitHub (no git required).
EOF
}

log() { printf '%s\n' "$*"; }
die() { printf 'Error: %s\n' "$*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

mktemp_dir() {
  if command -v mktemp >/dev/null 2>&1; then
    mktemp -d 2>/dev/null || mktemp -d -t "o-install"
  else
    die "mktemp not found"
  fi
}

abs_path() {
  # Prints an absolute path without requiring realpath(1).
  local p="$1"
  if [[ "$p" == /* ]]; then
    printf '%s\n' "$p"
    return 0
  fi
  printf '%s/%s\n' "$(pwd -P)" "$p"
}

script_dir_or_empty() {
  local src="${BASH_SOURCE[0]:-}"
  [[ -n "$src" && -f "$src" ]] || return 1
  (cd "$(dirname "$src")" && pwd -P)
}

local_source_root_or_empty() {
  # If install.sh is being run from a repo checkout (not piped via stdin),
  # use the adjacent files as the installation source.
  local sdir
  sdir="$(script_dir_or_empty 2>/dev/null || true)"
  [[ -n "$sdir" ]] || return 1
  [[ -f "${sdir%/}/o" ]] || return 1
  [[ -f "${sdir%/}/.a5c/o.md" ]] || return 1
  [[ -d "${sdir%/}/.a5c/functions" ]] || return 1
  [[ -d "${sdir%/}/.a5c/processes" ]] || return 1
  printf '%s\n' "$sdir"
}

download_tarball() {
  local dest_tgz="$1"
  local ref="${2:-$REPO_REF_DEFAULT}"

  local url="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/tarball/${ref}"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$dest_tgz"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$dest_tgz" "$url"
  else
    die "Need curl or wget to download $url"
  fi
}

extract_tarball() {
  local tgz="$1"
  local dest_dir="$2"
  mkdir -p "$dest_dir"
  tar -xzf "$tgz" -C "$dest_dir"

  local top
  top="$(cd "$dest_dir" && ls -1d */ 2>/dev/null | head -n 1 || true)"
  [[ -n "$top" ]] || die "Failed to locate extracted source directory"
  printf '%s\n' "${dest_dir%/}/${top%/}"
}

copy_item() {
  local src="$1"
  local dst="$2"
  local force="$3"

  if [[ -e "$dst" ]]; then
    if [[ "$force" == "1" ]]; then
      rm -rf "$dst"
    else
      die "Refusing to overwrite existing path: $dst (use --force)"
    fi
  fi

  local dst_parent
  dst_parent="$(dirname "$dst")"
  mkdir -p "$dst_parent"

  if [[ -d "$src" ]]; then
    cp -R "$src" "$dst"
  else
    cp "$src" "$dst"
  fi
}

ensure_executable() {
  local path="$1"
  if chmod +x "$path" 2>/dev/null; then
    :
  else
    log "Warning: could not mark executable: $path"
  fi
}

render_gitignore_block() {
  cat <<EOF
$MANAGED_BEGIN
.a5c/creds.env
.a5c/creds.env.tmp.*
.a5c/runs/
$MANAGED_END
EOF
}

update_gitignore() {
  local target_dir="$1"
  local gitignore_path="${target_dir%/}/.gitignore"
  local tmp_path="${gitignore_path}.tmp.$$"
  local block
  block="$(render_gitignore_block)"

  if [[ -f "$gitignore_path" ]]; then
    awk -v begin="$MANAGED_BEGIN" -v end="$MANAGED_END" '
      $0 == begin {inblock=1; next}
      $0 == end {inblock=0; next}
      !inblock {print}
    ' "$gitignore_path" >"$tmp_path"
  else
    : >"$tmp_path"
  fi

  # Ensure file ends with a newline before appending.
  if [[ -s "$tmp_path" ]]; then
    local last_byte
    last_byte="$(tail -c 1 "$tmp_path" 2>/dev/null || true)"
    if [[ "$last_byte" != $'\n' ]]; then
      printf '\n' >>"$tmp_path"
    fi
  fi

  printf '%s\n' "$block" >>"$tmp_path"
  mv -f "$tmp_path" "$gitignore_path"
}

install_into() {
  (
    set -euo pipefail
    local to_dir="$1"
    local force="$2"
    local manage_gitignore="$3"
    local ref="${4:-$REPO_REF_DEFAULT}"

    mkdir -p "$to_dir"

    local src_root=""
    if [[ "${O_INSTALL_DISABLE_LOCAL_SOURCE:-}" != "1" ]]; then
      src_root="$(local_source_root_or_empty 2>/dev/null || true)"
    fi

    local tmp=""
    if [[ -z "$src_root" ]]; then
      require_cmd tar
      tmp="$(mktemp_dir)"
      trap 'rm -rf "$tmp"' EXIT

      local tgz="${tmp%/}/src.tgz"
      local src_extract="${tmp%/}/src"
      log "Downloading ${REPO_OWNER}/${REPO_NAME}@${ref}..."
      download_tarball "$tgz" "$ref"

      log "Extracting..."
      src_root="$(extract_tarball "$tgz" "$src_extract")"
    else
      log "Using local source: $src_root"
    fi

    local src_o="${src_root%/}/o"
    local src_a5c="${src_root%/}/.a5c"
    [[ -f "$src_o" ]] || die "Source missing: o"
    [[ -d "$src_a5c" ]] || die "Source missing: .a5c/"

    local dst_o="${to_dir%/}/o"
    local dst_a5c="${to_dir%/}/.a5c"
    mkdir -p "$dst_a5c"

    copy_item "$src_o" "$dst_o" "$force"
    ensure_executable "$dst_o"

    copy_item "${src_a5c%/}/o.md" "${dst_a5c%/}/o.md" "$force"
    copy_item "${src_a5c%/}/functions" "${dst_a5c%/}/functions" "$force"
    copy_item "${src_a5c%/}/processes" "${dst_a5c%/}/processes" "$force"

    if [[ "$manage_gitignore" == "1" ]]; then
      update_gitignore "$to_dir"
    fi

    log "Installed:"
    log "  ${dst_o}"
    log "  ${dst_a5c}/o.md"
    log "  ${dst_a5c}/functions"
    log "  ${dst_a5c}/processes"
    if [[ "$manage_gitignore" == "1" ]]; then
      log "  ${to_dir%/}/.gitignore (updated)"
    fi
  )
}

smoke_test() {
  (
    set -euo pipefail
    local tmp
    tmp="$(mktemp_dir)"
    trap 'rm -rf "$tmp"' EXIT

    log "Smoke test temp dir: $tmp"

    printf '%s\n' "# keep me" >"${tmp%/}/.gitignore"
    printf '%s\n' "unmanaged-line" >>"${tmp%/}/.gitignore"

    log "Running install (first time)..."
    install_into "$tmp" "0" "1" "$REPO_REF_DEFAULT"

    [[ -f "${tmp%/}/o" ]] || die "Smoke test: missing o"
    [[ -f "${tmp%/}/.a5c/o.md" ]] || die "Smoke test: missing .a5c/o.md"
    [[ -d "${tmp%/}/.a5c/functions" ]] || die "Smoke test: missing .a5c/functions"
    [[ -d "${tmp%/}/.a5c/processes" ]] || die "Smoke test: missing .a5c/processes"

    log "Verifying ./o help..."
    (cd "$tmp" && ./o help >/dev/null)

    log "Running install (second time, expect failure without --force)..."
    if install_into "$tmp" "0" "1" "$REPO_REF_DEFAULT" >/dev/null 2>&1; then
      die "Smoke test: second install unexpectedly succeeded without --force"
    fi

    log "Running install (third time, with --force)..."
    install_into "$tmp" "1" "1" "$REPO_REF_DEFAULT" >/dev/null

    log "Verifying managed .gitignore block (exactly one; preserves unmanaged lines)..."
    local gi="${tmp%/}/.gitignore"
    local begin_count end_count
    begin_count="$(grep -cF "$MANAGED_BEGIN" "$gi" || true)"
    end_count="$(grep -cF "$MANAGED_END" "$gi" || true)"
    [[ "$begin_count" == "1" && "$end_count" == "1" ]] || die "Smoke test: managed block markers not exactly once"
    grep -qF "# keep me" "$gi" || die "Smoke test: unmanaged line missing (# keep me)"
    grep -qF "unmanaged-line" "$gi" || die "Smoke test: unmanaged line missing (unmanaged-line)"

    log "Smoke test OK"
  )
}

main() {
  local to_dir="."
  local force="0"
  local manage_gitignore="1"
  local run_smoke="0"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --to)
        shift
        [[ $# -gt 0 ]] || die "--to requires a directory"
        to_dir="$1"
        ;;
      --force) force="1" ;;
      --no-gitignore) manage_gitignore="0" ;;
      --smoke-test) run_smoke="1" ;;
      --help|-h) usage; exit 0 ;;
      *)
        die "Unknown argument: $1 (use --help)"
        ;;
    esac
    shift
  done

  if [[ "$run_smoke" == "1" ]]; then
    smoke_test
    return 0
  fi

  install_into "$(abs_path "$to_dir")" "$force" "$manage_gitignore" "$REPO_REF_DEFAULT"

  cat <<EOF

Next:
  1) cd "$(abs_path "$to_dir")"
  2) ./o help
  3) ./o init
  4) ./o doctor
EOF
}

main "$@"
