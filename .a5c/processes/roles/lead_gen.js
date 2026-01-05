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

export const prospectListSpec = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Prospect list spec",
      prompt:
        "Define a rep-executable prospect list specification for outbound prospecting. " +
        "Stay in lead-gen execution scope: targeting, filters, sources, enrichment, QA, and operating cadence. " +
        "Do not design CRM schemas, routing rules, or SLA ownership (reserved for sales ops / revops). " +
        "Do not create channel strategy, budgets, or creative strategy (reserved for marketing growth). " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "objective": string, "icp": {"summary": string, "industriesInScope": string[], "industriesOutOfScope": string[], "companySize": {"employees": {"min": number|null, "max": number|null}, "revenue": {"min": string|null, "max": string|null}}, "geosInScope": string[], "geosOutOfScope": string[], "techOrStackSignals": string[], "intentSignals": string[], "exclusionSignals": string[], "assumptions": string[]}, "targeting": {"accountBased": boolean, "accountSelection": {"method": "named_accounts"|"tiered_list"|"open_universe", "tiers": [{"tier": "T1"|"T2"|"T3", "definition": string, "targetCount": number}], "accountInclusionRules": string[], "accountExclusionRules": string[]}, "personaTargets": [{"persona": string, "seniority": "ic"|"manager"|"director"|"vp"|"cxo"|"mixed", "functions": string[], "jobTitleKeywords": string[], "jobTitleExclusions": string[], "buyingRole": "economic_buyer"|"champion"|"influencer"|"end_user"|"procurement"|"security"|"unknown", "painHypotheses": string[], "triggers": string[]}]}, "sources": [{"source": string, "priority": "high"|"medium"|"low", "whatItProvides": string[], "howToQuery": string, "knownGaps": string[]}], "dataRequirements": {"requiredFields": string[], "recommendedFields": string[], "fieldQualityRules": [{"field": string, "rule": string, "rejectIfFails": boolean}]}, "enrichmentPlan": {"steps": [{"step": string, "inputs": string[], "outputs": string[], "tooling": string[]}], "dedupeAndNormalization": {"dedupeKeys": string[], "normalizationRules": string[], "mergePolicy": string}, "validationChecks": [{"check": string, "how": string, "failureAction": string}]}, "listBuild": {"unit": "accounts"|"contacts", "targetCount": number, "batchSize": number, "cadence": "weekly"|"biweekly"|"monthly"|"ad_hoc", "namingConvention": string, "exportFormat": {"fileType": "csv"|"xlsx"|"json", "columns": string[]}, "handoffNotes": string}, "qualityAssurance": {"samplingPlan": {"sampleSize": number, "howSelected": string, "acceptanceCriteria": string[]}, "commonFailureModes": [{"failure": string, "howToDetect": string, "fix": string}], "deliverabilityRiskChecks": [{"check": string, "threshold": string, "mitigation": string}]}, "complianceAndEthics": {"requirements": string[], "doNotContactRules": string[], "optOutHandling": string, "regionalNotes": [{"region": string, "notes": string}]}, "operatingCadence": {"weeklyWorkflow": [{"step": string, "ownerRole": string, "timeboxMinutes": number, "inputs": string[], "outputs": string[]}], "metrics": [{"metric": string, "definition": string, "target": string|null, "cadence": string, "notes": string}], "iterationPlan": {"whatToReview": string[], "howToUpdateFilters": string, "whenToRetireAList": string}}, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "ICP and targeting rules are explicit (in-scope/out-of-scope, exclusions, and persona definitions are actionable)",
      "Sources and enrichment steps are implementable (how to query, required fields, dedupe/normalization, and validation checks)",
      "QA sampling plan is concrete (sample size, selection method, acceptance criteria, failure modes, and deliverability checks)",
      "Operating cadence includes a runnable weekly workflow with metrics that drive list iteration and quality improvement",
    ],
    opts
  );
};

