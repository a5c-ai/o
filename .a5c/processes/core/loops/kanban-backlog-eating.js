import { primitivesFrom, requirePrimitive } from "../primitives.js";
import { checkpointPlan } from "../checkpoints.js";
import { normalizeTask } from "../task.js";

const maybeAwait = async (value) => await Promise.resolve(value);

const coerceIssueType = (raw) => {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (s.includes("bug")) return "bug";
  if (s.includes("feature")) return "feature";
  if (s.includes("enhancement") || s.includes("improvement")) return "enhancement";
  if (s.includes("change")) return "change";
  if (s.includes("chore") || s.includes("maintenance")) return "chore";
  return "unknown";
};

const summarizeCard = (card) => {
  if (card == null) return null;
  if (typeof card === "string") return { title: card };
  if (typeof card !== "object") return { title: String(card) };
  const title = card.title ?? card.name ?? card.summary ?? card.id ?? "untitled";
  const id = card.id ?? card.key ?? card.number ?? null;
  const url = card.url ?? card.link ?? null;
  return { title: String(title), id: id == null ? null : String(id), url: url == null ? null : String(url) };
};

export const runKanbanBacklogEating = async ({
  task,
  ctx = {},
  develop,
  checkpoint = true,
  planPrompt,
  maxSteps = 20,
  perStepGate,
}) => {
  const primitives = primitivesFrom(ctx);
  const act = primitives.act;
  requirePrimitive("act", act);
  develop = develop ?? primitives.develop;
  requirePrimitive("develop", develop);

  const kanban = primitives.kanban;
  requirePrimitive("kanban", kanban);

  const normalized = normalizeTask(task);

  const steps = [];

  for (let step = 1; step <= maxSteps; step++) {
    const backlogCard = await maybeAwait(
      kanban("Get the next backlog card to work on. Return null if none.", {
        ...ctx,
        task: normalized,
        step,
      })
    );
    if (!backlogCard) break;

    const issueTypeRaw = await maybeAwait(
      act(
        'Classify this backlog card. Output exactly one token: "bug"|"feature"|"enhancement"|"change"|"chore"|"unknown".',
        { ...ctx, task: backlogCard, step }
      )
    );
    const issueType = coerceIssueType(issueTypeRaw);

    const trackingContext = await maybeAwait(
      kanban("Start tracking for this card (move to in-progress, set owner, etc.). Return trackingContext.", {
        ...ctx,
        task: backlogCard,
        issueType,
        step,
      })
    );

    const promptByType = {
      bug:
        "Fix the bug with the smallest safe change. Add verification steps and prevent regressions where feasible.",
      feature: "Implement the feature end-to-end. Include verification steps and consider edge cases.",
      enhancement: "Implement the enhancement. Keep changes minimal and verify behavior.",
      change: "Implement the requested change. Document risks and verify behavior.",
      chore: "Perform the maintenance task. Keep it safe and verifiable.",
      unknown: "Handle this backlog item appropriately. Prefer small, correct, verifiable changes.",
    };

    const developTask = {
      title: `Kanban backlog: ${issueType}`,
      prompt: planPrompt ?? promptByType[issueType],
      card: backlogCard,
      issueType,
    };

    const runOne =
      typeof perStepGate === "function"
        ? perStepGate({
            develop,
            act,
            kanban,
            issueType,
            card: backlogCard,
            step,
          })
        : develop;

    const work = await maybeAwait(
      runOne(developTask, { ...ctx, task: normalized, backlogCard, issueType, trackingContext, step })
    );

    await maybeAwait(
      kanban("Update the card with status and a short summary of completed work.", {
        ...ctx,
        task: backlogCard,
        issueType,
        trackingContext,
        work,
        step,
      })
    );

    steps.push({
      step,
      issueType,
      card: summarizeCard(backlogCard),
    });
  }

  const summary = {
    task: normalized,
    maxSteps,
    completedSteps: steps.length,
    steps,
  };

  if (checkpoint) checkpointPlan(ctx, { loop: "kanban_backlog_eating", summary });

  return summary;
};
