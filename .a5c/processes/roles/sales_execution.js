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

export const territoryAndAccountPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Territory and account plan",
      prompt:
        "Build a rep-executable territory and account plan. Focus on prioritization, targets, sequences, stakeholder mapping, and a weekly execution plan. Do not write GTM strategy, pricing, or CRM process design. Output JSON only. Output JSON: " +
        '{ "asOf": string, "territory": {"name": string, "definition": string, "segmentsInScope": string[], "outOfScope": string[], "assumptions": string[]}, "targets": {"timeHorizon": "30d"|"60d"|"90d"|"180d", "pipelineTarget": string, "meetingsTarget": number, "oppsTarget": number, "revenueTarget": string|null, "activityGuardrails": {"callsPerWeek": number|null, "emailsPerWeek": number|null, "socialTouchesPerWeek": number|null}}, "accountTiers": [{"tier": "T1"|"T2"|"T3", "definition": string, "expectedCoveragePct": number, "focusMotion": string}], "accountPlan": [{"accountName": string, "tier": "T1"|"T2"|"T3", "whyNow": string, "fitSignals": string[], "riskSignals": string[], "currentState": {"knownSystems": string[], "initiatives": string[], "recentEvents": string[]}, "hypothesis": {"problem": string, "impact": string, "whyUs": string}, "stakeholders": [{"role": string, "name": string|null, "influence": "high"|"medium"|"low", "stance": "champion"|"neutral"|"skeptic"|"unknown", "notes": string}], "entryPlays": [{"play": string, "trigger": string, "messageAngle": string, "proofPoints": string[]}], "sequence": {"channels": string[], "steps": [{"day": number, "channel": string, "action": string, "scriptOrTemplate": string}]}, "nextActions": [{"action": string, "owner": string, "due": string, "successCriteria": string}] }], "weeklyExecutionPlan": [{"weekOf": string, "focus": string, "accountsInFocus": string[], "mustDoOutcomes": string[], "timeBlocks": [{"block": string, "hours": number, "what": string}], "meetingsToSet": [{"account": string, "goal": string, "stakeholderRole": string, "proposedAsk": string}], "reviewCadence": {"daily": string, "weeklyManagerReview": {"agenda": string[], "inputs": string[]}} }], "metricsAndInstrumentation": [{"metric": string, "definition": string, "target": string, "sourceSystem": string, "cadence": string}], "risksAndMitigations": [{"risk": string, "likelihood": "low"|"medium"|"high", "impact": "low"|"medium"|"high", "mitigation": string, "earlyWarning": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Account tiers and prioritization are explicit, with a short list of focus accounts and clear rationale (fit + why-now)",
      "Each focus account includes a concrete sequence and timeboxed next actions with owners and success criteria",
      "Weekly execution plan is runnable (time blocks, must-do outcomes, manager review agenda, and measurable targets)",
      "Risks include early warnings and mitigations that change the weekly plan when triggered",
    ],
    opts
  );
};

export const dealReviewPack = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Deal review pack",
      prompt:
        "Produce a rigorous deal review pack for a pipeline review. Include stage integrity checks, MEDDICC-style gaps, a mutual action plan, risks, and the next best actions. Do not design CRM schema, routing, or forecasting processes. Output JSON only. Output JSON: " +
        '{ "deal": {"name": string, "account": string, "segment": string|null, "stage": string, "amount": string|null, "closeDate": string|null, "primaryUseCase": string, "whyNow": string, "dealType": "new"|"expansion"|"renewal"|"unknown"}, "stageIntegrity": {"currentStageClaim": string, "exitCriteria": [{"criterion": string, "met": boolean, "evidence": string, "gap": string|null}], "nextStage": string, "blockers": string[]}, "meddicc": {"metrics": {"desiredBusinessOutcomes": string[], "successMeasures": string[], "economicImpactEstimate": string|null}, "economicBuyer": {"identified": boolean, "roleOrName": string|null, "accessPlan": string, "risk": string}, "decisionCriteria": {"mustHave": string[], "niceToHave": string[], "securityLegalProcurement": string[]}, "decisionProcess": {"steps": [{"step": string, "owner": string, "date": string|null}], "decisionDate": string|null}, "paperProcess": {"steps": [{"step": string, "owner": string, "date": string|null}], "risks": string[]}, "identifyPain": {"topProblems": string[], "impactNarrative": string, "statusQuoRisks": string[]}, "champion": {"identified": boolean, "roleOrName": string|null, "strength": "strong"|"medium"|"weak"|"unknown", "enablementPlan": string[]}, "competition": {"competitors": string[], "statusQuo": string, "winThemes": string[], "lossRisks": string[]} }, "dealNarrative": {"oneSentence": string, "whyUs": string[], "proofPlan": [{"proof": string, "howValidated": string, "owner": string, "due": string|null}]}, "mutualActionPlan": {"northStarOutcome": string, "timeline": [{"milestone": string, "date": string|null, "customerOwner": string|null, "ourOwner": string, "definitionOfDone": string[]}], "criticalDependencies": string[]}, "nextSteps": [{"step": string, "owner": "us"|"customer"|"partner", "due": string|null, "whatGoodLooksLike": string, "riskIfMissed": string}], "risks": [{"risk": string, "type": "champion"|"competition"|"timing"|"security"|"legal"|"procurement"|"budget"|"value"|"product_fit"|"unknown", "severity": "low"|"medium"|"high", "evidence": string, "mitigation": string, "earlyWarning": string}], "asks": {"whatWeNeedFromManager": string[], "whatWeNeedFromXfnTeams": [{"team": string, "ask": string, "by": string|null}]}, "forecastRecommendation": {"call": "commit"|"best_case"|"pipeline"|"slip"|"no_bid", "confidence": "low"|"medium"|"high", "topReasons": string[], "whatWouldChangeMyMind": string[]} }',
      input,
    },
    ctx,
    [
      "Stage integrity is explicit: each exit criterion is marked met/not met with evidence and a concrete gap close plan",
      "MEDDICC sections surface the top 3 risks/gaps and translate them into owned, timebound next steps",
      "Mutual action plan is calendar-ready (milestones, owners, definitions of done) and highlights critical dependencies",
      "Forecast recommendation states confidence, reasons, and clear disqualifiers or slip triggers",
    ],
    opts
  );
};