export const outboundSequenceBuilder = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Outbound sequence builder",
      prompt:
        "Build an outbound sequence that an SDR/BDR can execute. Focus on step timing, multi-channel touches, personalization hooks, branching logic, and reply handling handoffs. " +
        "Do not propose channel strategy, budgets, or creative planning (marketing growth). " +
        "Do not design CRM workflows, routing, or SLA ownership (sales ops / revops). " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "sequence": { "name": string, "goal": string, "audience": { "icpSummary": string, "persona": string, "seniority": "ic"|"manager"|"director"|"vp"|"cxo"|"mixed", "industryContext": string|null }, "guardrails": { "tone": "professional"|"friendly"|"direct"|"consultative"|"other", "doNotDo": string[], "complianceNotes": string[] }, "timing": { "timezoneAssumption": string, "sendWindows": [{"days": string, "localTimeRange": string}], "sequenceLengthDays": number }, "personalization": { "requiredHooks": [{"hook": string, "whereUsed": string, "howToFind": string}], "optionalHooks": [{"hook": string, "whereUsed": string, "howToFind": string}], "redLines": string[] }, "steps": [{ "stepNumber": number, "dayOffset": number, "channel": "email"|"phone"|"linkedin"|"sms"|"video"|"other", "objective": string, "message": { "subject": string|null, "body": string|null, "talkTrack": string|null, "voicemail": string|null, "cta": string|null }, "personalizationPlaceholders": [{"placeholder": string, "instruction": string}], "ifNoResponseNext": number|null, "ifPositiveReplyNext": number|null, "ifNegativeReplyNext": number|null, "ifObjectionNext": number|null, "notes": string }], "branching": { "rules": [{"condition": string, "goToStepNumber": number, "reason": string}] }, "replyHandling": { "handoffRules": [{"triggerIntent": string, "action": string, "ownerRole": string, "within": string, "whatToInclude": string[]}], "objectionSnippets": [{"objection": string, "response": string, "goal": string}] }, "stopRules": [{"condition": string, "action": "stop"|"pause"|"handoff"|"nurture", "notes": string}], "assets": [{"asset": string, "whenToUse": string, "linkOrLocation": string|null, "notes": string}], "measurement": { "primaryMetrics": [{"metric": string, "definition": string, "target": string|null}], "diagnosticMetrics": [{"metric": string, "definition": string}], "reviewCadence": { "daily": string[], "weekly": string[] } }, "qualityChecks": [{"check": string, "how": string, "failureAction": string}] }, "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Sequence is executable: step timing, channels, objectives, and scripts are complete and internally consistent",
      "Personalization hooks are concrete (how to find info, where it is used) and include red lines to avoid fabrication",
      "Branching and stop rules are explicit and cover no-response, positive, negative, and objection scenarios",
      "Reply handoffs, measurement, and quality checks are operational and minimal (enable iteration without revops redesign)",
    ],
    opts
  );
};

export const inboundSpeedToLeadPlaybook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Inbound speed-to-lead playbook",
      prompt:
        "Create an inbound speed-to-lead playbook for SDR/BDR execution. Focus on SLAs/definitions, triage, first-response and follow-up attempt plan, after-hours coverage, escalation, and handoffs. " +
        "Do not design CRM schemas, routing automation, or ownership models (sales ops / revops). " +
        "Do not propose channel strategy, budgets, or creative planning (marketing growth). " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "objective": string, "definitions": { "inboundLead": string, "firstResponse": string, "meaningfulTouch": string, "businessHours": string, "afterHours": string }, "slas": { "timeToFirstResponseMinutes": { "target": number, "max": number, "measurementNotes": string }, "timeToMeaningfulTouchMinutes": { "target": number, "max": number, "measurementNotes": string }, "followUpWindowDays": number }, "triage": { "priorityRules": [{"rule": string, "priority": "p0"|"p1"|"p2"|"p3", "why": string}], "whatToCheck": string[], "requiredFieldsToProceed": string[] }, "responsePlaybook": { "channels": [{"channel": "email"|"phone"|"sms"|"chat"|"other", "whenToUse": string, "firstMessageTemplate": { "subject": string|null, "bodyOrScript": string }, "secondTouchTemplate": { "subject": string|null, "bodyOrScript": string }}], "attemptPlan": [{"attemptNumber": number, "withinMinutes": number, "channel": "email"|"phone"|"sms"|"chat"|"other", "objective": string, "scriptOrMessage": string, "voicemail": string|null, "notes": string}] }, "handoffs": { "whenToHandoff": [{"condition": string, "handoffToRole": string, "withinMinutes": number, "whatToInclude": string[]}], "meetingBookingRules": { "whenToOfferTimes": string, "calendarLinkPolicy": string, "noShowPolicy": string } }, "escalation": { "triggers": [{"trigger": string, "escalateToRole": string, "withinMinutes": number, "action": string}], "fallbackCoverage": [{"scenario": string, "coveragePlan": string}] }, "toolingAssumptions": string[], "reporting": { "metrics": [{"metric": string, "definition": string, "target": string|null, "cadence": string}], "alerts": [{"alert": string, "threshold": string, "action": string}], "reviewCadence": { "daily": string[], "weekly": string[] } }, "qualityChecks": [{"check": string, "how": string, "cadence": string, "ownerRole": string, "failureAction": string}], "commonFailureModes": [{"failure": string, "symptoms": string[], "rootCauses": string[], "fix": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "SLAs and definitions are unambiguous (what counts as first response and meaningful touch, and how to measure)",
      "Attempt plan is realistic and meets SLAs across business hours and after-hours coverage assumptions",
      "Triage, escalation, and handoffs are concrete (priorities, triggers, time bounds, and required context)",
      "Reporting and quality checks drive continuous improvement (alerts, review cadence, and failure modes)",
    ],
    opts
  );
};

