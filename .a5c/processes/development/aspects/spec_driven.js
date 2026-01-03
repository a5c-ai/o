export const specDrivenDevelopTask = (task,context,developFn) => {
    const specs = developFn(`
        develop or modify specs for this task or change, until they are complete and accurate against the requirements, goals and constraints
        task: ${JSON.stringify(task)}
        context: ${JSON.stringify(context)}
    `,context)
    return developFn(task, {notes:"work should be according to the specs and spec changes", ...context, specs})
}

export const potentiallySpecDrivenDevelopTask = (task,context,developFn) => {
    if(act("determine if the request (task) should change the project specs/docs or not (true or false)", {taskToDevelop: task, ...context}, context)) {
        return specDrivenDevelopTask(task,context, developFn);
    } else {
        return developFn(task, context)
    }
}
export const withSpecDrivenDevelopment = (developFn) => (task,context) => {
    return potentiallySpecDrivenDevelopTask(task,context, developFn);
}