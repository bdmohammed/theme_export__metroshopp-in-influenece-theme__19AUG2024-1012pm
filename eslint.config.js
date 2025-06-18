import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import security from "eslint-plugin-security";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["assets/**/*.js", "!assets/**/*.min.js", "scripts/**/*.js"],
    env: {
      browser: true,
      es2021: true,
      node: false,
      commonjs: false,
      jquery: true,
      es6: true,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",

        // jQuery
        $: "readonly",
        jQuery: "readonly",

        // Shopify globals
        Shopify: "readonly",
        theme: "readonly",
        Cart: "readonly",
        Product: "readonly",
        Collection: "readonly",

        // Analytics
        ga: "readonly",
        gtag: "readonly",
        fbq: "readonly",
        dataLayer: "readonly",
        FB: "readonly",
        twttr: "readonly",
      },
    },
    plugins: {
      sonarjs,
      security,
      prettier,
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // Basic rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",

      // Code quality
      curly: "error",
      eqeqeq: "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-global-assign": "error",
      "no-implicit-coercion": "error",

      // Modern JavaScript
      "prefer-arrow-callback": "error",
      "arrow-spacing": "error",

      // Formatting
      "no-trailing-spaces": "error",
      semi: ["error", "always"],
      quotes: ["error", "single"],
      indent: ["error", 2],

      // Complexity rules
      "max-lines-per-function": ["warn", 50],
      "max-depth": ["error", 4],
      "max-params": ["error", 5],
      "max-statements": ["warn", 20],
      complexity: ["warn", 10],

      // SonarJS rules
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/no-duplicate-string": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/prefer-immediate-return": "error",
      "sonarjs/no-nested-template-literals": "error",
      "sonarjs/prefer-single-boolean-return": "error",
      "sonarjs/no-small-switch": "error",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-collection-size-mischeck": "error",
      "sonarjs/no-redundant-jump": "error",
      "sonarjs/no-use-of-empty-return-value": "error",

      // Security rules
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-eval-with-expression": "warn",
      "security/detect-possible-timing-attacks": "warn",
    },
  },
  prettierConfig, // Disable formatting rules that conflict with Prettier
  {
    ignores: [
      "node_modules/",
      "assets/**/*.min.js",
      "reports/",
      "**/*.liquid",
      "gulpfile.js",
      "eslint.config.js",
    ],
  },
];
