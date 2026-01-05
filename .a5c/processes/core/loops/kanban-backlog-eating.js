import { primitivesFrom, requirePrimitive } from "../primitives.js";
import { checkpointPlan } from "../checkpoints.js";
import { normalizeTask } from "../task.js";


export const runKanbanBacklogEating = async ({
  task,
  ctx = {},
  develop,
  checkpoint = true,
  planPrompt,
  maxSteps = 20,
  perStepGate,
}) => {
  const primitives = primitivesFrom(ctx);
  const act = primitives.act;
  requirePrimitive("act", act);
  const kanban = primitives.kanban;
  requirePrimitive("kanban", kanban);

  const normalized = normalizeTask(task);

  while(true) {
    const backlogCard = await kanban("get the first card from the backlog tasks (Todo list)", {
      task: normalized,
      ctx,
    });
    if(!backlogCard) break;
    const issueType =o("classify the card (enhancement, bug, feature, change, etc.)")
    const trackingContext = kanban("create tracking context (how to comment, update, etc.) and start updating the relevant kanban boards",{
      task: normalized,
      ctx,
    }); 
    let work = null;
    if(issueType === "enhancement") {
      
      work = await produceEnhancement(backlogCard.title, {
        task: backlogCard.title,
        ctx: {trackingContext, ...ctx},
      });
    } else if(issueType === "bug") {
      work = await produceBugFix(backlogCard.title, {
        task: backlogCard,
        ctx: {trackingContext, ...ctx},
      });
    } else if(issueType === "feature") {
      work = await produceFeature(backlogCard.title, {
        task: backlogCard,
        ctx: {trackingContext, ...ctx},
      });
    } else if(issueType === "change") {
      work = await produceChange(backlogCard.title, {
        task: backlogCard,
        ctx: {trackingContext, ...ctx},
      });
    } else if(issueType === "enhancement") {
      work = await produceEnhancement(backlogCard.title, {
        task: backlogCard.title,
        ctx: {trackingContext, ...ctx},
      });
    } else {
      work = await gatedDevelop(backlogCard.title, {
        task: backlogCard,
        ctx: {trackingContext, ...ctx},
      });
    }
    const trackingEnd = await kanban("update the card with status and details of the work done", {
      task: backlogCard.title,
      ctx: {trackingContext, ...ctx},
      trackingContext,
    });

  }
  return { task: normalized };
};
