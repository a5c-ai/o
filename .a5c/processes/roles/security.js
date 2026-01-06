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

export const vulnTriage = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Vulnerability triage",
      prompt:
        "Triage the vulnerability. Output JSON: " +
        "{\"summary\": string, \"severity\": \"critical\"|\"high\"|\"med\"|\"low\", " +
        "\"impact\": string, \"exposure\": string, \"exploitability\": string, " +
        "\"mitigations\": string[], \"fixPlan\": string[], \"ownerRole\": string}",
      input,
    },
    ctx,
    [
      "Severity is justified by impact and exposure",
      "Mitigations include immediate and durable options",
      "Fix plan includes verification and rollout considerations",
    ],
    opts
  );
};

export const threatModel = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Threat model",
      prompt:
        "Produce a lightweight threat model. Include: assets, trust boundaries, " +
        "threats (STRIDE-style), mitigations, and open questions.",
      input,
    },
    ctx,
    [
      "Identifies key assets and trust boundaries",
      "Threats are concrete and realistic",
      "Mitigations are mapped to threats and are actionable",
    ],
    opts
  );
};

export const vulnTriageQueueWorkerForever = async ({
  pollBatch,
  handleOne,
  emptySleepMs = 10 * 60 * 1000,
  perItemSleepMs = 0,
  logger = console,
} = {}) => {
  if (typeof pollBatch !== "function") {
    throw new Error("vulnTriageQueueWorkerForever: pollBatch must be a function");
  }
  if (typeof handleOne !== "function") {
    throw new Error("vulnTriageQueueWorkerForever: handleOne must be a function");
  }

  for (;;) {
    let vulns = [];
    try {
      vulns = (await pollBatch()) ?? [];
    } catch (err) {
      logger?.error?.("[security] poll error", err);
      vulns = [];
    }

    if (!Array.isArray(vulns) || vulns.length === 0) {
      logger?.info?.(`[security] no vulns; sleeping ${emptySleepMs}ms`);
      await sleep(emptySleepMs);
      continue;
    }

    for (const vuln of vulns) {
      try {
        await handleOne(vuln);
      } catch (err) {
        logger?.error?.("[security] handle error", err);
      }

      if (perItemSleepMs > 0) {
        await sleep(perItemSleepMs);
      }
    }
  }
};

export const securityControlMonitoringForever = async ({
  intervalMs = 24 * 60 * 60 * 1000,
  runOnce,
  logger = console,
} = {}) => {
  if (typeof runOnce !== "function") {
    throw new Error("securityControlMonitoringForever: runOnce must be a function");
  }

  for (;;) {
    try {
      await runOnce();
    } catch (err) {
      logger?.error?.("[security] control monitoring error", err);
    }

    await sleep(intervalMs);
  }
};

export const securityReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Security review",
      prompt:
        "Perform a security review and produce findings. Include: " +
        "authn/authz concerns, data handling, injection risks, supply chain, " +
        "and recommended remediations prioritized by severity.",
      input,
    },
    ctx,
    [
      "Findings are specific and tied to concrete risks",
      "Remediations are prioritized and actionable",
      "Covers auth, data handling, and supply chain considerations",
    ],
    opts
  );
};

export const incidentSupport = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Security incident support",
      prompt:
        "Provide security support for an incident. Include: " +
        "containment steps, evidence to preserve, comms cautions, " +
        "and follow-up actions for remediation and monitoring.",
      input,
    },
    ctx,
    [
      "Containment steps are safe and prioritized",
      "Evidence preservation guidance is practical",
      "Follow-ups include monitoring and remediation",
    ],
    opts
  );
};

export const accessReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Access review",
      prompt:
        "Draft an access review plan. Output JSON: " +
        "{\"scope\": string, \"systems\": string[], \"roles\": string[], " +
        "\"checks\": string[], \"remediation\": string[], \"cadence\": string}",
      input,
    },
    ctx,
    [
      "Scope and systems are explicitly listed",
      "Checks align to least privilege and separation of duties",
      "Remediation workflow is clear and repeatable",
    ],
    opts
  );
};

export const auditPrep = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Audit preparation",
      prompt:
        "Prepare an audit readiness package. Include: control list, " +
        "evidence sources, gaps, owners, and a timeline to close gaps.",
      input,
    },
    ctx,
    [
      "Maps controls to evidence sources clearly",
      "Identifies gaps with owners and timelines",
      "Package is organized and easy to verify",
    ],
    opts
  );
};

export const secureDesignReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Secure design review",
      prompt:
        "Perform a secure design review. Include: data classification, trust boundaries, " +
        "abuse cases, authz/authn model, secrets handling, logging/redaction, " +
        "and a prioritized list of required changes before launch.",
      input,
    },
    ctx,
    [
      "Identifies trust boundaries and abuse cases (not just generic threats)",
      "Required changes are prioritized and testable",
      "Covers auth, secrets, and sensitive data handling thoroughly",
    ],
    opts
  );
};

export const dependencyPolicy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Dependency policy",
      prompt:
        "Draft a dependency and supply chain policy. Output JSON: " +
        "{\"allowedSources\": string[], \"requirements\": string[], \"reviewTriggers\": string[], " +
        "\"vulnSLA\": [{\"severity\": string, \"sla\": string}], \"exceptions\": string[]}",
      input,
    },
    ctx,
    [
      "Policy is enforceable (clear triggers and requirements)",
      "Vulnerability SLAs are realistic and risk-based",
      "Exceptions process is explicit and auditable",
    ],
    opts
  );
};
