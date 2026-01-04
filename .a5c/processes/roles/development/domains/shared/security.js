export const securityChecklist = () => [
  "Threat model: entry points, assets, trust boundaries",
  "Authn/authz: enforce least privilege and deny-by-default",
  "Input validation: schema validation and safe parsing",
  "Secrets: do not log secrets; use secret managers where possible",
  "Dependencies: assess high-risk deps and supply chain exposure",
  "Logging: avoid sensitive data; add security-relevant events",
];

export const threatModelTemplate = () => ({
  schema: "threat_model/v1",
  assets: [],
  entryPoints: [],
  trustBoundaries: [],
  threats: [],
  mitigations: [],
});

export const SECURITY_PROMPT = [
  "Identify security risks for the task and proposed mitigations.",
  "Return short bullets grouped by: threat model, mitigations, residual risk.",
].join("\n");

