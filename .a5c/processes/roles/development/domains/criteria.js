const maybeAdd = (arr, enabled, ...items) => {
  if (!enabled) return arr;
  arr.push(...items);
  return arr;
};

export const buildBackendQualityCriteria = (task, ctx = {}, enabled = {}) => {
  const criteria = [
    "Spec has clear acceptance criteria and edge cases",
    "Test and verification plan is actionable and executed where possible",
    "Implementation is correct, minimal, and maintainable",
  ];

  maybeAdd(criteria, enabled.errorHandling, "Error handling covers failure modes, timeouts, and retries");
  maybeAdd(criteria, enabled.security, "Security risks are assessed (inputs, authz/authn, secrets, deps)");
  maybeAdd(criteria, enabled.ops, "Ops readiness: monitoring, runbook, rollback, safe deploy strategy");
  maybeAdd(criteria, enabled.docs, "Docs and examples are updated as needed");

  return criteria;
};

export const buildFrontendQualityCriteria = (task, ctx = {}, enabled = {}) => {
  const criteria = [
    "Spec includes UX behavior and acceptance criteria",
    "UI is usable and polished (empty states, loading, errors)",
    "Verification plan is actionable (unit, e2e, manual checks)",
  ];

  maybeAdd(criteria, enabled.performance, "Performance impact is assessed and measured where appropriate");
  maybeAdd(criteria, enabled.docs, "Docs and examples are updated as needed");

  return criteria;
};

export const buildInfraQualityCriteria = (task, ctx = {}, enabled = {}) => {
  const criteria = [
    "Spec covers rollout and rollback strategy",
    "Changes are safe and repeatable (idempotent where applicable)",
    "Verification plan is actionable (plan, diff, smoke checks)",
  ];

  maybeAdd(criteria, enabled.security, "Security risks are assessed (IAM, network exposure, secrets)");
  maybeAdd(criteria, enabled.ops, "Operational readiness: monitoring, alerts, runbooks");
  maybeAdd(criteria, enabled.docs, "Docs and runbooks are updated as needed");

  return criteria;
};

export const buildDataQualityCriteria = (task, ctx = {}, enabled = {}) => {
  const criteria = [
    "Spec includes correctness constraints and success metrics",
    "Verification plan covers accuracy, performance, and backfill/migration if needed",
    "Results are reproducible and auditable",
  ];

  maybeAdd(criteria, enabled.dataDriven, "Work includes metrics/logging/experiments to validate impact");
  return criteria;
};

export const buildWorkersQualityCriteria = (task, ctx = {}, enabled = {}) => {
  const criteria = [
    "Spec covers concurrency, ordering, and idempotency expectations",
    "Verification plan covers retries, timeouts, and failure modes",
    "Operational readiness is considered (queues, metrics, alerts)",
  ];

  maybeAdd(criteria, enabled.errorHandling, "Error handling covers retries/backoff, poison messages, and DLQ strategy");
  maybeAdd(criteria, enabled.ops, "Ops readiness: monitoring, runbooks, safe deploy strategy");
  return criteria;
};

export const buildSdkQualityCriteria = (task, ctx = {}, enabled = {}) => {
  const criteria = [
    "Public API is consistent, ergonomic, and documented",
    "Semver and backward compatibility considerations are explicit",
    "Test and verification plan covers integration and examples",
  ];

  maybeAdd(criteria, enabled.refactor, "Refactor guardrails are followed and diffs stay minimal");
  maybeAdd(criteria, enabled.docs, "Docs and examples are updated as needed");
  return criteria;
};

export const buildPackageQualityCriteria = (task, ctx = {}, enabled = {}) => {
  const criteria = [
    "Build and packaging steps are validated (install, build, publish dry-run if possible)",
    "Versioning and changelog/release notes are addressed where appropriate",
    "Verification plan is actionable and executed where possible",
  ];

  maybeAdd(criteria, enabled.git, "Commit plan and file hygiene are reasonable");
  maybeAdd(criteria, enabled.docs, "Docs and examples are updated as needed");
  return criteria;
};

export const buildIntegrationQualityCriteria = (task, ctx = {}, enabled = {}) => {
  const criteria = [
    "Spec covers contracts, edge cases, and failure handling",
    "Verification plan includes integration tests and safe sandboxing where applicable",
    "Observability and supportability are considered (logs, metrics, tracing)",
  ];

  maybeAdd(criteria, enabled.security, "Security risks are assessed (auth, secrets, PII, partner risk)");
  maybeAdd(criteria, enabled.docs, "Docs are updated (setup, configs, runbooks)");
  return criteria;
};

