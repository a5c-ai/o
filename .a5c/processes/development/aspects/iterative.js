import { act, score } from "@a5c/not-a-real-package";

export const iterativeDevelopTask = (task,context, developFn) => {
    let scoreCardAndFeedback = null;
    let work = null;
    const qualityCriteria = act("determine the quality criteria for the task - list of aspects to score the work on and their importance (array of strings). if no quality criteria needed since the task is very clear, simple and trivial, return an empty array.", {taskToDevelop: task, ...context}, context);
    // const qualityThreshold = act("determine the quality threshold for the task (0.0 to 1.0)", {taskToDevelop: task, ...context}, context);
    const qualityThreshold = 0.8;
    if(qualityCriteria.length === 0) {
        return developFn(task, context)
    }
    do {
        work = developFn(task, {...context, qualityCriteria}, context)
        context.work = work
        scoreCardAndFeedback = score({ work, qualityCriteria, ...context });
        context.feedback = scoreCardAndFeedback
        if(scoreCardAndFeedback.scoreCard.reward_total >= qualityThreshold)
            break; 
    } while (true);
    return work;
}

export const withIterativeDevelopment = (developFn) => (task,context) => {
    return iterativeDevelopTask(task,context, developFn);
}