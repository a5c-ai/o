import { primitivesFrom, requirePrimitive, defaultDevelop } from "../../../processes/core/primitives.js";
import { runQualityGate } from "../../../processes/core/loops/quality_gate.js";
import { runPlanExecute } from "../../../processes/core/loops/plan_execute.js";

const deckQualityCriteria = [
  "Builds trust fast: clear business narrative, credible claims, and honest constraints",
  "Narrative is instantly clear: problem -> insight -> why now -> wedge -> inevitability",
  "Every slide earns its place; no fluff; partner-level tight",
  "Numbers are consistent across the deck (definitions, time windows, units)",
  "Wedge and ICP are explicit; product/GT-Motion match the ICP",
  "Competition is framed as alternatives; differentiation is concrete and defensible",
  "Moat is stated as a hypothesis with evidence / compounding advantage mechanism",
  "Traction proof points are credible and tied to the why-now",
  "Ask and use of funds are specific and map to milestones",
  "Slide count and timing fit the target (10 minutes, ~12 slides)",
  "If investor comments are provided, every material gap is explicitly closed",
  "Graphics/images reinforce understanding and trust (simple, consistent, no hype)",
];

const gate = ({ task, ctx, threshold = 0.9, maxIters = 5, criteria = deckQualityCriteria }) =>
  runQualityGate({
    task,
    ctx,
    develop: defaultDevelop,
    criteria,
    threshold,
    maxIters,
  });

