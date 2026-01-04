import { rolloutPlanTemplate, rollbackPlanTemplate } from "../shared/rollout.js";
import { observabilityPlanTemplate } from "../shared/observability_slo.js";
import { verificationPlanTemplate } from "../shared/verification.js";

export const planningBreakdownTemplate = () => ({
  domain: "aws_serverless",
  sections: [
    {
      title: "Service Shape",
      prompts: [
        "What AWS managed services are involved (Lambda, API Gateway, DynamoDB, SQS, SNS, EventBridge)?",
        "What are the event sources and contracts (payload shape, ordering, retries)?",
        "What permissions are required (IAM least privilege, resource policies)?",
      ],
    },
    {
      title: "Reliability And Backpressure",
      prompts: [
        "Retry behavior for each service (Lambda retries, DLQ, redrive policies)",
        "Timeouts, concurrency limits, reserved capacity, throttling behavior",
        "Idempotency and deduplication strategy for at-least-once delivery",
      ],
    },
    {
      title: "Deploy Strategy And Rollback",
      prompts: [
        "Deployment method (SAM/CDK/Terraform) and promotion between envs",
        "Lambda alias traffic shifting or canary deployments where applicable",
        "Rollback strategy: revert code, revert config, disable triggers",
      ],
    },
    {
      title: "Observability And Ops",
      prompts: [
        "CloudWatch metrics/logs, structured logging, correlation IDs",
        "Alarms: errors, throttles, timeouts, DLQ age/size",
        "Runbooks and oncall workflow for common failures",
      ],
    },
  ],
});

export const defaultFailureModes = () => [
  "IAM misconfiguration causing access denied or unintended access",
  "Retry amplification causing downstream overload",
  "Poison messages stuck without a DLQ/redrive path",
  "Throttle storms due to concurrency misconfiguration",
  "Cold start latency spikes impacting user experience",
];

export const defaultVerificationPlan = () => {
  const plan = verificationPlanTemplate();
  plan.goals.push("Serverless workflow behaves correctly under retries and throttling");
  plan.invariants.push("Idempotency holds for at-least-once delivery");
  plan.testPlan.integration.push("Event payload contract tests and negative cases");
  plan.checks.preDeploy.push("IAM policy review and least-privilege validation");
  plan.checks.preDeploy.push("Deployment dry run and config diff review");
  plan.checks.postDeploy.push("Monitor throttles, errors, and DLQ metrics during rollout");
  plan.rollbackReadiness.push("Rollback includes disabling triggers and reverting aliases/config");
  return plan;
};

export const defaultRolloutPlan = () => {
  const plan = rolloutPlanTemplate();
  plan.plan.strategy = "canary";
  plan.plan.phases.push("Shift small traffic to new Lambda alias/version first");
  plan.plan.phases.push("Increase traffic gradually with guardrails");
  plan.plan.guardrails.push("Errors, throttles, timeouts, DLQ metrics");
  plan.plan.abortSignals.push("Sustained error increase, throttling, or DLQ growth");
  return plan;
};

export const defaultRollbackPlan = () => {
  const plan = rollbackPlanTemplate();
  plan.triggers.push("Sustained errors/throttles/timeouts or DLQ growth");
  plan.steps.push("Shift traffic back to previous alias/version");
  plan.steps.push("Disable event source mappings/triggers if needed");
  plan.validationAfterRollback.push("Confirm metrics return to baseline and backlog drains");
  return plan;
};

export const defaultObservabilityPlan = () => {
  const plan = observabilityPlanTemplate();
  plan.dashboards.push("Lambda: invocations, errors, duration, throttles");
  plan.dashboards.push("Queues/streams: backlog depth, age, retries, DLQ");
  plan.alerts.push("Alert on sustained errors, throttles, timeouts, or DLQ growth");
  plan.logs.push("Structured logs with request IDs and key decision points");
  plan.runbooks.push("Serverless runbook: mitigate, rollback, drain backlog, validate");
  return plan;
};

export const criteriaPack = () => [
  "Managed services and event sources are explicit with contracts and retry behavior",
  "IAM is least-privilege and reviewed for unintended access paths",
  "Backpressure and DLQ/redrive strategy exists and is tested",
];
