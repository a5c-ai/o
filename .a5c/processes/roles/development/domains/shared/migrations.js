export const schemaCompatibilityChecklist = () => [
  "Prefer expand/contract changes over in-place breaking changes",
  "Ensure old and new versions can run concurrently during rollout",
  "Add data validation (counts, checksums, invariants) for backfills",
  "Define rollback strategy for schema and data separately",
  "Plan for long-running migrations (chunking, throttling, resumability)",
];

export const migrationPlanTemplate = () => ({
  schema: "migration_plan/v1",
  compatStrategy: "expand-contract",
  changes: [],
  backfillPlan: [],
  validation: [],
  rollback: [],
  runbook: [],
});

export const MIGRATION_PROMPT = [
  "Create a migration plan for schema/data changes.",
  "Return short bullets grouped by: changes, backfill, validation, rollback, runbook.",
  "Assume concurrent versions during rollout; avoid downtime assumptions.",
].join("\n");