export const investorDeckProcess = (inputs, ctx = {}) => {
  const { act, breakpoint } = primitivesFrom(ctx);
  requirePrimitive("act", act);

  const hasExistingDeck =
    Boolean(inputs?.materials?.existing_deck?.text?.trim()) ||
    Boolean(inputs?.materials?.existing_deck?.path?.trim());

  const hasInvestorFeedback =
    Array.isArray(inputs?.materials?.past_investor_comments) &&
    inputs.materials.past_investor_comments.some((c) => (c?.comment ?? "").trim().length > 0);

  // Breakpoint 1: ensure we have real startup facts before drafting anything.
  breakpoint?.(
    "Intake: provide/confirm inputs so we can build a high-trust deck (fill inputs.json as needed)",
    {
      required: [
        "company.name",
        "company.one_liner",
        "target.round",
        "product.icp",
        "product.wedge",
        "product.why_now",
        "market.category",
        "traction.current_metrics (even if early, be explicit)",
        "ask.amount + use_of_funds",
      ],
      optional_but_high_value: [
        "materials.summary (if you only have a summary)",
        "materials.existing_deck.text OR materials.existing_deck.path (if you have a draft/full deck)",
        "materials.past_investor_comments (if you have prior feedback)",
        "visuals.brand + visuals.image_generation preferences",
      ],
      questions_to_answer_in_brief: [
        "What is the single sharp insight that makes the problem urgent now (not 5 years ago)?",
        "What is the wedge: the first use case that wins fast and expands?",
        "What do customers switch from today (alternatives) and why do you win?",
        "What is the proof (numbers, logos, pipeline, LOIs, pilots) and definitions/time windows?",
        "What are the top 3 risks and how are you mitigating them?",
      ],
      deliverables_folder: inputs?.deliverables?.folder,
      note:
        "If any field is unknown, set it to 'unknown' and add a question to brief.md so we can close the gap explicitly.",
    },
    { inputs }
  );

  const baseCtx = {
    inputs,
    deliverables: inputs?.deliverables,
    audience: inputs?.target?.audience,
  };

  // Step 0: if there's an existing deck and/or investor feedback, produce a gap-closure plan first.
  if (hasExistingDeck || hasInvestorFeedback) {
    gate({
      task: {
        title: "Audit existing materials and close investor gaps",
        prompt:
          "You may be given anything from a short summary to a full deck draft.\n\n" +
          "Task:\n" +
          "- If inputs.materials.existing_deck.{text|path} is provided, extract the current narrative and slide-by-slide claims.\n" +
          "- If inputs.materials.past_investor_comments is provided, identify the underlying expectation behind each comment.\n" +
          "- Create/update a gap-closure plan that explicitly maps: (comment -> gap -> fix -> where it appears in the new deck).\n\n" +
          "Write/update:\n" +
          `- ${inputs?.deliverables?.gap_closure}\n` +
          `- ${inputs?.deliverables?.sources} (add assumptions + evidence needed)\n\n` +
          "Constraints:\n" +
          "- Be blunt and specific.\n" +
          "- Do not invent facts.\n" +
          "- Prefer 'show' (evidence) over 'tell' (claims).\n",
      },
      ctx: baseCtx,
    });
  }

  // Step 1: create a hard-nosed brief and narrative spine (source of truth).
  gate({
    task: {
      title: "Create investor-deck brief + narrative spine",
      prompt:
        "Create the source-of-truth brief and narrative spine for a Tier 1 VC pitch.\n" +
        "Write/update these files:\n" +
        `- ${inputs?.deliverables?.brief}\n` +
        `- ${inputs?.deliverables?.narrative}\n` +
        (inputs?.deliverables?.gap_closure ? `- ${inputs?.deliverables?.gap_closure} (if investor feedback exists)\n` : "") +
        `- ${inputs?.deliverables?.sources} (list any assumptions + what evidence is needed)\n\n` +
        "Brief must include: one-liner, ICP, problem insight, why now, wedge, product demo narrative, " +
        "business model, traction proof points, competition/alternatives, moat hypothesis, the ask, " +
        "milestones enabled by the raise, and top 10 diligence questions we must be ready to answer.\n\n" +
        "Trust bar:\n" +
        "- Define every metric (numerator/denominator, window, source).\n" +
        "- Separate facts vs assumptions; list evidence to collect.\n" +
        "- Name top risks plainly and show mitigation.\n\n" +
        "Constraints: be concrete; label assumptions; avoid hype words; keep it crisp.",
    },
    ctx: baseCtx,
  });

  // Breakpoint 2: confirm the narrative before building the full deck.
  breakpoint?.(
    "Review narrative/brief for correctness and any missing info (approve or edit inputs + brief.md)",
    { expected_files: [inputs?.deliverables?.brief, inputs?.deliverables?.narrative] },
    baseCtx
  );

  // Plan and execute: outline -> draft -> appendix -> Q&A -> design notes.
  const plan = runPlanExecute({
    task: {
      title: "Build Tier-1 VC investor deck artifacts",
      prompt:
        "Produce an ordered plan as an array of steps. Each step: {\"title\": string, \"task\": string}.\n" +
        "The plan MUST produce these artifacts (update in place if they exist):\n" +
        `- ${inputs?.deliverables?.slides_outline}\n` +
        `- ${inputs?.deliverables?.deck_markdown}\n` +
        `- ${inputs?.deliverables?.appendix}\n` +
        `- ${inputs?.deliverables?.qa_bank}\n` +
        `- ${inputs?.deliverables?.design_notes}\n\n` +
        "AND it MUST create slide visuals:\n" +
        `- ${inputs?.deliverables?.image_manifest} (per-slide visual spec + prompts)\n` +
        `- ${inputs?.deliverables?.assets_dir}/ (generated images/diagrams)\n\n` +
        "Plan guidelines:\n" +
        "- Start from brief.md and narrative.md; do not invent new facts.\n" +
        "- If an existing deck draft exists, improve it; preserve any good parts.\n" +
        "- If investor feedback exists, ensure every material gap is addressed (see gap_closure.md).\n" +
        "- Prefer 'evidence-backed claims' over adjectives.\n" +
        "- Keep slide count near target; move extras into appendix.\n" +
        "- Visuals: choose a consistent style; avoid illegible text in images; diagrams must clarify.\n" +
        "- Visual execution: either (a) generate images via Gen Art 2 into assets_dir, or (b) if generation isn't possible, output ready-to-run prompts in image_manifest.json and clearly mark missing renders.\n" +
        "- Include a checkpoint for user review after outline.json and after deck.md draft.",
    },
    ctx: baseCtx,
    develop: (stepTask, stepCtx) =>
      gate({
        task: {
          title: "Execute deck step",
          prompt:
            "Perform this step for the investor deck. Update artifacts in docs/investor_deck.\n\n" +
            `Step task:\n${stepTask}\n\n` +
            "When producing visuals:\n" +
            "- Write/update image_manifest.json with per-slide prompts, style, and render params.\n" +
            "- Place rendered images in assets_dir with stable names (e.g. slide_03_problem.png).\n" +
            "- Reference images from deck.md (relative paths).\n\n" +
            "Make changes directly in the repo and summarize what changed.\n",
        },
        ctx: stepCtx,
        threshold: 0.9,
        maxIters: 4,
      }),
    checkpoint: true,
    maxSteps: 12,
  });

  // Breakpoint 3: final human approval before sharing externally.
  breakpoint?.(
    "Final review: validate deck flow, numbers consistency, and ask/milestones (make any edits)",
    {
      expected_files: [
        inputs?.deliverables?.deck_markdown,
        inputs?.deliverables?.slides_outline,
        inputs?.deliverables?.appendix,
        inputs?.deliverables?.qa_bank,
        inputs?.deliverables?.design_notes,
        inputs?.deliverables?.image_manifest,
      ],
    },
    { ...baseCtx, plan }
  );

  return { inputs, plan };
};
