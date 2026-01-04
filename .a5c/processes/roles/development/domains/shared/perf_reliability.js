export const perfChecklist = () => [
  "Define latency and throughput expectations for the critical path",
  "Avoid obvious N+1 patterns; bound work per request/job",
  "Prefer caching only when correctness and invalidation are clear",
  "Measure and set budgets (CPU/memory/network) where relevant",
];

export const reliabilityChecklist = () => [
  "Define retry policy with backoff and jitter where applicable",
  "Add timeouts and circuit breakers for remote dependencies",
  "Ensure idempotency for retries and at-least-once delivery",
  "Handle partial failure and degraded modes explicitly",
];

export const perfReliabilityPlanTemplate = () => ({
  schema: "perf_reliability_plan/v1",
  budgets: [],
  loadProfile: [],
  bottlenecks: [],
  mitigations: [],
  chaosOrFailureTesting: [],
});

export const PERF_RELIABILITY_PROMPT = [
  "Create a performance and reliability plan for the task.",
  "Return short bullets grouped by: budgets, load profile, bottlenecks, mitigations, failure testing.",
].join("\n");

