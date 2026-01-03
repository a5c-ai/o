export const testDrivenTask = (task,context,developFn) => {
    context.testsForTask = developFn(`
        develop tests and runnable quality metrics for this task until there is enough coverage against the specs/requirements/request
        task: ${JSON.stringify(task)}
        context: ${JSON.stringify(context)}
    `,context)
    return developFn(task, {notes:"work should pass tests and runnable quality metrics", ...context, testsForTask: context.testsForTask})
}
export const potentiallyTestDrivenDevelopTask = (task,context,developFn) => {
    // determine if the task should be test driven or not
    if(act("determine if the task should be test driven or not (true or false)", {taskToDevelop: task, ...context}, context)) {
        return testDrivenTask(task,context, developFn);
    } else {
        return developFn(task, context)
    }
}
export const withTestDrivenDevelopment = (developFn) => (task,context) => {
    return potentiallyTestDrivenDevelopTask(task,context, developFn);
}