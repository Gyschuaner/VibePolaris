import { source } from "./ai-stack-concept-sources/shared";

export const featureFlagSources = [
  source("Martin Fowler", "Feature Toggles (aka Feature Flags)", "https://martinfowler.com/articles/feature-toggles.html", ["flag-definition", "flag-lifecycle-cost"]),
  source("Microsoft Azure", "Understand feature management using Azure App Configuration", "https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-feature-management", ["flag-release"]),
  source("OpenFeature", "Evaluation Context", "https://openfeature.dev/specification/sections/evaluation-context/", ["flag-context"]),
  source("LaunchDarkly", "Targeting rules", "https://launchdarkly.com/docs/home/flags/target-rules", ["flag-targeting", "flag-rollout-evidence"]),
  source("OpenFeature", "Flag Evaluation API", "https://openfeature.dev/specification/sections/flag-evaluation/", ["flag-evaluation"]),
  source("AWS AppConfig", "Creating a feature flag configuration profile", "https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-feature-flags.html", ["flag-variants"]),
  source("LaunchDarkly", "Kill switch flags", "https://launchdarkly.com/docs/home/flags/killswitch", ["flag-killswitch"]),
];
