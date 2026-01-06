import { primitivesFrom, requirePrimitive } from "../primitives.js";
import { checkpointStuck } from "../checkpoints.js";
import { normalizeTask } from "../task.js";

const isPlainObject = (v) => v != null && typeof v === "object" && !Array.isArray(v);

const describeValueType = (value) => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
};

const normalizeFollowupItem = (item) => {
  if (!isPlainObject(item)) return null;
  const title = item.title;
  const reason = item.reason;
  const owner = item.owner;
  if (typeof title !== "string" || typeof reason !== "string") return null;
  if (!(typeof owner === "string" || owner === null || owner === undefined)) return null;
  return { title, owner: owner ?? null, reason };
};

export const unPostmortemFollowups = (
  followupsRaw,
  { maxFollowups = 10, strict = false } = {}
) => {
  const warnings = [];
  const limit = Number.isFinite(maxFollowups) ? Math.max(0, Math.floor(maxFollowups)) : 10;

  if (!Array.isArray(followupsRaw)) {
    warnings.push({
      code: "followups_not_array",
      message: `Followups must be a JSON array; got ${describeValueType(followupsRaw)}.`,
    });
    if (strict) {
      throw new Error(warnings.map((w) => `- [${w.code}] ${w.message}`).join("\n"));
    }
    return { followups: [], warnings };
  }

  const followups = [];
  const invalidItemWarnings = [];
  let truncated = false;

  for (const [idx, item] of followupsRaw.entries()) {
    const normalized = normalizeFollowupItem(item);
    if (!normalized) {
      const keys = isPlainObject(item) ? Object.keys(item).sort().join(", ") : null;
      const details = isPlainObject(item)
        ? `keys: ${keys || "(none)"}`
        : `type: ${describeValueType(item)}`;
      invalidItemWarnings.push({
        code: "followups_invalid_item",
        index: idx,
        message:
          `Invalid followup item at index ${idx}; expected ` +
          `{"title": string, "owner": string|null, "reason": string}; ${details}.`,
      });
      continue;
    }

    followups.push(normalized);
    if (followups.length >= limit) {
      truncated = idx < followupsRaw.length - 1;
      break;
    }
  }

  if (truncated) {
    warnings.push({
      code: "followups_truncated",
      message: `Followups array truncated to maxFollowups=${limit} (got ${followupsRaw.length}).`,
    });
  }

  warnings.push(...invalidItemWarnings);

  if (strict && invalidItemWarnings.length) {
    throw new Error(warnings.map((w) => `- [${w.code}] ${w.message}`).join("\n"));
  }

  return { followups, warnings };
};

export const runPostmortemFollowups = ({
  task,
  ctx = {},
  maxFollowups = 10,
  checkpointOnUnclear = true,
  strictFollowups = false,
  postmortemPrompt,
  followupsPrompt,
} = {}) => {
  const primitives = primitivesFrom(ctx);
  const act = primitives.act;
  requirePrimitive("act", act);

  const normalized = normalizeTask(task);

  const postmortem = act(
    postmortemPrompt ??
      'Write a short postmortem for the completed work. Output JSON only (no markdown, no code fences). Output a JSON object with keys: "summary", "rootCause", "contributingFactors", "whatWentWell", "whatWentPoorly", "lessonsLearned".',
    { ...ctx, task: normalized }
  );

  const followupsRaw = act(
    followupsPrompt ??
      `From the postmortem, produce up to ${maxFollowups} follow-up action items as a JSON array. ` +
        'Output JSON only (no markdown, no code fences). Each item: {"title": string, "owner": string|null, "reason": string}. Keep them concrete and owned.',
    { ...ctx, task: normalized, postmortem }
  );

  const { followups, warnings: followupsWarnings } = unPostmortemFollowups(followupsRaw, {
    maxFollowups,
    strict: strictFollowups,
  });

  if (checkpointOnUnclear && (postmortem == null || followups.length === 0)) {
    checkpointStuck(ctx, {
      reason: "insufficient_postmortem_followups",
      postmortem,
      followups,
    });
  }

  return {
    task: normalized,
    postmortem: postmortem ?? null,
    followups,
    followupsWarnings,
  };
};
