export const domainAliases = {
  ui: "frontend",
  fe: "frontend",
  be: "backend",
  infrastructure: "infra",
  worker: "workers",
  jobs: "workers",
  pkg: "package",
  next: "nextjs_app",
  nextjs: "nextjs_app",
  rn: "react_native_app",
  reactnative: "react_native_app",
  aws: "aws_cloud",
  dynamodb: "aws_dynamodb",
  ddb: "aws_dynamodb",
  k8s: "kubernetes_service",
  kubernetes: "kubernetes_service",
  cloudrun: "gcp_cloudrun",
  gcp: "gcp_cloud",
  postgres: "postgres_db",
  postgresql: "postgres_db",
  redis: "redis_cache",
  kafka: "event_streaming",
  streaming: "event_streaming",
  events: "messaging",
  fastapi: "fastapi_service",
  graphql: "graphql_api",
  grpc: "grpc_service",
  rails: "rails_app",
  ruby_on_rails: "rails_app",
  django: "django_app",
  spring: "spring_boot_service",
  springboot: "spring_boot_service",
  dotnet: "dotnet_webapi",
  aspnet: "dotnet_webapi",
  terraform: "terraform_module",
  tf: "terraform_module",
  helm: "helm_chart",
  azure: "azure_cloud",
  stripe: "stripe_integration",
  express: "express_service",
  nestjs: "nestjs_service",
  flask: "flask_service",
  golang: "go_service",
  go: "go_service",
  rust: "rust_service",
  vue: "vue_app",
  vuejs: "vue_app",
  svelte: "sveltekit_app",
  sveltekit: "sveltekit_app",
  angular: "angular_app",
  flutter: "flutter_app",
  dart: "flutter_app",
  s3: "aws_s3",
  aws_s3: "aws_s3",
  sqs: "aws_sqs",
  aws_sqs: "aws_sqs",
  eventbridge: "aws_eventbridge",
  rds: "aws_rds_postgres",
  rds_postgres: "aws_rds_postgres",
  aws_rds: "aws_rds_postgres",
  pubsub: "gcp_pubsub",
  gcp_pubsub: "gcp_pubsub",
  firestore: "gcp_firestore",
  cosmos: "azure_cosmosdb",
  cosmosdb: "azure_cosmosdb",
  servicebus: "azure_servicebus",
  cli: "cli_tool",
};

export const normalizeDomainName = (domain, fallback = "backend") => {
  const raw = domain == null ? fallback : domain;
  const normalized = String(raw).toLowerCase().trim();
  if (!normalized) return fallback;
  return domainAliases[normalized] ?? normalized;
};

export const findObviousAmbiguousAliases = ({ aliases = domainAliases, domainNames = [] } = {}) => {
  const names = Array.isArray(domainNames) ? domainNames : [];

  const checks = [
    { key: "aws", umbrella: "aws_cloud", prefix: "aws_" },
    { key: "gcp", umbrella: "gcp_cloud", prefix: "gcp_" },
    { key: "azure", umbrella: "azure_cloud", prefix: "azure_" },
  ];

  const issues = [];

  for (const { key, umbrella, prefix } of checks) {
    const mapped = aliases[key];
    if (!mapped) continue;

    const matches = names.filter((d) => String(d).startsWith(prefix));
    if (matches.length <= 1) continue;

    if (mapped !== umbrella) {
      issues.push({
        key,
        mappedTo: mapped,
        expectedUmbrella: umbrella,
        reason: `Generic alias '${key}' is ambiguous with multiple '${prefix}*' domains`,
      });
    }
  }

  const familyChecks = [
    {
      key: "cloud",
      expectedUmbrella: "make_alias_explicit",
      patterns: ["_cloud"],
      reason: "Generic alias 'cloud' is ambiguous with multiple cloud provider domains",
    },
    {
      key: "functions",
      expectedUmbrella: "make_alias_explicit",
      patterns: ["functions", "serverless", "lambda"],
      reason: "Generic alias 'functions' is ambiguous with multiple serverless/functions domains",
    },
  ];

  for (const { key, patterns, expectedUmbrella, reason } of familyChecks) {
    const mapped = aliases[key];
    if (!mapped) continue;

    const matches = names.filter((d) => {
      const s = String(d);
      return patterns.some((p) => s.includes(p));
    });

    if (matches.length <= 1) continue;

    issues.push({
      key,
      mappedTo: mapped,
      expectedUmbrella,
      reason,
    });
  }

  const messagingLike = names.filter((d) => {
    const s = String(d);
    return (
      s === "event_streaming" ||
      s.includes("event") ||
      s.includes("sqs") ||
      s.includes("pubsub") ||
      s.includes("servicebus")
    );
  });

  if (messagingLike.length > 1 && aliases.events && aliases.events !== "messaging") {
    issues.push({
      key: "events",
      mappedTo: aliases.events,
      expectedUmbrella: "messaging",
      reason: "Generic alias 'events' is ambiguous with multiple messaging/eventing domains",
    });
  }

  return issues;
};

export const assertNoObviousAmbiguousAliases = (opts = {}) => {
  const issues = findObviousAmbiguousAliases(opts);
  if (!issues.length) return;

  const formatted = issues
    .map((i) => `- ${i.key} -> ${i.mappedTo} (expected ${i.expectedUmbrella})`)
    .join("\n");

  const err = new Error(`Obvious ambiguous domain aliases detected:\n${formatted}`);
  err.issues = issues;
  throw err;
};
