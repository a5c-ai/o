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

export const privacyImpactAssessment = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Privacy impact assessment (DPIA/PIA)",
      prompt:
        "Create a DPIA/PIA-style assessment for a feature/product change (data categories, lawful basis, risks, mitigations, residual risk, and decisions). Output JSON: " +
        '{ "summary": string, "scope": string, "dataSubjects": string[], "dataCategories": string[], "processingActivities": [{"activity": string, "purpose": string, "systems": string[], "retention": string}], "lawfulBasis": string, "crossBorderTransfers": {"present": boolean, "mechanism": string|null}, "riskRegister": [{"risk": string, "likelihood": "low"|"medium"|"high", "impact": "low"|"medium"|"high", "mitigations": string[], "residualRisk": "low"|"medium"|"high"}], "decisions": string[], "openQuestions": string[] }',
      input,
    },
    ctx,
    [
      "Lists concrete data subjects/categories and processing activities with systems and retention",
      "Includes a realistic risk register with mitigations and residual risk ratings",
      "Ends with clear decisions and open questions to unblock next steps",
    ],
    opts
  );
};

export const contractReviewChecklist = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Contract review checklist",
      prompt:
        "Review an MSA/SOW/DPA/terms excerpt and produce a negotiation-ready issues list. Output JSON: " +
        '{ "contractType": string, "summary": string, "keyBusinessTerms": {"term": string, "value": string}[], "issues": [{"clause": string, "issue": string, "risk": "low"|"medium"|"high", "recommendedPosition": string, "fallback": string, "why": string}], "redlinesNeeded": string[], "approvalsNeeded": string[], "openItems": string[] }',
      input,
    },
    ctx,
    [
      "Surfaces business-critical terms and flags issues with risk levels and rationale",
      "Provides recommended negotiation positions and fallbacks per issue",
      "Captures required redlines, approvals, and open items needed to close",
    ],
    opts
  );
};

export const complianceControlsMatrix = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Compliance controls matrix",
      prompt:
        "Build a lightweight controls matrix for a chosen framework (SOC2/ISO27001/GDPR/HIPAA/etc.) with evidence and owners. Output JSON: " +
        '{ "framework": string, "scope": string, "assumptions": string[], "controls": [{"controlId": string, "control": string, "ownerRole": string, "frequency": string, "evidence": string[], "systemOfRecord": string, "status": "in_place"|"partial"|"missing", "gaps": string[], "nextSteps": string[]}], "timeline": [{"when": string, "milestone": string, "ownerRole": string}], "topRisks": [{"risk": string, "mitigation": string}] }',
      input,
    },
    ctx,
    [
      "Controls include owners, frequency, evidence artifacts, and system of record",
      "Statuses are justified with gaps and actionable next steps per control",
      "Includes a realistic timeline and top risks with mitigations",
    ],
    opts
  );
};

export const regulatoryGapAssessment = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Regulatory gap assessment",
      prompt:
        "Assess which regulations apply given product + geos + customer types, then identify obligations/gaps and a remediation plan. Output JSON: " +
        '{ "productSummary": string, "jurisdictions": string[], "customerTypes": string[], "regimes": [{"name": string, "whyApplies": string, "keyObligations": string[]}], "gaps": [{"gap": string, "regime": string, "risk": "low"|"medium"|"high", "recommendedFix": string, "ownerRole": string, "due": string}], "externalCounselQuestions": string[], "dependencies": string[] }',
      input,
    },
    ctx,
    [
      "Identifies applicable regimes with clear rationale and key obligations",
      "Maps gaps to regimes with risk ratings, owners, and due dates",
      "Includes dependencies and targeted questions for external counsel",
    ],
    opts
  );
};

export const vendorLegalDueDiligence = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Vendor legal due diligence",
      prompt:
        "Prepare a vendor legal due diligence package (questions + required docs + deal blockers) for procurement/security review. Output JSON: " +
        '{ "vendor": string, "intendedUse": string, "dataShared": {"dataCategories": string[], "pii": boolean, "sensitiveData": string[]}, "requestedArtifacts": string[], "legalQuestions": string[], "dealBreakers": string[], "fallbackPositions": string[], "riskRating": "low"|"medium"|"high", "decision": "approve"|"approve_with_conditions"|"reject"|"needs_more_info", "conditions": string[], "nextSteps": string[] }',
      input,
    },
    ctx,
    [
      "Captures data shared (including PII/sensitive data) and required artifacts to evaluate risk",
      "Separates legal questions from deal breakers and fallback positions",
      "Outputs a coherent risk rating, decision, conditions, and next steps",
    ],
    opts
  );
};

export const policyDraftPack = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Policy draft pack",
      prompt:
        "Draft a policy pack outline tailored to company stage (privacy, data retention, acceptable use, incident response, records, etc.). Output JSON: " +
        '{ "policies": [{"name": string, "purpose": string, "appliesTo": string[], "keySections": string[], "requiredInputs": string[], "ownerRole": string, "reviewCadence": string, "rolloutSteps": string[]}], "gaps": string[], "priorities": [{"policy": string, "priority": "P0"|"P1"|"P2", "why": string}] }',
      input,
    },
    ctx,
    [
      "Policies are tailored with owners, review cadence, required inputs, and rollout steps",
      "Highlights gaps and prioritizes policies with clear rationale",
      "Key sections are specific enough to draft without major rework",
    ],
    opts
  );
};

