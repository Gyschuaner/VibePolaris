import { source } from "./shared";

export const rollbackSources = [
  source("Vercel", "Performing an Instant Rollback on a Deployment", "https://vercel.com/docs/instant-rollback", [
    "rollback-incident",
    "rollback-target",
    "rollback-switch",
    "rollback-config",
    "rollback-data",
    "rollback-verify",
  ]),
  source("Kubernetes", "kubectl rollout undo reference", "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands?stream=top", [
    "rollback-target",
    "rollback-history",
    "rollback-revision",
  ]),
  source("Amazon Web Services", "Amazon ECS deployment circuit breaker", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html", [
    "rollback-revision",
    "rollback-auto",
    "rollback-health",
  ]),
  source("GitLab", "Deployments", "https://docs.gitlab.com/ci/environments/deployments/", [
    "rollback-target",
    "rollback-record",
    "rollback-new-deployment",
  ]),
  source("Git", "git-revert Documentation", "https://git-scm.com/docs/git-revert", ["rollback-revert"]),
  source("Git", "git-reset Documentation", "https://git-scm.com/docs/git-reset", ["rollback-reset"]),
];
