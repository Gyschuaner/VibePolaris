import { source } from "./shared";

export const mergeConflictSources = [
  source("Git", "git-merge Documentation", "https://git-scm.com/docs/git-merge", ["conflict-three-way", "conflict-markers", "conflict-stage", "conflict-merge-flow"]),
  source("Git", "git-add Documentation", "https://git-scm.com/docs/git-add", ["conflict-stage", "conflict-stage-result"]),
  source("Git", "git-rebase Documentation", "https://git-scm.com/docs/git-rebase", ["conflict-rebase"]),
  source("Git", "git-cherry-pick Documentation", "https://git-scm.com/docs/git-cherry-pick", ["conflict-cherry-pick"]),
  source("Pro Git", "Advanced Merging", "https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging", ["conflict-context"]),
];
