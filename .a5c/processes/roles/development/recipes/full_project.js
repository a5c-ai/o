import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { runPlanExecute } from "../../../core/loops/plan_execute.js";
import { buildDevelopForDomain } from "./_shared.js";
import { domainRegistry } from "../domains/registry.js";

export const fullProject = (
  task,
  ctx = {},
  { partsPrompt, domainForPart, quality = { threshold: 0.85, maxIters: 3 } } = {}
) => {
  const { act } = primitivesFrom(ctx);
  requirePrimitive("act", act);

  const project = runPlanExecute({
    task: {
      title: "Define project",
      prompt:
        "Define requirements, scope, architecture, and a development plan. Keep it concise but complete.",
    },
    ctx,
    develop: ctx.develop,
    checkpoint: true,
  });

  const domainEnum = Object.keys(domainRegistry)
    .sort()
    .map((d) => `"${d}"`)
    .join("|");

  const defaultPartsPrompt =
    "From the project definition, list project parts in dependency order. " +
    `Return array of {"name": string, "domain": ${domainEnum}, "task": string}.`;

  const parts =
    act(
      partsPrompt ??
        defaultPartsPrompt,
      { ...ctx, project, requestedTask: task }
    ) ?? [];

  const partResults = [];
  for (const part of Array.isArray(parts) ? parts : []) {
    const domain =
      (domainForPart && domainForPart(part, ctx)) ?? part.domain ?? ctx.domain ?? "backend";
    const develop = buildDevelopForDomain(domain, {
      baseDevelop: ctx.develop,
      quality,
      planning: { enabled: true, checkpoint: true },
    });
    const output = develop(part.task ?? part.name ?? "Part", { ...ctx, project, part });
    partResults.push({ part, domain, output });
  }

  return { requestedTask: task, project, parts, partResults };
};
