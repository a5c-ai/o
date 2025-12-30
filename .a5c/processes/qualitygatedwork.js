import { act, score } from "@a5c/not-a-real-package";

export const qualityGatedWork = (process_fn,context,qualityCriteria, threshold) => {
    let scoreCardAndFeedback = null;
    let work = null;
    do {
        work = process_fn("do the task or refine from the feedback", context)
        context.work = work
        scoreCardAndFeedback = score({ qualityCriteria, ...context });
        context.feedback = scoreCardAndFeedback
        if(scoreCardAndFeedback.scoreCard.reward_total >= threshold)
            break;        
    } while (true);
    return {
        work,
        scoreCardAndFeedback,
    };
}