export const meetingPrepBrief = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Meeting prep brief",
      prompt:
        "Create a meeting prep brief for a sales meeting. Include research, hypotheses, tailored value props, a tight agenda, discovery questions, objections/risks, and what success looks like. Do not write generic sales playbooks; tailor to the specific meeting context provided. Output JSON only. Output JSON: " +
        '{ "meeting": {"type": "discovery"|"demo"|"exec_alignment"|"technical_deep_dive"|"commercial"|"renewal"|"qbr"|"other", "dateTime": string|null, "attendees": [{"name": string|null, "role": string, "team": string|null, "seniority": string|null, "notes": string}], "ourAttendees": [{"role": string, "responsibilityInMeeting": string}], "objectives": string[], "desiredOutcomes": string[], "nonGoals": string[]}, "accountResearch": {"companySummary": string, "industry": string, "strategicInitiatives": string[], "recentSignals": [{"signal": string, "whyItMatters": string, "source": string|null}], "knownStackAndConstraints": {"stack": string[], "constraints": string[]}, "likelyBuyingCommitteeRoles": string[]}, "hypotheses": [{"hypothesis": string, "whyWeBelieve": string, "howToTest": string}], "agenda": [{"minute": number, "topic": string, "lead": string, "notes": string}], "talkTrack": {"opening": string, "positioning": {"valueProps": [{"valueProp": string, "forWhom": string, "proof": string[], "tieToSignals": string}], "examples": string[]}, "demoOrDiscussionPlan": [{"section": string, "goal": string, "whatToShowOrDiscuss": string[], "questionsToAsk": string[]}]}, "discovery": {"mustAskQuestions": [{"question": string, "why": string, "goodAnswerSignals": string[], "redFlags": string[]}], "priorityTopics": string[]}, "objectionsAndResponses": [{"objection": string, "likelyFromRole": string, "response": string, "proofOrStory": string}], "risks": [{"risk": string, "earlyWarning": string, "countermove": string}], "logistics": {"preworkToSend": [{"item": string, "toWhom": string, "when": string}], "materialsToPrepare": string[], "rolesAndHandoffs": string[], "timeBoxNotes": string}, "closingPlan": {"commitmentAsk": string, "optionsIfTheyWontCommit": string[], "followUpEmailTemplate": string, "nextMeetingProposal": string}, "successChecklist": [{"check": string, "howMeasured": string}], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Agenda is timeboxed and maps to specific desired outcomes and a clear commitment ask",
      "Discovery questions are high-signal (each includes why, good-answer signals, and red flags)",
      "Value props and talk track tie directly to account signals and the roles in the room (no generic fluff)",
      "Closing plan includes a concrete next step with options if the buyer resists committing",
    ],
    opts
  );
};

export const callCoachingScorecard = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Call coaching scorecard",
      prompt:
        "Generate a call coaching scorecard and actionable feedback. Use the call transcript or notes in the input; if a field is not supported by the input, set it to null and explain in notes. Include talk ratio, discovery depth, objection handling, next-step quality, and coaching drills. Output JSON only. Output JSON: " +
        '{ "call": {"type": "discovery"|"demo"|"follow_up"|"negotiation"|"other", "durationMinutes": number|null, "participants": [{"side": "us"|"customer"|"other", "role": string, "name": string|null}], "context": string}, "scorecard": {"rubric": [{"dimension": "rapport"|"agenda_control"|"discovery_depth"|"qualification"|"messaging_value"|"objection_handling"|"next_steps"|"executive_presence"|"other", "weight": number, "description": string, "score_1_to_5": number, "evidence": string[], "improveBy": string[]}], "overallScore_1_to_5": number, "topStrengths": string[], "topOpportunities": string[]}, "quantSignals": {"talkRatio": {"usPct": number|null, "customerPct": number|null, "notes": string}, "questionQuality": {"openEndedExamples": string[], "leadingExamples": string[], "missedQuestions": string[]}, "nextStepQuality": {"clearOwner": boolean|null, "clearDate": boolean|null, "clearPurpose": boolean|null, "notes": string}}, "moments": [{"timestampOrCue": string|null, "whatHappened": string, "whyItMatters": string, "betterOption": string}], "objections": [{"objection": string, "repResponse": string, "evaluation": "strong"|"ok"|"weak", "betterResponse": string, "proofToUse": string}], "coachingPlan": {"focusForNext7Days": string, "drills": [{"drill": string, "howToDoIt": string, "frequency": string, "successCriteria": string}], "homework": [{"item": string, "due": string|null}], "managerFollowUp": {"inNext1on1": string[], "listeningChecklist": string[]}}, "rewrite": {"betterOpening": string, "betterAgendaSetting": string, "betterClosingNextSteps": string}, "notesAndAssumptions": string[] }',
      input,
    },
    ctx,
    [
      "Feedback cites concrete evidence and turns it into specific alternative wording and drills (not generic advice)",
      "Scorecard weights and scores are consistent with the evidence and prioritize the highest leverage behavior changes",
      "Next-step coaching produces an owned, dated plan (or explicitly notes missing data) with clear success criteria",
      "Quant signals and moments are interpretable even when transcript data is partial (nulls explained in notes)",
    ],
    opts
  );
};

