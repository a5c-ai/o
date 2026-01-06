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

export const customerOnboardingPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Customer onboarding plan",
      prompt:
        "Create a time-boxed onboarding plan with milestones, owners, risks, and success criteria. Output JSON: " +
        '{ "customerProfile": {"segment": string, "useCase": string, "constraints": string[]}, "stakeholders": [{"nameOrRole": string, "side": "customer"|"vendor", "responsibility": string}], "plan": [{"week": string, "milestones": [{"milestone": string, "definitionOfDone": string, "ownerRole": string}], "activities": string[], "dependencies": string[], "risks": string[]}], "successCriteria": string[], "enablement": {"trainingSessions": string[], "docs": string[], "accessNeeded": string[]}, "measurement": {"adoptionMetrics": string[], "healthSignals": string[]} }',
      input,
    },
    ctx,
    [
      "Plan is time-boxed by week with concrete milestones and owners",
      "Dependencies and risks are realistic and actionable",
      "Success criteria and measurement are specific and measurable",
    ],
    opts
  );
};

export const healthScoreModel = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Customer health score model",
      prompt:
        "Define a customer health score model (inputs, weights, thresholds, and instrumentation). Output JSON: " +
        '{ "segments": [{"name": string, "definition": string}], "signals": [{"name": string, "type": "usage"|"outcome"|"sentiment"|"risk", "definition": string, "source": string, "weight": number}], "scoring": {"formula": string, "thresholds": {"green": string, "yellow": string, "red": string}}, "reviewCadence": string, "playbooks": [{"state": "green"|"yellow"|"red", "actions": string[], "ownerRole": string}], "dataQualityChecks": string[] }',
      input,
    },
    ctx,
    [
      "Signals are well-defined, instrumentable, and weighted in a coherent model",
      "Thresholds and playbooks map cleanly to green/yellow/red states",
      "Includes practical data quality checks and a review cadence",
    ],
    opts
  );
};

export const customerHealthMonitorForever = async ({
  intervalMs = 24 * 60 * 60 * 1000,
  runOnce,
  logger = console,
} = {}) => {
  if (typeof runOnce !== "function") {
    throw new Error("customerHealthMonitorForever: runOnce must be a function");
  }

  for (;;) {
    try {
      await runOnce();
    } catch (err) {
      logger?.error?.("[customer_success] health monitor error", err);
    }

    await sleep(intervalMs);
  }
};

export const csRenewalQueueWorkerForever = async ({
  pollBatch,
  handleOne,
  emptySleepMs = 10 * 60 * 1000,
  perItemSleepMs = 0,
  logger = console,
} = {}) => {
  if (typeof pollBatch !== "function") {
    throw new Error("csRenewalQueueWorkerForever: pollBatch must be a function");
  }
  if (typeof handleOne !== "function") {
    throw new Error("csRenewalQueueWorkerForever: handleOne must be a function");
  }

  for (;;) {
    let renewals = [];
    try {
      renewals = (await pollBatch()) ?? [];
    } catch (err) {
      logger?.error?.("[customer_success] poll error", err);
      renewals = [];
    }

    if (!Array.isArray(renewals) || renewals.length === 0) {
      logger?.info?.(`[customer_success] no renewals; sleeping ${emptySleepMs}ms`);
      await sleep(emptySleepMs);
      continue;
    }

    for (const renewal of renewals) {
      try {
        await handleOne(renewal);
      } catch (err) {
        logger?.error?.("[customer_success] handle error", err);
      }

      if (perItemSleepMs > 0) {
        await sleep(perItemSleepMs);
      }
    }
  }
};

export const successPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Mutual success plan",
      prompt:
        "Produce a mutual success plan aligned to outcomes, timelines, and stakeholders. Output JSON: " +
        '{ "objectives": [{"objective": string, "businessOutcome": string, "metric": string, "target": string, "timeframe": string}], "workstreams": [{"name": string, "milestones": [{"when": string, "milestone": string, "ownerRole": string}], "risks": string[], "dependencies": string[]}], "responsibilities": {"customer": string[], "vendor": string[]}, "governance": {"cadence": string, "meetings": string[], "execSponsor": {"present": boolean, "notes": string}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Objectives tie to business outcomes with measurable targets and timeframes",
      "Workstreams include milestones, dependencies, and risks with clear ownership",
      "Governance and responsibilities are explicit and realistic",
    ],
    opts
  );
};

export const qbrPackage = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "QBR package",
      prompt:
        "Create a QBR-ready narrative + scorecard + next-quarter plan. Output JSON: " +
        '{ "period": string, "accountSummary": string, "scorecard": [{"metric": string, "value": string, "delta": string, "notes": string}], "wins": string[], "risks": [{"risk": string, "evidence": string, "mitigation": string, "ownerRole": string}], "roadmapAlignment": [{"customerNeed": string, "productPlan": string, "eta": string}], "expansion": [{"opportunity": string, "valueHypothesis": string, "stakeholders": string[], "nextSteps": string[]}], "next90Days": [{"action": string, "ownerRole": string, "due": string, "successCriteria": string}] }',
      input,
    },
    ctx,
    [
      "Scorecard includes meaningful deltas and interpretation, not just metrics",
      "Risks have evidence, mitigations, owners, and clear next steps",
      "Next 90 days plan is prioritized with owners, due dates, and success criteria",
    ],
    opts
  );
};

export const renewalAndExpansionPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Renewal and expansion plan",
      prompt:
        "Create a renewal plan (timeline, value proof, stakeholders, procurement/legal steps) plus expansion motion. Output JSON: " +
        '{ "renewalDate": string, "commercialContext": {"currentTerms": string, "pricingNotes": string}, "timeline": [{"when": string, "milestone": string, "ownerRole": string}], "valueProof": {"outcomes": string[], "metrics": [{"metric": string, "before": string, "after": string, "notes": string}]}, "stakeholderMap": [{"personOrRole": string, "influence": "low"|"medium"|"high", "stance": "supporter"|"neutral"|"risk"}], "procurementLegal": {"steps": string[], "likelyRedlines": string[], "fallbacks": string[]}, "risks": string[], "expansionPlays": [{"play": string, "trigger": string, "plan": string[], "ownerRole": string}] }',
      input,
    },
    ctx,
    [
      "Timeline and stakeholder map are specific and cover the buying process",
      "Value proof includes concrete outcomes and before/after metrics",
      "Procurement/legal steps and expansion plays are actionable with triggers and owners",
    ],
    opts
  );
};

export const churnRiskReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Churn risk review",
      prompt:
        "Diagnose churn risk and generate a prioritized mitigation plan with owners and deadlines. Output JSON: " +
        '{ "riskScore": "low"|"medium"|"high", "signals": string[], "rootCauses": string[], "customerNarrative": string, "mitigationPlan": [{"action": string, "ownerRole": string, "due": string, "expectedImpact": string}], "execEscalation": {"needed": boolean, "why": string|null, "asks": string[]}, "measurement": {"leadingIndicators": string[], "checkpoints": string[] } }',
      input,
    },
    ctx,
    [
      "Signals and root causes are consistent with the stated risk score",
      "Mitigation plan is prioritized with owners, due dates, and expected impact",
      "Escalation and measurement plans are specific and actionable",
    ],
    opts
  );
};
