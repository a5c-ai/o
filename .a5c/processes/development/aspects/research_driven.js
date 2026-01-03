export const researchDrivenDevelopTask = (task,context,developFn) => {
    const research = developFn(`
        research the task and options to understand it better and make decisions and work before developing the task
        task: ${JSON.stringify(task)}
        context: ${JSON.stringify(context)}
    `,context)
    return developFn(task, {notes:"work and decisions should be according to the research", ...context, research})
}

export const potentiallyResearchDrivenDevelopTask = (task,context,developFn) => {
    if(act("determine if the request (task) should be based on research and make decisions based on research and work before developing the task or not (true or false)", {taskToDevelop: task, ...context}, context)) {
        return researchDrivenDevelopTask(task, context, developFn);
    } else {
        return developFn(task, context);
    }
}

export const withResearchBeforeDevelopment = (developFn) => (task,context) => {
    return potentiallyResearchDrivenDevelopTask(task,context, developFn);
}