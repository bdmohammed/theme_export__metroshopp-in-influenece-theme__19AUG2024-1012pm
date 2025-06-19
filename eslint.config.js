import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import security from "eslint-plugin-security";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import compat from "eslint-plugin-compat";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: [
      "node_modules/**",
      "assets/*.min.js",
      "dist/**",
      "reports/**",
      "coverage/**",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.jquery,
        ...globals.es6,

        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        XMLHttpRequest: "readonly",
        location: "readonly",
        history: "readonly",
        navigator: "readonly",

        // jQuery
        $: "readonly",
        jQuery: "readonly",

        // Shopify globals
        Shopify: "readonly",
        theme: "readonly",
        Cart: "readonly",
        Product: "readonly",
        Collection: "readonly",
        Customer: "readonly",
        Routes: "readonly",

        // Analytics
        ga: "readonly",
        gtag: "readonly",
        fbq: "readonly",
        dataLayer: "readonly",

        // Social media
        FB: "readonly",
        twttr: "readonly",

        // Payment gateways
        PayPal: "readonly",
        Stripe: "readonly",

        // Other common libraries
        Swiper: "readonly",
        AOS: "readonly",
        Flickity: "readonly",
      },
    },
    plugins: {
      sonarjs,
      security,
      prettier,
      compat,
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // Basic rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-undef": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",

      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      semi: ["error", "always"],
      quotes: [
        "error",
        "single",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      "comma-dangle": ["error", "never"],
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "no-multiple-empty-lines": ["error", { max: 2 }],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "prefer-arrow-callback": "error",
      "arrow-spacing": "error",
      "no-useless-return": "error",
      "no-useless-concat": "error",
      "prefer-template": "error",

      // Code quality
      curly: "error",
      eqeqeq: "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-global-assign": "error",
      "no-implicit-coercion": "error",
      "no-script-url": "error",

      // Complexity rules
      "max-lines-per-function": ["warn", 50],
      "max-depth": ["error", 4],
      "max-params": ["error", 5],
      "max-statements": ["warn", 20],
      complexity: ["warn", 10],

      // Browser compatibility
      "no-restricted-syntax": [
        "error",
        {
          selector: 'CallExpression[callee.name="fetch"]',
          message:
            "Use XMLHttpRequest or a polyfill for better browser support",
        },
      ],

      // Performance rules
      "no-loop-func": "error",
      "no-inner-declarations": "error",
      "no-unreachable": "error",
      "no-unused-expressions": "error",
      "no-useless-call": "error",
      "no-useless-escape": "error",
      "no-useless-catch": "error",

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
      "sonarjs/max-switch-cases": ["error", 30],
      "sonarjs/no-all-duplicated-branches": "error",
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-empty-collection": "error",
      "sonarjs/no-extra-arguments": "error",
      "sonarjs/no-gratuitous-expressions": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-identical-expressions": "error",
      "sonarjs/no-ignored-return": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-one-iteration-loop": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-same-line-conditional": "error",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-useless-catch": "error",
      "sonarjs/prefer-object-literal": "error",
      "sonarjs/prefer-while": "error",

      // Security rules
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-eval-with-expression": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-pseudoRandomBytes": "warn",
    },
  },
  prettierConfig, // Disable formatting rules that conflict with Prettier
];
