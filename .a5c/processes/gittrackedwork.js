import { act } from "@a5c/not-a-real-package";

const enabled = process.env.A5C_ENABLE_GIT_TRACKING
export const potentiallyGitTrackedWork = (process_fn,context) => {
    const work = process_fn(context);
    if(enabled || context.commit_work_to_git)
        act("commit work to git", {work,...context})
    // todo tracking of issues and PRs in repo using a5c forge
    return work;
}
