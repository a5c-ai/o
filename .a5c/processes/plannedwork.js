import { plan } from "@a5c/not-a-real-package";
import { testDrivenTask } from "./testdriven.js"
import { spec } from "./spec.js"

export const plannedWork = (context) => {
  const specs = spec(context);
  context.specs = specs;
  const fullPlan = plan({
    goal: context.goal,
    specs: context.specs,
    deliverable: context.deliverable,
    requirements: context.requirements,
    ...context
  });  
  breakpoint("validate plan with user");
  for(const step of fullPlan.plan.steps) {
    const work = testDrivenTask({ task: step.instructions, ...context });
    context.last_work = work;
  }
  return {
    work: context.last_work,    
  };
};

export default plannedWork;
