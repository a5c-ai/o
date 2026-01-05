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

export const release = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);

  const plan = roles.devops.deploy(
    { title: "Release deploy plan", description: input.prompt, input },
    ctx,
    opts
  );

  const releaseNotes = roles.product.stakeholderUpdate(
    {
      title: "Release notes (internal)",
      description:
        "Produce release notes and a summary of customer impact and benefits. Use the release context.",
      context: { input, plan },
    },
    ctx,
    opts
  );

  const securityReview = roles.security.securityReview(
    { title: "Release security review", description: input.prompt, context: { input, plan } },
    ctx,
    opts
  );

  const goNoGo = gate(
    {
      title: "Go/No-Go decision",
      prompt:
        "Make a go/no-go recommendation for the release. Include: " +
        "readiness checklist, risks, mitigations, and a clear decision. " +
        "If no-go, propose the minimum next actions to reach go.",
      context: { input, plan, securityReview, releaseNotes },
    },
    ctx,
    [
      "Decision is explicit and supported by evidence",
      "Risks and mitigations are specific",
      "Includes clear next actions if not ready",
    ],
    opts
  );

  const announcement = gate(
    {
      title: "Release announcement",
      prompt:
        "Draft a release announcement (internal or external as appropriate). " +
        "Include: what's new, who is impacted, rollout timing, support contacts, " +
        "and links/placeholders for docs. Keep it concise.",
      context: { input, plan, goNoGo, releaseNotes },
    },
    ctx,
    [
      "Clearly states what's changing and who is impacted",
      "Communicates timing, rollout, and where to get help",
      "Concise, scannable, and appropriately toned",
    ],
    opts
  );

  return { input, plan, releaseNotes, securityReview, goNoGo, announcement };
};
