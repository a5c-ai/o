import { runQualityGate } from "../core/loops/quality_gate.js";
import { defaultDevelop } from "../core/primitives.js";
import { normalizeTask } from "../core/task.js";

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

export const statusUpdate = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Project status update",
      prompt:
        "Write a project status update for internal stakeholders. Include: " +
        "RAG status, accomplishments, plan for next period, risks/blockers, " +
        "dependencies, and asks. Keep it scannable.",
      input,
    },
    ctx,
    [
      "Includes current status and time-bound next steps",
      "Risks and dependencies are specific with mitigation/owners",
      "Format is scannable and decision-oriented",
    ],
    opts
  );
};

export const createProjectPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Create project plan",
      prompt:
        "Create a lightweight project plan. Output JSON: " +
        "{\"goal\": string, \"milestones\": [{\"name\": string, \"outcome\": string, \"eta\": string}], " +
        "\"workstreams\": [{\"name\": string, \"ownerRole\": string, \"deliverables\": string[]}], " +
        "\"risks\": [{\"risk\": string, \"mitigation\": string}], \"assumptions\": string[]}",
      input,
    },
    ctx,
    [
      "Milestones have clear outcomes and realistic ETAs",
      "Workstreams have owners and concrete deliverables",
      "Risks and assumptions are explicitly tracked",
    ],
    opts
  );
};

export const riskReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Risk review",
      prompt:
        "Produce a risk review. Output JSON: " +
        "{\"risks\": [{\"risk\": string, \"likelihood\": \"low\"|\"med\"|\"high\", " +
        "\"impact\": \"low\"|\"med\"|\"high\", \"mitigation\": string, \"ownerRole\": string, \"trigger\": string}]}",
      input,
    },
    ctx,
    [
      "Risks have clear triggers and owners",
      "Likelihood and impact are reasoned and consistent",
      "Mitigations are actionable and time-aware",
    ],
    opts
  );
};

export const manageDependencies = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Manage dependencies",
      prompt:
        "Identify and manage dependencies. Output JSON: " +
        "{\"dependencies\": [{\"dependency\": string, \"type\": \"team\"|\"vendor\"|\"platform\"|\"policy\", " +
        "\"neededBy\": string, \"ownerRole\": string, \"status\": string, \"nextAction\": string}]}",
      input,
    },
    ctx,
    [
      "Dependencies are specific with needed-by dates",
      "Ownership and next actions are explicit",
      "Risks from dependencies are surfaced",
    ],
    opts
  );
};

export const changeControl = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Change control proposal",
      prompt:
        "Draft a change control proposal. Include: change summary, scope, " +
        "timeline, rollout/rollback, stakeholder impact, and comms plan.",
      input,
    },
    ctx,
    [
      "Scope, timeline, and impact are clearly stated",
      "Rollout and rollback plans are credible",
      "Comms plan identifies audiences and timing",
    ],
    opts
  );
};

export const retrospective = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Retrospective summary",
      prompt:
        "Write a retrospective summary. Include: what went well, what didn't, " +
        "root causes, and 3-5 concrete action items with owners and due dates.",
      input,
    },
    ctx,
    [
      "Identifies root causes, not just symptoms",
      "Action items are concrete with owners and due dates",
      "Balanced tone and clear takeaways",
    ],
    opts
  );
};

export const criticalPathPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Critical path plan",
      prompt:
        "Create a critical path plan. Output JSON: " +
        "{\"goal\": string, \"milestones\": [{\"name\": string, \"done\": string, \"eta\": string}], " +
        "\"criticalPath\": [{\"step\": string, \"dependsOn\": string[], \"ownerRole\": string, \"risk\": string}], " +
        "\"buffers\": string[], \"decisionPoints\": string[]}",
      input,
    },
    ctx,
    [
      "Critical path steps are dependency-correct and owned",
      "Decision points and buffers are explicit and realistic",
      "Plan is actionable for weekly execution cadence",
    ],
    opts
  );
};

export const raidLog = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "RAID log",
      prompt:
        "Create a RAID log. Output JSON: " +
        "{\"risks\": [{\"risk\": string, \"likelihood\": \"low\"|\"med\"|\"high\", \"impact\": \"low\"|\"med\"|\"high\", \"mitigation\": string, \"ownerRole\": string}], " +
        "\"assumptions\": [{\"assumption\": string, \"validation\": string, \"ownerRole\": string}], " +
        "\"issues\": [{\"issue\": string, \"impact\": string, \"nextAction\": string, \"ownerRole\": string}], " +
        "\"dependencies\": [{\"dependency\": string, \"neededBy\": string, \"ownerRole\": string, \"status\": string}]}",
      input,
    },
    ctx,
    [
      "Risks are concrete with mitigation and ownership",
      "Assumptions include how they will be validated",
      "Issues and dependencies have next actions and needed-by dates",
    ],
    opts
  );
};

export const scopeChangeAssessment = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Scope change assessment",
      prompt:
        "Assess a scope change request. Output JSON: " +
        "{\"change\": string, \"why\": string, \"impact\": {\"timeline\": string, \"cost\": string, \"risk\": string}, " +
        "\"options\": [{\"option\": string, \"pros\": string[], \"cons\": string[]}], " +
        "\"recommendation\": string, \"decisionsNeeded\": string[]}",
      input,
    },
    ctx,
    [
      "Impact assessment is specific (timeline/cost/risk) not vague",
      "Options include clear tradeoffs and constraints",
      "Recommendation is actionable and decision-oriented",
    ],
    opts
  );
};
