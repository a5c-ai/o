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

export const gtmStrategy = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "GTM strategy",
      prompt:
        "Create a practical go-to-market strategy. Output JSON: " +
        "{ \"icp\": {\"who\": string, \"firmographics\": string[], \"constraints\": string[], \"jobs\": string[]}, " +
        "\"segments\": [{\"name\": string, \"whyNow\": string, \"priority\": \"P0\"|\"P1\"|\"P2\"}], " +
        "\"problem\": string, \"alternatives\": string[], " +
        "\"positioning\": {\"category\": string, \"uniqueValue\": string, \"whyUs\": string[]}, " +
        "\"channels\": [{\"channel\": string, \"rationale\": string, \"firstSteps\": string[]}], " +
        "\"motion\": {\"type\": \"PLG\"|\"Sales-led\"|\"Hybrid\", \"salesCycle\": string, \"landExpand\": string}, " +
        "\"funnel\": {\"stages\": string[], \"keyMetrics\": [{\"name\": string, \"definition\": string, \"target\": string}]}, " +
        "\"milestones\": [{\"when\": string, \"outcome\": string, \"ownerRole\": string}], " +
        "\"experiments\": [{\"hypothesis\": string, \"test\": string, \"successCriteria\": string, \"duration\": string}], " +
        "\"risks\": [{\"risk\": string, \"mitigation\": string}] }",
      input,
    },
    ctx,
    [
      "Defines a specific ICP and prioritized segments",
      "Makes explicit channel and motion choices with rationale",
      "Includes measurable funnel metrics, milestones, and experiments",
    ],
    opts
  );
};

export const positioningMessaging = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Positioning and messaging",
      prompt:
        "Create positioning + messaging architecture. Output JSON: " +
        "{ \"positioning_statement\": string, \"category\": string, " +
        "\"value_props\": [{\"title\": string, \"benefit\": string, \"proof\": string}], " +
        "\"key_messages\": [{\"audience\": string, \"message\": string, \"proof_points\": string[]}], " +
        "\"tagline_options\": string[], \"elevator_pitch\": string, " +
        "\"objections\": [{\"objection\": string, \"response\": string}], " +
        "\"do_not_say\": string[] }",
      input,
    },
    ctx,
    [
      "Positioning is differentiated and credible (not hype)",
      "Messages map to audiences and include proof points",
      "Objection handling is grounded and specific",
    ],
    opts
  );
};

export const pricingPackaging = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Pricing and packaging",
      prompt:
        "Propose pricing + packaging with clear assumptions and tradeoffs. Output JSON: " +
        "{ \"pricing_model\": {\"metric\": string, \"why\": string, \"billing\": string}, " +
        "\"tiers\": [{\"name\": string, \"targetCustomer\": string, \"price\": string, \"what_included\": string[], \"limits\": string[]}], " +
        "\"positioning\": {\"good_better_best\": string, \"value_metric\": string}, " +
        "\"discounting\": {\"policy\": string, \"guardrails\": string[]}, " +
        "\"migration\": {\"from\": string, \"to\": string, \"notes\": string}, " +
        "\"tests\": [{\"hypothesis\": string, \"test\": string, \"successCriteria\": string, \"duration\": string}], " +
        "\"risks\": [{\"risk\": string, \"mitigation\": string}] }",
      input,
    },
    ctx,
    [
      "Packaging aligns to ICP needs and value metric",
      "Pricing logic includes assumptions and guardrails (discounting, limits)",
      "Includes tests and risks for validation and iteration",
    ],
    opts
  );
};

