import { source } from "./shared";

export const ciSources = [
  source("GitHub Docs", "Building and testing Node.js", "https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs", ["ci-workflow", "ci-build"]),
  source("GitHub Docs", "Workflow syntax for GitHub Actions", "https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax", ["ci-parallel", "ci-jobs"]),
  source("GitHub Docs", "Using workflow run logs", "https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs", ["ci-logs"]),
  source("GitHub Docs", "Status checks", "https://docs.github.com/en/pull-requests/reference/status-checks", ["ci-status"]),
];
