import { source } from "./shared";

export const scopeSources = [
  source("GOV.UK Service Manual", "How the discovery phase works", "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works", [
    "scope-goal-detail",
    "scope-exclude-detail",
    "scope-dependency-detail",
    "scope-validation-detail",
  ]),
  source("GOV.UK Service Manual", "Scoping your service", "https://www.gov.uk/service-manual/design/scoping-your-service", [
    "scope-goal-detail",
    "scope-include-detail",
    "scope-exclude-detail",
    "scope-journey-detail",
  ]),
  source("GOV.UK Service Manual", "Solve a whole problem for users", "https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem", [
    "scope-journey-detail",
    "scope-change-detail",
  ]),
  source("GOV.UK Service Manual", "Deciding on priorities", "https://www.gov.uk/service-manual/agile-delivery/deciding-on-priorities", [
    "scope-change-detail",
    "scope-capacity-detail",
    "scope-validation-detail",
  ]),
  source("GOV.UK Service Manual", "How the alpha phase works", "https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works", [
    "scope-neighbor-detail",
  ]),
  source("GOV.UK Service Manual", "Developing a roadmap", "https://www.gov.uk/service-manual/agile-delivery/developing-a-roadmap", [
    "scope-neighbor-detail",
  ]),
];
