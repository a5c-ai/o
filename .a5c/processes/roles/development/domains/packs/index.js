/**
 * Packs barrel export.
 *
 * Canonical registry wiring lives in `./registry.js` (single source of truth for pack lists).
 * Prefer importing `packRegistry` / `getDomainPlanningPack` rather than deep-importing pack files.
 */
export * from "./registry.js";

