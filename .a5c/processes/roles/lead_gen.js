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
        "Define a rep-executable prospect list specification for outbound prospecting. Stay in lead-gen execution scope: targeting, filters, sources, enrichment, QA, and operating cadence. Do not design CRM schemas, routing rules, or SLA ownership (reserved for sales ops / revops). Do not create channel strategy, budgets, or creative strategy (reserved for marketing growth). Output JSON only. Output JSON: " +
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
        "Build an outbound sequence that an SDR/BDR can execute. Focus on step timing, multi-channel touches, personalization hooks, branching logic, and reply handling handoffs. Do not propose channel strategy, budgets, or creative planning (marketing growth). Do not design CRM workflows, routing, or SLA ownership (sales ops / revops). Output JSON only. Output JSON: " +
        '{ "asOf": string, "sequence": {"name": string, "goal": string, "targetPersona": string, "targetSegment": string|null, "positioning": {"valueHypothesis": string, "proofPoints": string[], "offer": string, "primaryCTA": string, "secondaryCTA": string|null}, "personalization": {"requiredInputs": string[], "tokens": [{"token": string, "description": string, "example": string}], "researchChecklist": string[], "doNotUse": string[]}, "steps": [{"stepNumber": number, "dayOffset": number, "sendWindowLocalTime": {"start": string, "end": string}, "channel": "email"|"call"|"voicemail"|"linkedin"|"sms"|"direct_mail"|"other", "objective": string, "template": {"subject": string|null, "body": string, "talkTrack": string|null, "voicemailScript": string|null, "cta": string}, "personalizationSlots": [{"token": string, "whereUsed": string, "fallbackIfMissing": string}], "successSignal": string, "ifBlockedThen": string}], "branching": {"onNoResponse": {"maxAttempts": number, "rules": [{"condition": string, "action": string}]}, "onOutOfOffice": {"action": string, "waitDays": number}, "onSoftNo": {"action": string, "followUpTemplate": {"subject": string|null, "body": string, "cta": string}}, "onHardNo": {"action": string, "languageToUse": string}, "onUnsubscribeOrDoNotContact": {"action": string}, "onReferral": {"action": string, "template": {"subject": string|null, "body": string}}}}, "guardrails": {"compliance": {"requiredInEmail": string[], "optOutLanguage": string, "doNotContactHandling": string}, "deliverability": {"fromAddressGuidance": string[], "linkAndAttachmentRules": string[], "volumeRamp": string, "bounceHandling": string}, "tone": {"do": string[], "dont": string[]}}, "measurement": {"kpis": [{"name": string, "definition": string}], "expectedRanges": [{"kpi": string, "range": string, "notes": string}], "diagnostics": [{"symptom": string, "likelyCauses": string[], "fixes": string[]}]}, "handoffs": {"whenToHandToAE": string[], "whatToIncludeInHandoff": string[], "meetingBookedCriteria": string[]} }, "notesAndAssumptions": string[] }',
      input,
    },
    ctx,
    [
      "Sequence steps are time-based and runnable (day offsets, channel, objective, and executable templates/scripts)",
      "Personalization is operationalized with required inputs, token definitions, and fallback logic (no missing-data dead ends)",
      "Branching covers common outcomes (no response, OOO, soft no, hard no, unsubscribe, referral) with clear actions",
      "Guardrails include compliance and deliverability controls plus measurement diagnostics that map symptoms to fixes",
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
        "Create a speed-to-lead playbook for inbound inquiries (forms, demo requests, chat, trials). Focus on response SLAs, first-touch scripts, follow-up attempts, escalation, and reporting. Do not design routing rules or ownership models (sales ops / revops owns routing); instead, reference 'the existing routing rules' and specify what to do once an inquiry is assigned. Do not create channel strategy, budgets, or creative planning (marketing growth). Output JSON only. Output JSON: " +
        '{ "asOf": string, "scope": {"inboundSourcesInScope": string[], "outOfScope": string[], "assumptions": string[]}, "slas": {"timeToFirstResponse": {"targetMinutes": number, "definitionOfMet": string, "measurementNotes": string}, "timeToFirstMeaningfulTouch": {"targetMinutes": number, "definitionOfMet": string, "measurementNotes": string}, "coverageHours": {"timezone": string, "hours": string, "afterHoursPolicy": string}}, "firstTouch": {"goals": string[], "qualificationMindset": string, "scripts": [{"channel": "phone"|"email"|"chat"|"sms"|"other", "whenToUse": string, "script": string, "questionsToAsk": [{"question": string, "why": string, "goodAnswerSignals": string[], "redFlags": string[]}], "nextStepOptions": string[]}], "assets": [{"asset": string, "whenToSend": string, "notes": string}]}, "followUpCadence": {"attemptPlan": [{"attemptNumber": number, "within": string, "channel": "phone"|"email"|"chat"|"sms"|"other", "messageOrScript": string, "objective": string}], "stopRules": [{"condition": string, "action": string}], "meetingSchedulingGuidance": {"options": string[], "whenToSendCalendarLink": string, "noShowPolicy": string}}, "triageAndEscalation": {"whatToCheckImmediately": string[], "fastTracks": [{"condition": string, "action": string}], "escalationTriggers": [{"trigger": string, "escalateToRole": string, "within": string, "whatToInclude": string[]}], "handoffToAssignedOwner": {"whatToSend": string[], "requiredContextFields": string[], "notes": string}}, "reporting": {"dashboardsOrReports": [{"name": string, "audience": string, "cadence": string, "questionsAnswered": string[]}], "metrics": [{"metric": string, "definition": string, "target": string|null, "cadence": string}], "alerts": [{"alert": string, "threshold": string, "action": string}], "reviewCadence": {"daily": string[], "weekly": string[]}}, "qualityChecks": [{"check": string, "how": string, "cadence": string, "ownerRole": string, "failureAction": string}], "commonFailureModes": [{"failure": string, "symptoms": string[], "rootCauses": string[], "fix": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Playbook defines SLAs with clear definitions of met and measurement notes (time-to-first-response and meaningful touch)",
      "First-touch scripts are channel-specific and include qualification questions with good-answer signals and red flags",
      "Follow-up cadence is explicit (attempt plan, stop rules, meeting scheduling/no-show policy) and realistic for resourcing",
      "Escalation, reporting, and quality checks are operational (triggers, required context, alerts, review cadence, failure modes)",
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
        "Create a reply-handling and qualification guide for inbound/outbound responses. Include an intent taxonomy, recommended response templates, qualification questions, meeting criteria, and disqualification criteria. Keep to lead-gen execution and conversation handling; do not design CRM schemas, routing, or forecasting processes (sales ops / revops). Do not write channel strategy or creative planning (marketing growth). Output JSON only. Output JSON: " +
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