export const replyHandlingAndQualificationGuide = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Reply handling and qualification guide",
      prompt:
        "Create a reply-handling and qualification guide for inbound/outbound responses. Include an intent taxonomy, recommended response templates, qualification questions, meeting criteria, and disqualification criteria. " +
        "Keep to lead-gen execution and conversation handling; do not design CRM schemas, routing, or forecasting processes (sales ops / revops). " +
        "Do not write channel strategy or creative planning (marketing growth). " +
        "Output JSON only (no markdown, no extra keys). Output JSON: " +
        '{ "asOf": string, "intentTaxonomy": [{"intent": "positive_interest"|"request_info"|"pricing"|"timing_later"|"already_using_competitor"|"already_solved_in_house"|"security_legal"|"not_a_fit"|"wrong_person"|"unsubscribe_do_not_contact"|"negative_hostile"|"other", "signals": string[], "disposition": "continue"|"qualify"|"schedule"|"handoff"|"nurture"|"close_lost"|"do_not_contact", "responseTemplate": {"subject": string|null, "body": string, "toneNotes": string, "cta": string|null}, "followUpQuestions": [{"question": string, "why": string, "goodAnswerSignals": string[], "redFlags": string[]}], "nextActions": [{"action": string, "ownerRole": string, "timeframe": string, "successCriteria": string}]}], "qualificationFramework": {"fields": [{"field": "problem"|"impact"|"urgency"|"current_solution"|"decision_process"|"stakeholders"|"budget"|"security_constraints"|"data_requirements"|"procurement"|"other", "definition": string, "questions": string[], "disqualifiers": string[], "notes": string}], "minimumInfoToBookMeeting": {"required": string[], "niceToHave": string[]}, "whenToHandoffToAE": {"criteria": string[], "whatToInclude": string[]}}, "meetingCriteria": {"qualifiedMeetingDefinition": string, "confirmBeforeScheduling": string[], "agendaTemplate": {"opening": string, "topics": string[], "close": string}, "rescheduleAndNoShowPolicy": string}, "disqualificationAndCloseOut": {"reasons": [{"reason": string, "signals": string[], "politeCloseTemplate": string}], "nurturePaths": [{"path": string, "whenToUse": string, "whatToSend": string[], "checkBackCadence": string}]}, "complianceNotes": {"doNotContactHandling": string, "dataAndPrivacyNotes": string[], "safeLanguage": string[], "avoidLanguage": string[]}, "notesAndAssumptions": string[] }',
      input,
    },
    ctx,
    [
      "Intent taxonomy is complete enough for day-to-day reply triage (clear signals, disposition, templates, and next actions)",
      "Qualification questions are high-signal and paired with good-answer signals and red flags, not generic checklists",
      "Meeting criteria and handoffs are explicit (minimum info, when to involve AE, what to include, and scheduling/no-show policy)",
      "Disqualification and compliance guidance provide safe, consistent closeout and DNC handling without process redesign",
    ],
    opts
  );
};
