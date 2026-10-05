import { source } from "./ai-stack-concept-sources/shared";

export const visualRegressionTestingSources = [
  source("Playwright", "Visual comparisons", "https://playwright.dev/docs/test-snapshots", ["vrt-definition", "vrt-threshold"]),
  source("Storybook", "Visual testing", "https://storybook.js.org/docs/writing-tests/visual-testing", ["vrt-workflow", "vrt-review"]),
  source("WebdriverIO", "Visual testing", "https://webdriver.io/docs/visual-testing/", ["vrt-definition", "vrt-review"]),
  source("MDN", "Window devicePixelRatio", "https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio", ["vrt-environment"]),
  source("Chromatic", "Visual tests", "https://www.chromatic.com/docs/", ["vrt-workflow", "vrt-review"]),
];
