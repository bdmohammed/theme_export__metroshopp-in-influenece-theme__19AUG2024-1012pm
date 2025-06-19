import js from '@eslint/js';
import globals from 'globals';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import compat from 'eslint-plugin-compat';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: [
      'node_modules/**',
      'assets/*.min.js',
      'dist/**',
      'reports/**',
      'coverage/**'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.jquery,
        // Shopify specific globals
        Shopify: 'readonly',
        theme: 'readonly',
        Cart: 'readonly',
        Product: 'readonly',
        Collection: 'readonly',
        Customer: 'readonly',
        Routes: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Common ecommerce globals
        dataLayer: 'readonly',
        gtag: 'readonly',
        fbq: 'readonly',
        // Payment gateways
        PayPal: 'readonly',
        Stripe: 'readonly',
        // Social media
        FB: 'readonly',
        twttr: 'readonly',
        // Other common libraries
        Swiper: 'readonly',
        AOS: 'readonly',
        Flickity: 'readonly'
      }
    },
    plugins: {
      security,
      sonarjs,
      compat,
      prettier
    },
    rules: {
      // ESLint core rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'no-undef': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { 
        avoidEscape: true,
        allowTemplateLiterals: true 
      }],
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-return': 'error',
      'no-useless-concat': 'error',
      'prefer-template': 'error',
      
      // Shopify specific rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      
      // Browser compatibility
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="fetch"]',
          message: 'Use XMLHttpRequest or a polyfill for better browser support'
        }
      ],
      
      // Performance rules
      'no-loop-func': 'error',
      'no-inner-declarations': 'error',
      
      // Security plugin rules
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'warn',
      'security/detect-unsafe-regex': 'error',
      
      // SonarJS rules for code quality
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/max-switch-cases': ['error', 30],
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-collection-size-mischeck': 'error',
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-empty-collection': 'error',
      'sonarjs/no-extra-arguments': 'error',
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-ignored-return': 'error',
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-nested-switch': 'error',
      'sonarjs/no-nested-template-literals': 'error',
      'sonarjs/no-one-iteration-loop': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-same-line-conditional': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-object-literal': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/prefer-while': 'error',
      
      // Prettier integration
      'prettier/prettier': 'error'
    }
  },
  prettierConfig
];