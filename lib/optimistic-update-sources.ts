import { source } from "./ai-stack-concept-sources/shared";

export const optimisticUpdateSources = [
  source("React", "useOptimistic", "https://react.dev/reference/react/useOptimistic", ["optimistic-definition", "optimistic-commit", "optimistic-failure"]),
  source("TanStack Query", "Optimistic Updates", "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates", ["optimistic-rollback", "optimistic-concurrency"]),
  source("Apollo Client", "Optimistic mutation results", "https://www.apollographql.com/docs/react/performance/optimistic-ui", ["optimistic-layer", "optimistic-identity", "optimistic-commit"]),
  source("Redux Toolkit", "Manual Cache Updates", "https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates", ["optimistic-rollback", "optimistic-boundary"]),
];
