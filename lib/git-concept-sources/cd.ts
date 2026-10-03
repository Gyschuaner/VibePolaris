import { source } from "./shared";

export const cdSources = [
  source("GitHub Docs", "Workflow artifacts", "https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts", ["cd-artifact-output", "cd-share"]),
  source("GitHub Docs", "Deploying with GitHub Actions", "https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments", ["cd-environments", "cd-history"]),
  source("GitHub Docs", "Deployments and environments", "https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments", ["cd-protection"]),
  source("GitHub Docs", "Reviewing deployments", "https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments", ["cd-approval-gate"]),
];
