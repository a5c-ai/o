import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "aws_s3",
  sections: [
    {
      title: "Security And Data Protection",
      prompts: [
        "Bucket policy/IAM roles and least-privilege access for writers/readers",
        "Encryption policy (SSE-S3/SSE-KMS) and key management",
        "Public access block settings and CORS if browser access is needed",
      ],
    },
    {
      title: "Object Model And Lifecycle",
      prompts: [
        "Naming scheme, prefixes, and partitioning for scale and cost",
        "Versioning, retention, and lifecycle transitions/expiration rules",
        "Delete semantics and recovery plan (version restore, backups)",
      ],
    },
    {
      title: "Access Patterns And Performance",
      prompts: [
        "Presigned URLs vs proxying through an API; cache headers and CDN use",
        "Multipart uploads and large object handling",
        "List operations and pagination; consistency assumptions",
      ],
    },
    {
      title: "Events And Integration",
      prompts: [
        "Event notifications (SQS/SNS/Lambda/EventBridge) and idempotency",
        "Retry behavior and backpressure for downstream consumers",
        "Observability and audit (CloudTrail, access logs) and rollout/rollback plan",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "Bucket policy misconfiguration causing access denied or data exposure",
  "Lifecycle rule accidentally deleting or archiving critical objects",
  "KMS permission mismatch causing decrypt failures in production",
  "Cost spike from inefficient access patterns or missing lifecycle transitions",
  "Event notification loop causing duplicate processing or runaway load",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("S3 access and data protection settings are correct for intended use");
  plan.invariants.push("No unintended public access and encryption expectations are met");
  plan.testPlan.integration.push("Upload/download using intended credentials and access method");
  plan.testPlan.integration.push("Presigned URL flow if used (expiry, scope, method restrictions)");
  plan.checks.preDeploy.push("Verify public access block and bucket policy with least privilege");
  plan.checks.preDeploy.push("Verify lifecycle rules in a non-production environment if possible");
  plan.checks.postDeploy.push("Monitor access errors (403/AccessDenied) and request metrics during rollout");
  plan.rollbackReadiness.push("Rollback plan covers reverting policy/lifecycle changes and recovering objects");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "progressive";
  plan.plan.phases.push("Apply changes in staging and validate access patterns");
  plan.plan.phases.push("Progressively enable producers/consumers or prefixes");
  plan.plan.guardrails.push("AccessDenied errors, 4xx/5xx, request latency");
  plan.plan.abortSignals.push("Sustained AccessDenied errors or unexpected cost spike");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("AccessDenied surge, data exposure risk, or lifecycle misbehavior");
  plan.steps.push("Revert bucket policy/KMS changes to last known good state");
  plan.steps.push("Disable new lifecycle rules or event notifications if risky");
  plan.dataRecovery.push("Restore objects via versioning or backups if deletion occurred");
  plan.validationAfterRollback.push("Confirm access and encryption behavior is restored");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("S3: request count, 4xx/5xx, first byte latency, bytes transferred");
  plan.alerts.push("Alert on sustained AccessDenied (403) increase");
  plan.logs.push("Enable access logs and CloudTrail for audit if required");
  plan.runbooks.push("S3 runbook: policy rollback, lifecycle rollback, object restore");
  return plan;
};

export const criteriaPack = () => [
  "IAM/bucket policy and public access settings are least-privilege and verified",
  "Lifecycle/versioning behavior is safe and has a recovery plan",
  "Event triggers (if used) are idempotent and monitored for duplicates",
];

