import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { checkpointPlan } from "../../../core/checkpoints.js";
import { normalizeTask } from "../../../core/task.js";
import { getDomainPlanningPack } from "../domains/packs/registry.js";
import { riskRegisterChecklist, riskRegisterTemplate, RISK_REGISTER_PROMPT } from "../domains/shared/risk_register.js";
import { observabilityChecklist, observabilityPlanTemplate } from "../domains/shared/observability_slo.js";
import { rollbackChecklist, rollbackPlanTemplate, rolloutChecklist, rolloutPlanTemplate } from "../domains/shared/rollout.js";
import { verificationChecklist, verificationPlanTemplate } from "../domains/shared/verification.js";

const DOMAIN_PLANNING_PROMPT = [
  "Create domain planning artifacts for the task using the provided templates and checklists.",
  "Return a single JSON object with keys:",
  '- "breakdown" (object based on breakdownTemplate, with answers filled in)',
  '- "failureModes" (array of strings, include domain defaults plus task-specific ones)',
  '- "riskRegister" (object based on riskRegisterTemplate, 5-10 risks)',
  '- "verificationPlan" (object based on verificationPlanTemplate)',
  '- "rolloutPlan" (object based on rolloutPlanTemplate)',
  '- "rollbackPlan" (object based on rollbackPlanTemplate)',
  '- "observabilityPlan" (object based on observabilityPlanTemplate)',
  '- "notes" (array of short bullets; tradeoffs, open questions, assumptions)',
  "Keep it compact, concrete, and ASCII-only.",
].join("\n");

const coerceObject = (value, fallback) => {
  if (value && typeof value === "object") return value;
  return fallback;
};

export const withDomainPlanning =
  ({ domain, checkpoint = false, prompt } = {}) =>
  (next) =>
  (task, ctx = {}) => {
    const { act } = primitivesFrom(ctx);
    requirePrimitive("act", act);

    const normalizedTask = normalizeTask(task);
    const domainName = ctx.domain ?? domain ?? "backend";
    const pack = getDomainPlanningPack(domainName);

    const templates = {
      breakdownTemplate: pack.planningBreakdownTemplate?.() ?? { domain: domainName, sections: [] },
      riskRegisterTemplate: riskRegisterTemplate(),
      verificationPlanTemplate: verificationPlanTemplate(),
      rolloutPlanTemplate: rolloutPlanTemplate(),
      rollbackPlanTemplate: rollbackPlanTemplate(),
      observabilityPlanTemplate: observabilityPlanTemplate(),
    };

    const checklists = {
      riskRegisterChecklist: riskRegisterChecklist(),
      verificationChecklist: verificationChecklist(),
      rolloutChecklist: rolloutChecklist(),
      rollbackChecklist: rollbackChecklist(),
      observabilityChecklist: observabilityChecklist(),
    };

    const defaults = {
      failureModes: pack.defaultFailureModes?.() ?? [],
      verificationPlan: pack.defaultVerificationPlan?.() ?? null,
      rolloutPlan: pack.defaultRolloutPlan?.() ?? null,
      rollbackPlan: pack.defaultRollbackPlan?.() ?? null,
      observabilityPlan: pack.defaultObservabilityPlan?.() ?? null,
      sloSketch: pack.defaultSloSketch?.() ?? null,
      migrationPlan: pack.defaultMigrationPlan?.() ?? null,
    };

    const result = act(prompt ?? DOMAIN_PLANNING_PROMPT, {
      ...ctx,
      task: normalizedTask,
      domain: domainName,
      templates,
      checklists,
      defaults,
    });

    const planning = coerceObject(result, {
      breakdown: templates.breakdownTemplate,
      failureModes: defaults.failureModes,
      riskRegister: templates.riskRegisterTemplate,
      verificationPlan: templates.verificationPlanTemplate,
      rolloutPlan: templates.rolloutPlanTemplate,
      rollbackPlan: templates.rollbackPlanTemplate,
      observabilityPlan: templates.observabilityPlanTemplate,
      notes: [
        "Planner output was not a JSON object; using templates and defaults as fallback.",
      ],
    });

    // Ensure a few minimal fields exist even if the agent returned partial JSON.
    planning.domain = planning.domain ?? domainName;
    planning.breakdown = planning.breakdown ?? templates.breakdownTemplate;
    planning.failureModes = planning.failureModes ?? defaults.failureModes ?? [];
    planning.riskRegister = planning.riskRegister ?? templates.riskRegisterTemplate;
    planning.verificationPlan =
      planning.verificationPlan ?? defaults.verificationPlan ?? templates.verificationPlanTemplate;
    planning.rolloutPlan =
      planning.rolloutPlan ?? defaults.rolloutPlan ?? templates.rolloutPlanTemplate;
    planning.rollbackPlan =
      planning.rollbackPlan ?? defaults.rollbackPlan ?? templates.rollbackPlanTemplate;
    planning.observabilityPlan =
      planning.observabilityPlan ?? defaults.observabilityPlan ?? templates.observabilityPlanTemplate;

    if (defaults.sloSketch && !planning.sloSketch) planning.sloSketch = defaults.sloSketch;
    if (defaults.migrationPlan && !planning.migrationPlan) planning.migrationPlan = defaults.migrationPlan;

    // Attach to ctx so later aspects and scoring can access it (ctx is treated as run working memory).
    ctx.domainPlanning = planning;

    if (checkpoint) {
      checkpointPlan(ctx, { task: normalizedTask, domain: domainName, domainPlanning: planning });
    }

    // Optional hint: keep the risk-register prompt available for callers that want a second pass.
    ctx.domainPlanningPrompts = ctx.domainPlanningPrompts ?? {};
    ctx.domainPlanningPrompts.riskRegister = RISK_REGISTER_PROMPT;

    return next(task, ctx);
  };
