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

export const sloSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "SLO spec (SRE)",
      prompt:
        "Draft an SLO spec for a service. Focus on measurable SLIs, target SLOs, alerting/burn rate guidance, error budget policy, and review cadence. " +
        "Prefer clarity over completeness; do not invent monitoring systems or metrics you cannot justify. Output JSON only. Output JSON: " +
        '{ "asOf": string, "service": {"name": string, "tier": "0"|"1"|"2"|"3", "users": string[], "criticalUserJourneys": string[], "dependencies": string[], "assumptions": string[]}, "slis": [{"name": string, "userImpact": string, "measurement": {"source": string, "queryOrDefinition": string, "goodEvents": string, "totalEvents": string, "notes": string[]}, "dimensions": string[], "exclusions": string[]}], "slos": [{"name": string, "sliName": string, "target": string, "window": "7d"|"28d"|"90d", "reliabilityModel": "availability"|"latency"|"correctness"|"durability"|"other", "rationale": string, "knownTradeoffs": string[]}], "alerting": {"strategy": "burn_rate"|"static_threshold"|"hybrid", "alerts": [{"name": string, "sloName": string, "signal": string, "threshold": string, "severity": "page"|"ticket"|"info", "responseSla": string, "runbook": string}], "noiseControls": string[]}, "errorBudget": {"policy": {"whenToFreezeChanges": string[], "whenToEscalate": string[], "exceptions": string[]}, "decisionMakers": [{"role": string, "whenInvolved": string}], "reportingCadence": "weekly"|"biweekly"|"monthly"}, "operatingCadence": {"reviews": [{"cadence": "weekly"|"monthly"|"quarterly", "agenda": string[], "inputs": string[], "outputs": string[]}], "ownership": {"sloOwnerRole": string, "onCallTeam": string, "escalation": [{"trigger": string, "toRole": string}]}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "SLIs and SLOs are measurable and tied to user impact and service tier",
      "Alerting guidance is actionable and includes noise controls plus runbook links",
      "Error budget policy includes concrete decision rules and review cadence",
    ],
    opts
  );
};

export const errorBudgetPolicy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Error budget policy",
      prompt:
        "Write an error budget policy for a service or product area. " +
        "Define how error budget is calculated and how it gates releases, incidents, and exceptions. Output JSON only. Output JSON: " +
        '{ "asOf": string, "scope": {"serviceOrArea": string, "sloWindow": "7d"|"28d"|"90d", "sloNames": string[], "assumptions": string[]}, "policy": {"states": [{"name": "green"|"yellow"|"red", "definition": string, "whatChangesAllowed": string[], "requiredApprovals": string[], "requiredMitigations": string[]}], "changeFreezeRules": [{"when": string, "freezeAppliesTo": string[], "overrideConditions": string[], "overrideApprovers": string[]}], "incidentRules": [{"when": string, "requiredActions": string[], "comms": {"channel": string, "cadence": string}}], "exceptions": [{"allowedFor": string, "criteria": string[], "timeboxedForDays": number, "requiredFollowUps": string[]}], "reporting": {"cadence": "weekly"|"biweekly"|"monthly", "audience": string[], "fields": string[]}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Policy defines clear state thresholds and corresponding release/approval constraints",
      "Overrides are timeboxed and include follow-up actions to pay down reliability debt",
      "Reporting cadence and fields make the policy enforceable and auditable",
    ],
    opts
  );
};

export const runbookDraft = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Runbook draft (on-call)",
      prompt:
        "Draft an on-call runbook for a service. Keep it executable under pressure (copy/paste steps), and include verification and rollback where relevant. Output JSON only. Output JSON: " +
        '{ "asOf": string, "service": {"name": string, "envs": string[], "owners": [{"role": string, "onCall": boolean}]}, "triggers": [{"alertName": string, "symptoms": string[], "severity": "page"|"ticket"|"info", "links": [{"label": string, "url": string}]}], "quickTriage": [{"step": string, "command": string|null, "expected": string, "ifUnexpected": string}], "diagnostics": [{"goal": string, "steps": [{"step": string, "command": string|null, "notes": string}]}], "mitigations": [{"action": string, "safeToTryFirst": boolean, "rollback": string|null, "verification": string}], "comms": {"whenToDeclareIncident": string, "channel": string, "statusUpdateCadence": string, "whoToNotify": string[]}, "postIncident": {"whatToRecord": string[], "followUpsTemplate": {"ownerRole": string, "priority": "p0"|"p1"|"p2"|"p3", "acceptance": string}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Runbook is executable: ordered steps with expected results and what to do if unexpected",
      "Mitigations include verification and rollback guidance and avoid unsafe actions by default",
      "Post-incident follow-up fields include ownerRole, priority, and acceptance criteria",
    ],
    opts
  );
};

export const operationalReadinessReview = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Operational readiness review (ORR)",
      prompt:
        "Perform an operational readiness review for launching or materially changing a service. " +
        "Cover observability, reliability, security, capacity, dependencies, and on-call readiness. Output JSON only. Output JSON: " +
        '{ "asOf": string, "service": {"name": string, "changeSummary": string, "launchDate": string|null, "owners": string[]}, "readiness": {"sloCoverage": {"status": "pass"|"partial"|"fail", "notes": string, "requiredActions": string[]}, "monitoringAndAlerting": {"status": "pass"|"partial"|"fail", "notes": string, "requiredActions": string[]}, "runbooksAndOnCall": {"status": "pass"|"partial"|"fail", "notes": string, "requiredActions": string[]}, "incidentResponse": {"status": "pass"|"partial"|"fail", "notes": string, "requiredActions": string[]}, "capacityAndLimits": {"status": "pass"|"partial"|"fail", "notes": string, "requiredActions": string[]}, "dependencies": {"status": "pass"|"partial"|"fail", "notes": string, "requiredActions": string[]}, "securityAndAccess": {"status": "pass"|"partial"|"fail", "notes": string, "requiredActions": string[]}, "rollback": {"status": "pass"|"partial"|"fail", "notes": string, "requiredActions": string[]}}, "topRisks": [{"risk": string, "likelihood": "low"|"medium"|"high", "impact": "low"|"medium"|"high", "mitigation": string, "ownerRole": string}], "launchDecision": {"recommendation": "go"|"no_go"|"go_with_conditions", "conditions": string[], "decisionMakerRole": string}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Each readiness area has a clear status with required actions when not pass",
      "Top risks are prioritized and owned with concrete mitigations",
      "Launch decision includes conditions and a clear recommendation",
    ],
    opts
  );
};

