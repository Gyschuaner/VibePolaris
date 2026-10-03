import { source } from "./shared";

export const pullRequestSources = [
  source("GitHub Docs", "Pull requests", "https://docs.github.com/en/pull-requests/reference/pull-requests", ["pr-proposal", "pr-tabs", "pr-draft", "pr-merge-gate"]),
  source("GitHub Docs", "Creating a pull request", "https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request", ["pr-branches", "pr-updates"]),
  source("GitHub Docs", "Pull request reviews", "https://docs.github.com/en/pull-requests/reference/pull-request-reviews", ["pr-review-decision"]),
  source("GitHub Docs", "About protected branches", "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches", ["pr-protection"]),
  source("Git", "git-push Documentation", "https://git-scm.com/docs/git-push", ["pr-push"]),
];
