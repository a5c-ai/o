export const dataDrivenDevelopTask = (task,context,developFn) => {
    const data = developFn(`
        gather data for this task to use it to make decisions and work
        task: ${JSON.stringify(task)}
        context: ${JSON.stringify(context)}
    `,context)
    return developFn(task, {notes:"work and decisions should be according to the data", ...context, data})
}

export const potentiallyDataDrivenDevelopTask = (task,context,developFn) => {
    if(act("determine if the request (task) should be based on requried external data and make decisions based on data or not (true or false)", {taskToDevelop: task, ...context}, context)) {
        return dataDrivenDevelopTask(task,context, developFn);
    } else {
        return developFn(task, context)
    }
}