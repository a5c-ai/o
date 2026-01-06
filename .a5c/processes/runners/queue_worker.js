import { sleep } from "./sleep.js";

export const runQueueWorkerForever = async ({
  name,
  pollBatch,
  handleOne,
  emptySleepMs = 10 * 60 * 1000,
  perItemSleepMs = 0,
  logger = console,
}) => {
  if (typeof pollBatch !== "function") {
    throw new Error("runQueueWorkerForever: pollBatch must be a function");
  }
  if (typeof handleOne !== "function") {
    throw new Error("runQueueWorkerForever: handleOne must be a function");
  }

  for (;;) {
    let items = [];
    try {
      items = (await pollBatch()) ?? [];
    } catch (err) {
      logger?.error?.(`[${name ?? "queue"}] poll error`, err);
      items = [];
    }

    if (!Array.isArray(items) || items.length === 0) {
      logger?.info?.(`[${name ?? "queue"}] empty; sleeping ${emptySleepMs}ms`);
      await sleep(emptySleepMs);
      continue;
    }

    for (const item of items) {
      try {
        await handleOne(item);
      } catch (err) {
        logger?.error?.(`[${name ?? "queue"}] handle error`, err);
      }

      if (perItemSleepMs > 0) {
        await sleep(perItemSleepMs);
      }
    }
  }
};

