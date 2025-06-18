/** @type {require('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-recommended",
    "stylelint-prettier/recommended"
  ],
  overrides: [
    {
      "files": ["*.css"],
      "rules": {
        "length-zero-no-unit": true,
        "comment-whitespace-inside": "always"
      }
    },
    {
      "files": ["*.liquid", "*.html"],
      "customSyntax": "postcss-html",
      "rules": {
        "no-empty-source": null,
        "no-missing-end-of-source-newline": null,
        "length-zero-no-unit": true
      }
    }
  ],
  rules: {
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "color-no-invalid-hex": true,
    "block-no-empty": true,
    "unit-no-unknown": true,
    "property-no-unknown": [
      true,
      {
        "ignoreProperties": [
          "-webkit-appearance",
          "-moz-appearance",
          "-ms-appearance",
          "-webkit-transform",
          "-moz-transform",
          "-ms-transform",
          "scroll-snap-type",
          "scroll-behavior"
        ]
      }
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        "ignorePseudoElements": [
          "v-deep",
          "-webkit-input-placeholder",
          "-moz-placeholder",
          "-ms-input-placeholder"
        ]
      }
    ],
    "no-duplicate-selectors": true,
    "declaration-block-no-redundant-longhand-properties": true,
    "comment-no-empty": true,
    "at-rule-no-vendor-prefix": true,
    "media-feature-name-no-vendor-prefix": true,
    "property-no-vendor-prefix": [
      true,
      {
        "ignoreProperties": [
          "appearance",
          "transform",
          "transition",
          "animation",
          "user-select"
        ]
      }
    ],
    "selector-no-vendor-prefix": true,
    "value-no-vendor-prefix": [
      true,
      {
        "ignoreValues": [
          "grab",
          "grabbing",
          "pinch-zoom"
        ]
      }
    ],
    "function-url-quotes": "never",
    "max-nesting-depth": 4,
    "selector-max-specificity": "0,4,0",
    "declaration-no-important": true,
    "alpha-value-notation": "number",
    "color-function-notation": "modern",
    "selector-max-type": 3,
    "selector-max-compound-selectors": 4,
    "no-descending-specificity": null,
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer"
        ]
      }
    ],
    "function-no-unknown": [
      true,
      {
        "ignoreFunctions": [
          "theme",
          "screen"
        ]
      }
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ],
  },
  ignoreFiles: [
    "**/node_modules/**",
    "**/*.min.css",
    "**/build/**",
    "**/dist/**",
    "**reports/**",
    "**/*.min.js",
    "**/*.js",
  ],
};
