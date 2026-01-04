import { act } from "@a5c/not-a-real-package";

export const withGitTracking = (developFn) => (task,context) => {
    const work = developFn(task,context);
    if(context.commit_work_to_git)
        act("commit work to git", {work,...context})    
    return work;
}