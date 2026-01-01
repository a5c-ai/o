# Install `o`

## One-line install (macOS/Linux)

Installs `o` + `.a5c/` templates into the current directory:

```bash
curl -fsSL https://raw.githubusercontent.com/a5c-ai/o/main/install.sh | bash -s -- --to .
```

## What it installs

- `./o` (made executable when `chmod` is supported)
- `./.a5c/o.md`
- `./.a5c/functions/`
- `./.a5c/processes/`

It also creates/updates `./.gitignore` with a single managed block to ignore:

- `.a5c/creds.env`
- `.a5c/creds.env.tmp.*`
- `.a5c/runs/`

## Options

```bash
curl -fsSL https://raw.githubusercontent.com/a5c-ai/o/main/install.sh | bash -s -- [OPTIONS]
```

- `--to DIR` target directory (default: current directory)
- `--force` overwrite existing `o` / `.a5c/{o.md,functions,processes}`
- `--no-gitignore` do not modify target `.gitignore`
- `--help` show usage

## Verify

From your target directory:

```bash
./o help
./o init
./o doctor
```

## Windows note

`o` and the installer are Bash. On Windows, use **WSL2** (recommended) or **Git Bash/MSYS2**.

## Local smoke test (repo only)

From a clone of this repo:

```bash
./install.sh --smoke-test
```

