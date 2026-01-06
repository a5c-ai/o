## Adding a role (single source of truth)

The canonical registry is `/.a5c/processes/roles/index.js` via the exported `roleRegistry` object.

### Steps

1) Create a new role module in `/.a5c/processes/roles/` (or a subfolder with its own `index.js`).
   - Export one or more role functions (typically wrappers around the quality gate runner).
   - Prefer JSON-only outputs with explicit required keys and determinism requirements.

2) Wire the role into `/.a5c/processes/roles/index.js`:
   - Add `export * from "./your_role.js";` (or `export * as your_role from "./your_role/index.js";` for a folder role).
   - Add an `import * as yourRole from "./your_role.js";`
   - Add an entry to `roleRegistry` using the canonical key (snake_case), e.g. `your_role: yourRole`.

3) (Optional) Add a fixture for any JSON contract you care about stabilizing.
   - Put minimal examples under `/.a5c/fixtures/` so they can be referenced by verification commands.

### Cheap verification

- Import safety: `node -e "import('./.a5c/processes/roles/index.js')"`
- Registry/exports sanity: `node -e "import('./.a5c/processes/validate.js').then(m=>m.validateA5cProcesses({throwOnError:true}))"`

## Related registries

- Process barrel: `/.a5c/processes/index.js`
- Core loop exports: `/.a5c/processes/core/loops/index.js`
