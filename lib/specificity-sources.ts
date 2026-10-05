import { source } from "./ai-stack-concept-sources";

export const specificitySources = [
  source("W3C", "Selectors Level 4", "https://www.w3.org/TR/selectors-4/", ["specificity-columns", "specificity-is", "specificity-where"]),
  source("MDN", "Specificity", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity", ["specificity-definition", "specificity-columns", "specificity-order", "specificity-important"]),
  source("MDN", ":where() CSS pseudo-class", "https://developer.mozilla.org/en-US/docs/Web/CSS/:where", ["specificity-where", "specificity-reset"]),
  source("MDN", ":is() CSS pseudo-class", "https://developer.mozilla.org/en-US/docs/Web/CSS/:is", ["specificity-is", "specificity-max"]),
];
