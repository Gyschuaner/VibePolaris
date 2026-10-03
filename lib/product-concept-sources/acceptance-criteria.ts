import { source } from "./shared";

export const acceptanceCriteriaSources = [
  source("GOV.UK Service Manual", "Writing user stories", "https://www.gov.uk/service-manual/agile-delivery/writing-user-stories", [
    "acceptance-purpose-detail",
    "acceptance-normal-detail",
  ]),
  source("GOV.UK Technology Blog", "Creating better acceptance criteria for user stories", "https://technology.blog.gov.uk/2015/03/04/creating-better-acceptance-criteria-for-user-stories/", [
    "acceptance-boundary-detail",
    "acceptance-permission-detail",
  ]),
  source("Cucumber", "Gherkin Reference", "https://cucumber.io/docs/gherkin/reference/", [
    "acceptance-shape-detail",
    "acceptance-observable-detail",
    "acceptance-error-detail",
  ]),
  source("GOV.UK Service Manual", "Define what success looks like and publish performance data", "https://www.gov.uk/service-manual/service-standard/point-10-define-success-publish-performance-data", [
    "acceptance-metric-detail",
    "acceptance-regression-detail",
  ]),
];