export const pipelineModel = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Pipeline model",
      prompt:
        "Define a pipeline model that is operational for sales planning. Output JSON: " +
        "{ \"stages\": [{\"name\": string, \"exit_criteria\": string[], \"ownerRole\": string}], " +
        "\"conversion_assumptions\": [{\"from\": string, \"to\": string, \"rate\": number, \"notes\": string}], " +
        "\"cycle_time_assumptions\": [{\"stage\": string, \"days\": number}], " +
        "\"targets\": [{\"metric\": string, \"target\": string, \"cadence\": string}], " +
        "\"capacity_model\": {\"rep_count\": number, \"quota\": string, \"ramp\": string, \"activity_assumptions\": string[]}, " +
        "\"instrumentation\": [{\"metric\": string, \"definition\": string, \"source\": string}] }",
      input,
    },
    ctx,
    [
      "Stages have unambiguous exit criteria and ownership",
      "Assumptions are explicit and usable for forecasting",
      "Includes instrumentation to measure and adjust the model",
    ],
    opts
  );
};

export const salesPlaybook = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Sales playbook",
      prompt:
        "Create a sales playbook that a new rep can follow. Output JSON: " +
        "{ \"qualification\": {\"framework\": string, \"questions\": string[]}, " +
        "\"discovery\": {\"agenda\": string[], \"questions\": string[], \"red_flags\": string[]}, " +
        "\"demo\": {\"narrative\": string, \"flow\": string[], \"stories\": string[]}, " +
        "\"objection_handling\": [{\"objection\": string, \"response\": string, \"evidence\": string}], " +
        "\"competitors\": [{\"name\": string, \"positioning\": string, \"how_to_win\": string[]}], " +
        "\"follow_up_sequences\": [{\"scenario\": string, \"steps\": string[]}], " +
        "\"assets\": [{\"name\": string, \"purpose\": string}] }",
      input,
    },
    ctx,
    [
      "Provides an end-to-end, stepwise selling motion",
      "Includes practical scripts, questions, and objection handling",
      "Competitive guidance is fair and provides win paths",
    ],
    opts
  );
};

export const enablementPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Enablement plan",
      prompt:
        "Create an enablement plan for internal teams (sales/CS/support/partners). Output JSON: " +
        "{ \"audiences\": [{\"team\": string, \"goals\": string[], \"knowledge_gaps\": string[]}], " +
        "\"assets\": [{\"name\": string, \"ownerRole\": string, \"doneDefinition\": string}], " +
        "\"training\": [{\"session\": string, \"audience\": string, \"duration\": string, \"agenda\": string[], \"homework\": string[]}], " +
        "\"certification\": {\"requirements\": string[], \"evaluation\": string}, " +
        "\"timeline\": [{\"when\": string, \"milestone\": string, \"ownerRole\": string}], " +
        "\"support_readiness\": {\"faq\": string[], \"escalation\": string, \"slo\": string} }",
      input,
    },
    ctx,
    [
      "Specifies assets with owners and clear definitions of done",
      "Training plan is sequenced and audience-specific",
      "Includes support readiness and escalation paths",
    ],
    opts
  );
};

export const launchMessagingPlan = (task, ctx = {}, opts = {}) => {
  const input = normalizeTask(task);
  return gate(
    {
      title: "Launch messaging plan",
      prompt:
        "Create a launch messaging plan with deliverables and timelines. Output JSON: " +
        "{ \"launch_type\": string, \"audiences\": string[], " +
        "\"core_message\": string, \"proof_points\": string[], \"faq\": string[], " +
        "\"deliverables\": [{\"asset\": string, \"ownerRole\": string, \"notes\": string}], " +
        "\"timeline\": [{\"when\": string, \"what\": string, \"ownerRole\": string}], " +
        "\"channels\": [{\"channel\": string, \"content\": string, \"cta\": string}], " +
        "\"internal_comms\": [{\"audience\": string, \"message\": string, \"when\": string}], " +
        "\"measurement\": [{\"metric\": string, \"definition\": string, \"target\": string}] }",
      input,
    },
    ctx,
    [
      "Defines clear core message, proof, and FAQs",
      "Deliverables are owned and scheduled with realistic timing",
      "Includes measurement plan tied to launch goals",
    ],
    opts
  );
};

