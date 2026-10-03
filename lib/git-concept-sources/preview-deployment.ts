import { source } from "./shared";

export const previewDeploymentSources = [
  source("Vercel", "Environments", "https://vercel.com/docs/deployments/environments", [
    "preview-trigger-event",
    "preview-url-output",
    "preview-isolation",
    "preview-production-boundary",
  ]),
  source("Vercel", "Vercel for GitHub", "https://vercel.com/docs/git/vercel-for-github", [
    "preview-pr-status",
    "preview-fork-security",
  ]),
  source("Netlify", "Deploy Previews", "https://docs.netlify.com/deploy/deploy-types/deploy-previews/", [
    "preview-cleanup",
    "preview-access",
    "preview-isolation",
  ]),
  source("Vercel", "Deployment Protection", "https://vercel.com/docs/deployment-protection", [
    "preview-access",
    "preview-fork-security",
  ]),
];
