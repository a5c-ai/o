import { sleep } from "./sleep.js";

export const runRecurringForever = async ({
  name,
  intervalMs,
  runOnce,
  logger = console,
}) => {
  if (typeof runOnce !== "function") {
    throw new Error("runRecurringForever: runOnce must be a function");
  }
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new Error("runRecurringForever: intervalMs must be a non-negative number");
  }

  for (;;) {
    const startedAt = Date.now();
    try {
      await runOnce();
    } catch (err) {
      logger?.error?.(`[${name ?? "recurring"}] iteration error`, err);
    } finally {
      const elapsedMs = Date.now() - startedAt;
      logger?.info?.(
        `[${name ?? "recurring"}] iteration complete (elapsedMs=${elapsedMs})`
      );
    }

    await sleep(intervalMs);
  }
};

