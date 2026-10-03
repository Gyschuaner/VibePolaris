import { source } from "./shared";

export const useCaseSources = [
  source("Object Management Group", "Unified Modeling Language, Version 2.5.1", "https://www.omg.org/spec/UML/2.5.1/PDF", [
    "use-case-goal-detail",
    "use-case-actor-detail",
    "use-case-structure-detail",
    "use-case-flow-detail",
    "use-case-alternative-detail",
    "use-case-state-detail",
  ]),
  source("GOV.UK Service Manual", "Solve a whole problem for users", "https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem", [
    "use-case-goal-detail",
    "use-case-journey-detail",
  ]),
  source("GOV.UK Service Manual", "Map and understand a user's whole problem", "https://www.gov.uk/service-manual/design/map-a-users-whole-problem", [
    "use-case-journey-detail",
    "use-case-context-detail",
  ]),
  source("GOV.UK Service Manual", "Designing good government services: an introduction", "https://www.gov.uk/service-manual/design/introduction-designing-government-services", [
    "use-case-context-detail",
    "use-case-state-detail",
  ]),
];
