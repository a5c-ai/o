import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { checkpointStuck, checkpointRelease } from "../../../core/checkpoints.js";
import { buildBackendDevelop } from "../domains/backend.js";
import { runTriageFixVerify } from "../../../core/loops/triage_fix_verify.js";

export const incidentHotfix = (task, ctx = {}, { checkpoint = true } = {}) => {
  const { act } = primitivesFrom(ctx);
  requirePrimitive("act", act);

  const severity = act("Classify incident severity (P0-P3) and required timeline.", { ...ctx, task });
  if (checkpoint) checkpointRelease(ctx, { phase: "triage", severity });

  const develop = buildBackendDevelop({
    baseDevelop: ctx.develop,
    quality: { threshold: 0.9, maxIters: 3 },
    ops: {},
    security: {},
  });

  const result = runTriageFixVerify({ task, ctx: { ...ctx, severity }, develop });

  const releaseChecklist = act(
    "Create a hotfix release checklist: comms, monitoring, rollback, and post-incident follow-ups.",
    { ...ctx, severity, result }
  );

  if (!releaseChecklist && checkpoint) checkpointStuck(ctx, { reason: "missing_release_checklist", result });
  if (checkpoint) checkpointRelease(ctx, { phase: "release", releaseChecklist });

  return { severity, result, releaseChecklist };
};
