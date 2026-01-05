import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";

const gate = (task, ctx, criteria, opts = {}) =>
  runQualityGate({
    task,
    ctx,
    develop: defaultDevelop,
    criteria,
    threshold: opts.threshold ?? 0.92,
    maxIters: opts.maxIters ?? 5,
    checkpoint: opts.checkpoint ?? false,
  });

export const goldenPathDefinition = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Golden path definition",
      prompt:
        "Define a golden path for building and operating a service. Output JSON: " +
        "{\"targetUsers\": string[], \"supportedStacks\": string[], \"templateRepo\": string, " +
        "\"opinions\": string[], \"escapeHatches\": string[], \"constraints\": string[], " +
        "\"operabilityBuiltIn\": {\"logging\": string[], \"metrics\": string[], \"tracing\": string[], \"runbooks\": string[]}, " +
        "\"adoptionMetrics\": {\"metric\": string, \"target\": string}[], \"ownership\": {\"team\": string, \"oncall\": string}}",
      input,
    },
    ctx,
    [
      "Golden path is concrete, opinionated, and has explicit escape hatches",
      "Operability is built in (telemetry, runbooks, rollout/rollback posture)",
      "Adoption metrics and ownership are measurable and explicit",
    ],
    opts
  );
};

export const serviceTemplateReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Service template review",
      prompt:
        "Review the service template in the input. Output JSON: " +
        "{\"summary\": string, \"strengths\": string[], \"gaps\": string[], \"securityGaps\": string[], " +
        "\"operabilityGaps\": string[], \"developerErgonomics\": string[], \"recommendations\": string[]}",
      input,
    },
    ctx,
    [
      "Finds gaps that affect adoption, safety, and operability",
      "Recommendations are prioritized and actionable",
      "Calls out migration/compat considerations for existing services",
    ],
    opts
  );
};

export const developerPlatformRoadmap = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Developer platform roadmap",
      prompt:
        "Create a developer platform roadmap. Output JSON: " +
        "{\"vision\": string, \"principles\": string[], \"milestones\": {\"name\": string, \"outcome\": string, " +
        "\"dependencies\": string[], \"risks\": string[], \"successMetrics\": string[], \"eta\": string}[], " +
        "\"stakeholders\": string[], \"resourcing\": string, \"openQuestions\": string[]}",
      input,
    },
    ctx,
    [
      "Milestones have clear outcomes, dependencies, and success metrics",
      "Roadmap includes adoption strategy and migration path",
      "Risks and open questions are explicit and prioritized",
    ],
    opts
  );
};

export const pavedRoadAdoptionPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Paved road adoption plan",
      prompt:
        "Create an adoption plan for a paved road/golden path. Output JSON: " +
        "{\"phases\": {\"name\": string, \"scope\": string, \"activities\": string[], \"exitCriteria\": string[]}[], " +
        "\"enablement\": {\"docs\": string[], \"training\": string[], \"officeHours\": string[]}, " +
        "\"migration\": {\"strategy\": string, \"waves\": string[], \"compat\": string[]}, " +
        "\"incentivesAndGuardrails\": string[], \"adoptionMetrics\": string[], \"risks\": string[]}",
      input,
    },
    ctx,
    [
      "Plan has measurable adoption goals and explicit phase exit criteria",
      "Includes clear constraints, guardrails, and migration strategy",
      "Operability requirements are included and enforced via the paved road",
    ],
    opts
  );
};

