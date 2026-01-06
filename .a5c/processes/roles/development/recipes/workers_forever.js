import { runRecurringForever, runQueueWorkerForever } from "../../../runners/index.js";
import { bugfix } from "./bugfix.js";
import { enhancement } from "./enhancement.js";
import { dependencyUpgrade } from "./dependency_upgrade.js";
import { incident } from "./incident.js";
import { requireAct } from "./_shared.js";

const normalizeQueueItem = (item) => {
  if (!item || typeof item !== "object") return { type: "unknown", payload: item };
  return {
    id: item.id ?? null,
    type: item.type ?? "unknown",
    domain: item.domain ?? "backend",
    payload: item.payload ?? item,
    raw: item,
  };
};

export const devPeriodicMaintenanceForever = async (
  task,
  ctx = {},
  {
    intervalMs = 24 * 60 * 60 * 1000,
    runOnce,
    name = "dev_periodic_maintenance",
    logger,
  } = {}
) => {
  const act = requireAct(ctx);

  const defaultRunOnce = async () => {
    act(
      "Run the recurring development maintenance routine described in the task: repo hygiene, dependency checks, flaky test triage, and backlog grooming. Record artifacts and next actions.",
      { task, ...ctx }
    );
  };

  return runRecurringForever({
    name,
    intervalMs,
    logger,
    runOnce: runOnce ?? defaultRunOnce,
  });
};

export const devWorkQueueWorkerForever = async (
  task,
  ctx = {},
  {
    pollBatch,
    handleOne,
    ack,
    emptySleepMs = 10 * 60 * 1000,
    perItemSleepMs = 0,
    name = "dev_work_queue",
    logger,
  } = {}
) => {
  if (typeof pollBatch !== "function") {
    throw new Error("devWorkQueueWorkerForever: opts.pollBatch must be provided");
  }

  const defaultHandleOne = async (rawItem) => {
    const item = normalizeQueueItem(rawItem);

    const recipeTask =
      typeof item.payload?.task === "string" ? item.payload.task : String(task ?? "");

    let result = null;
    if (item.type === "bugfix") {
      result = bugfix(recipeTask, ctx, { domain: item.domain, quality: true });
    } else if (item.type === "enhancement") {
      result = enhancement(recipeTask, ctx, { domain: item.domain, quality: true });
    } else if (item.type === "dependency_upgrade") {
      const pkgs = item.payload?.packages ?? [];
      result = dependencyUpgrade(recipeTask, ctx, { packages: pkgs, quality: true });
    } else if (item.type === "incident") {
      result = incident(recipeTask, ctx, { checkpoint: true });
    } else {
      const act = requireAct(ctx);
      result = act(
        "Handle the queued development work item. If type/domain are unknown, triage and propose next actions. Record what you did.",
        { item, task, ...ctx }
      );
    }

    if (typeof ack === "function") {
      await ack(item.raw, { ok: true, result });
    }
  };

  return runQueueWorkerForever({
    name,
    pollBatch,
    handleOne: handleOne ?? defaultHandleOne,
    emptySleepMs,
    perItemSleepMs,
    logger,
  });
};

