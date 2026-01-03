export const breakDownTaskIntoSmallerTasks = (task,context) => {
    return act("break down the task into smaller tasks (top down approach)", {taskToBreakDown: task, ...context});
}

// top down approach to development
export const potentiallyTopDownDevelopTask = (task,context, developFn) => {
    // should we break down the task into smaller tasks?
    const shouldBreakDown = determineIfTaskShouldBeBrokenDown(task,context);
    if(shouldBreakDown) {
        // break down the task into smaller tasks
        const smallerTasks = breakDownTaskIntoSmallerTasks(task,context);
        // develop each smaller task
        for(const smallerTask of smallerTasks) {
            potentiallyTopDownDevelopTask(smallerTask,{...context, part_of_task: task}, developFn);
        }
        return context;
    } else {
        // develop the task
        return developFn(task,context, context);
    }
}

export const determineIfTaskShouldBeBrokenDown = (task,context) => {
    return act("determine if the task should be broken down into smaller tasks (yes or no)", context);
}

export const withTopDownDevelopment = (developFn) => (task,context) => {
    return potentiallyTopDownDevelopTask(task,context, developFn);
}