import { source } from "./ai-stack-concept-sources/shared";

export const cascadeSources = [
  source("W3C", "CSS Cascading and Inheritance Level 6", "https://www.w3.org/TR/css-cascade-6/", [
    "cascade-order", "cascade-importance", "cascade-scope",
  ]),
  source("MDN", "Introduction to the CSS cascade", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction", [
    "cascade-definition", "cascade-sources", "cascade-unlayered",
  ]),
  source("MDN", "Specificity", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity", [
    "cascade-specificity", "cascade-equal", "cascade-scope",
  ]),
  source("MDN", "Cascade layers", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers", [
    "cascade-layer", "cascade-layer-normal", "cascade-layer-important",
  ]),
  source("MDN", "!important CSS keyword", "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/important", [
    "cascade-importance", "cascade-inline", "cascade-user",
  ]),
];
