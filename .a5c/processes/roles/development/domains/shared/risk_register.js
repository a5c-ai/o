export const riskItemTemplate = () => ({
  id: "R1",
  title: "Short risk name",
  description: "What could go wrong and why it matters.",
  probability: "med", // low|med|high
  impact: "med", // low|med|high
  detection: "How we would notice quickly.",
  mitigation: "What we will do to reduce likelihood/impact.",
  owner: "Role or person",
  status: "open", // open|mitigated|accepted
});

export const riskRegisterTemplate = () => ({
  schema: "risk_register/v1",
  scale: {
    probability: ["low", "med", "high"],
    impact: ["low", "med", "high"],
  },
  requiredFields: ["title", "description", "probability", "impact", "mitigation", "detection"],
  risks: [],
});

export const riskRegisterChecklist = () => [
  "List the top 5-10 concrete risks (not vague)",
  "Include at least 1 security risk and 1 reliability risk",
  "Include detection signals (metric/log/alert) for each top risk",
  "Include mitigations that are actionable and testable",
  "Call out any irreducible risks and acceptance rationale",
];

export const RISK_REGISTER_PROMPT = [
  "Create a risk register for the task.",
  "Return short bullets grouped by risk.",
  "Include: title, probability (low/med/high), impact (low/med/high), detection, mitigation.",
  "Prioritize risks that change rollout, observability, or verification strategy.",
].join("\n");

