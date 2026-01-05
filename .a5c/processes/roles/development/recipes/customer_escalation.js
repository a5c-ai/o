import { runQualityGate } from "../../../core/loops/quality_gate.js";
import { defaultDevelop } from "../../../core/primitives.js";
import { normalizeTask } from "../../../core/task.js";
import * as roles from "../../index.js";

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

export const customerEscalation = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);

  const triage = roles.support.escalationTriage(input, ctx, opts);
  const reproPack = roles.support.reproduceIssue(
    { title: "Reproduction pack", description: input.prompt, context: { triage } },
    ctx,
    opts
  );
  const engineeringAssessment = roles.engineering.investigateBug(
    { title: "Engineering assessment", description: input.prompt, context: { reproPack } },
    ctx,
    opts
  );
  const productDecision = roles.product.decisionRecord(
    {
      title: "Escalation prioritization decision",
      description:
        "Decide priority and approach for this escalation (fix, workaround, or timeline).",
      context: { triage, engineeringAssessment },
    },
    ctx,
    opts
  );

  const internalPlan = roles.project.createProjectPlan(
    {
      title: "Escalation action plan",
      description: input.prompt,
      context: { triage, engineeringAssessment, productDecision },
    },
    ctx,
    opts
  );

  const customerResponse = gate(
    {
      title: "Customer escalation response",
      prompt:
        "Draft a customer escalation response. Include: acknowledgment, " +
        "current findings (high level), workaround (if any), next steps, " +
        "and next update time. Avoid internal-only details.",
      context: { input, triage, engineeringAssessment, productDecision, internalPlan },
    },
    ctx,
    [
      "Sets expectations with a clear next update time",
      "Communicates next steps and workaround if available",
      "Avoids internal-only details and avoids overpromising",
    ],
    opts
  );

  return {
    input,
    triage,
    reproPack,
    engineeringAssessment,
    productDecision,
    internalPlan,
    customerResponse,
  };
};
