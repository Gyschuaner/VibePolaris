import { source } from "./shared";

export const pushSources = [
  source("Git", "git-push Documentation", "https://git-scm.com/docs/git-push", ["push-objects", "push-refspec", "push-fast-forward"]),
  source("Git", "git-receive-pack Documentation", "https://git-scm.com/docs/git-receive-pack", ["push-receive"]),
  source("Git", "git-config Documentation", "https://git-scm.com/docs/git-config", ["push-default"]),
  source("Git", "git-update-ref Documentation", "https://git-scm.com/docs/git-update-ref", ["push-ref"]),
  source("GitHub Docs", "About protected branches", "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches", ["push-protection"]),
];
