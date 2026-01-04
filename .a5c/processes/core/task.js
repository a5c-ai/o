export const normalizeTask = (task) => {
  if (typeof task === "string") {
    return { title: task, prompt: task };
  }

  if (task && typeof task === "object") {
    const title = task.title ?? task.name ?? task.summary ?? "Task";
    const prompt = task.prompt ?? task.description ?? title;
    const acceptance = task.acceptance ?? task.acceptanceCriteria ?? task.done ?? [];
    const risks = task.risks ?? [];
    const artifacts = task.artifacts ?? [];

    return { ...task, title, prompt, acceptance, risks, artifacts };
  }

  return { title: String(task), prompt: String(task) };
};

export const taskToPrompt = (task) => normalizeTask(task).prompt;

export const taskWithAcceptance = (task, acceptance) => ({
  ...normalizeTask(task),
  acceptance: acceptance ?? normalizeTask(task).acceptance,
});

