import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";
import { sleep } from "../runners/sleep.js";

const gate = (task, ctx, criteria, opts = {}) =>
  runQualityGate({
    task,
    ctx,
    develop: defaultDevelop,
    criteria,
    threshold: opts.threshold ?? 0.85,
    maxIters: opts.maxIters ?? 4,
    checkpoint: opts.checkpoint ?? false,
  });

export const growthExperimentBrief = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Growth experiment brief",
      prompt:
        "Write a testable growth experiment brief (hypothesis, design, success criteria, risks). Output JSON: " +
        '{ "name": string, "hypothesis": string, "targetSegment": string, "funnelStage": "acquisition"|"activation"|"retention"|"referral"|"revenue", "change": string, "primaryMetric": {"name": string, "definition": string}, "secondaryMetrics": string[], "successCriteria": string, "design": {"variant": string, "control": string, "targeting": string, "duration": string, "sampleSizeNotes": string}, "risks": string[], "instrumentation": {"events": string[], "dashboards": string[], "sanityChecks": string[]}, "rolloutPlan": string[] }',
      input,
    },
    ctx,
    [
      "Hypothesis and change are specific, testable, and tied to a single funnel stage",
      "Design includes targeting, duration, and success criteria with clear primary/secondary metrics",
      "Instrumentation lists concrete events/dashboards/sanity checks to validate the test",
    ],
    opts
  );
};

export const channelStrategy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Channel strategy",
      prompt:
        "Create a multi-channel acquisition plan with budgets, creatives/angles, and measurement. Output JSON: " +
        '{ "icp": string, "channels": [{"channel": string, "why": string, "offer": string, "creativeAngles": string[], "budget": string, "executionPlan": string[], "risks": string[]}], "landingPage": {"message": string, "proof": string[], "cta": string}, "measurement": {"kpis": [{"name": string, "definition": string, "target": string}], "attribution": string, "reportingCadence": string}, "experimentsBacklog": [{"hypothesis": string, "test": string, "successCriteria": string}] }',
      input,
    },
    ctx,
    [
      "Channels include clear rationale, offer, creative angles, budget, and step-by-step execution",
      "Landing page message/proof/CTA align with the chosen ICP and channels",
      "Measurement includes KPI definitions/targets and an attribution approach plus experiments backlog",
    ],
    opts
  );
};

export const growthExperimentQueueWorkerForever = async ({
  pollBatch,
  handleOne,
  emptySleepMs = 10 * 60 * 1000,
  perItemSleepMs = 0,
  logger = console,
} = {}) => {
  if (typeof pollBatch !== "function") {
    throw new Error("growthExperimentQueueWorkerForever: pollBatch must be a function");
  }
  if (typeof handleOne !== "function") {
    throw new Error("growthExperimentQueueWorkerForever: handleOne must be a function");
  }

  for (;;) {
    let items = [];
    try {
      items = (await pollBatch()) ?? [];
    } catch (err) {
      logger?.error?.("[marketing_growth] poll error", err);
      items = [];
    }

    if (!Array.isArray(items) || items.length === 0) {
      logger?.info?.(`[marketing_growth] no experiments; sleeping ${emptySleepMs}ms`);
      await sleep(emptySleepMs);
      continue;
    }

    for (const item of items) {
      try {
        await handleOne(item);
      } catch (err) {
        logger?.error?.("[marketing_growth] handle error", err);
      }

      if (perItemSleepMs > 0) {
        await sleep(perItemSleepMs);
      }
    }
  }
};

export const growthNorthStarReviewForever = async ({
  intervalMs = 7 * 24 * 60 * 60 * 1000,
  runOnce,
  logger = console,
} = {}) => {
  if (typeof runOnce !== "function") {
    throw new Error("growthNorthStarReviewForever: runOnce must be a function");
  }

  for (;;) {
    try {
      await runOnce();
    } catch (err) {
      logger?.error?.("[marketing_growth] weekly review error", err);
    }

    await sleep(intervalMs);
  }
};

export const lifecycleMessagingPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Lifecycle messaging plan",
      prompt:
        "Design lifecycle messaging (email/in-app/push) with triggers, frequency caps, and experiments. Output JSON: " +
        '{ "stages": [{"stage": string, "goal": string}], "messages": [{"stage": string, "trigger": string, "channel": string, "audience": string, "message": string, "cta": string, "frequencyCap": string, "ownerRole": string}], "personalization": [{"rule": string, "dataNeeded": string}], "experiments": [{"message": string, "variant": string, "metric": string, "duration": string}], "complianceNotes": string[] }',
      input,
    },
    ctx,
    [
      "Messages map from lifecycle stages to concrete triggers, channels, and frequency caps",
      "Includes personalization rules with explicit data requirements",
      "Experiments have measurable metrics/duration and compliance notes cover messaging constraints",
    ],
    opts
  );
};

export const contentSeoPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Content + SEO plan",
      prompt:
        "Create an SEO/content plan (topics, keywords, briefs, internal links, measurement). Output JSON: " +
        '{ "goals": string[], "topics": [{"topic": string, "intent": "informational"|"commercial"|"transactional", "keywords": string[], "outline": string[], "cta": string, "internalLinks": string[], "targetAudience": string, "difficultyNotes": string}], "publishingCadence": string, "distribution": string[], "measurement": {"kpis": string[], "reporting": string, "timeToImpactNotes": string}, "backlog": [{"idea": string, "why": string}] }',
      input,
    },
    ctx,
    [
      "Topics include intent, keywords, and an outline with CTA and internal link plan",
      "Cadence and distribution are realistic for resourcing and audience reach",
      "Measurement includes KPIs, reporting approach, and time-to-impact expectations",
    ],
    opts
  );
};

export const activationFunnelAnalysisPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Activation funnel analysis plan",
      prompt:
        "Plan an activation funnel diagnosis (events, cohorts, segments, suspected drop-offs, interventions). Output JSON: " +
        '{ "activationDefinition": string, "funnelSteps": [{"step": string, "event": string, "expectedTime": string}], "segments": [{"name": string, "definition": string}], "diagnostics": [{"question": string, "analysis": string, "dataNeeded": string}], "suspectedFriction": [{"step": string, "hypothesis": string, "evidenceToCollect": string[]}], "interventions": [{"hypothesis": string, "change": string, "successMetric": string, "ownerRole": string}], "instrumentationGaps": string[] }',
      input,
    },
    ctx,
    [
      "Funnel steps include concrete events and expected time windows for activation",
      "Diagnostics and friction hypotheses specify data/evidence needed to validate",
      "Interventions are tied to measurable success metrics and owner roles, with instrumentation gaps listed",
    ],
    opts
  );
};

export const attributionMeasurementPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Attribution + measurement plan",
      prompt:
        "Define attribution/measurement approach and its limitations (UTMs, touchpoints, validation, reporting). Output JSON: " +
        '{ "model": string, "touchpoints": [{"name": string, "capturedWhere": string, "requiredFields": string[]}], "utmStandard": {"required": string[], "examples": {"utm_source": string, "utm_medium": string, "utm_campaign": string, "utm_content": string, "utm_term": string}}, "dataSources": string[], "knownLimitations": string[], "validation": [{"check": string, "how": string, "cadence": string}], "reporting": {"dashboards": string[], "cadence": string, "owners": string[]} }',
      input,
    },
    ctx,
    [
      "Defines attribution model plus touchpoints and a concrete UTM standard with examples",
      "Validation steps are specific (checks, how, cadence) and acknowledge known limitations",
      "Reporting includes dashboards, cadence, and accountable owners to operationalize measurement",
    ],
    opts
  );
};
