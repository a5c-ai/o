import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { runQualityGate } from "../../../core/loops/quality_gate.js";
import { normalizeTask } from "../../../core/task.js";
import * as roles from "../../index.js";

const gateArtifact = (task, ctx, criteria, opts = {}) =>
  runQualityGate({
    task,
    ctx,
    develop: (t, c) => {
      const { act } = primitivesFrom(c);
      requirePrimitive("act", act);
      return act(t.prompt ?? t.title ?? String(t), { ...c, task: normalizeTask(t) });
    },
    criteria,
    threshold: opts.threshold ?? 0.85,
    maxIters: opts.maxIters ?? 4,
    checkpoint: opts.checkpoint ?? false,
  });

export const incident = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);

  const triage = roles.engineering.oncallTriage(input, ctx, opts);
  const supportBrief = roles.support.escalationTriage(input, ctx, opts);
  const opsPlan = roles.devops.incidentResponse(input, ctx, opts);
  const securityAssist = roles.security.incidentSupport(input, ctx, opts);

  const internalUpdate = roles.project.statusUpdate(
    {
      title: "Internal incident update",
      description: input.prompt,
      context: { triage, opsPlan, securityAssist },
    },
    ctx,
    opts
  );

  const externalUpdate = gateArtifact(
    {
      title: "Customer-facing incident update",
      prompt:
        "Draft a customer-facing incident update based on the incident context. " +
        "Include: impact, what we're doing, workarounds (if any), and next update time. " +
        "Avoid sensitive internal details and avoid overpromising.",
      context: { input, triage, opsPlan, securityAssist, supportBrief },
    },
    ctx,
    [
      "Clearly states impact and current status",
      "Provides next update time and (if available) workaround",
      "Avoids sensitive details and avoids overpromising",
    ],
    opts
  );

  const postmortem = roles.devops.postmortem(
    { title: "Postmortem", description: input.prompt, context: { triage, opsPlan } },
    ctx,
    opts
  );

  return {
    input,
    triage,
    supportBrief,
    opsPlan,
    securityAssist,
    internalUpdate,
    externalUpdate,
    postmortem,
  };
};
