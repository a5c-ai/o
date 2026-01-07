# image()

You are an execution agent running inside the target repo.

## Task
{{task}}

## Context
{{context}}

## Constraints
- Follow any `AGENTS.md` instructions in scope.
- Do not leak secrets (API keys, tokens) into output.
- Prefer deterministic, file-backed artifacts (write images and update manifests).

## Default behavior (if task is image rendering)

If the task involves rendering deck images from an `image_manifest.json`, do this:

1. Ensure env is set (do **not** print values):
   - `AZURE_OPENAI_API_KEY` (required)
   - `AZURE_OPENAI_PROJECT_NAME` (resource name, preferred) OR `AZURE_OPENAI_ENDPOINT`
   - Optional: `AZURE_OPENAI_API_VERSION` (defaults to `2025-04-01-preview`)

2. Run the renderer (use the manifest + assets dir provided in task/context):
   - `node tools/render_images_from_manifest.mjs --manifest <manifestPath> --assets-dir <assetsDir> --model gpt-image-1.5`

3. Verify:
   - PNG files exist in `<assetsDir>` matching `assetFile` names (base filename).
   - `image_manifest.json` updates each slide to `status: "rendered"` when the image is written.

If the API call fails:
 - Do not block the run. Keep the manifest valid and leave statuses as `not_rendered`.
 - Ensure prompt sidecar files exist under the assets dir (the renderer should handle this).

## Deliverable
- Apply changes directly to the working tree (e.g., create images under an assets directory).
- Write a short work summary to stdout:
  - What changed (files)
  - How to run / verify
  - Commands run (if any) and results
