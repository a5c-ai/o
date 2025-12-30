import { act } from "@a5c/not-a-real-package";
import { qualityGatedWork } from './qualitygatedwork.js'
import { potentiallyGitTrackedWork } from './gittrackedwork.js'

export const buildTests = (context) => potentiallyGitTrackedWork(
        ()=>qualityGatedWork(
            (context)=>act("build tests for this task",context),
            context, 
            ["coverage against specs"],
            context.quality_threshold || 0.9)
        ,context
    );

export const testDrivenTask = (context) => {
    let scoreCardAndFeedback = null;    
    let work = null;
    const { work as tests } = buildTests(context);    
    context.tests = tests
    return potentiallyGitTrackedWork(
        ()=>qualityGatedWork(
            (context)=> act("implement work", context),
            context, 
            [
                "passing existing tests (regressions)",
                "passing the new tests from the context",
                "code quality",
                "linting",
                "functionality",
            ], context.quality_threshold || 0.9)
        ,context
    )    
}
