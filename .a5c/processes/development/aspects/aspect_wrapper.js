export const aspectWrapper = (aspectName,developFn) => (task,context) => {
    const work = developFn(task,context);
    return developFn(`
        ensure and implement ${aspectName} if needed for the task (or close '${aspectName}' related gaps if needed)
        task: ${JSON.stringify(task)}
        context: ${JSON.stringify(context)}
        work: ${JSON.stringify(work)}
    `,context);
}
