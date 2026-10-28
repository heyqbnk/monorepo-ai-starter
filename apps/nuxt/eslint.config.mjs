// @ts-check
import stylistic from '@stylistic/eslint-plugin';
import compat from 'eslint-plugin-compat';
import esX from 'eslint-plugin-es-x';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';

import withNuxt from './.nuxt/eslint.config.mjs';

/**
 * Code that runs in the browser.
 */
const browserFiles = ['app/**/*.{ts,vue}', 'layers/*/app/**/*.{ts,vue}'];

export default withNuxt(
  {
    files: ['**/*.vue'],
    name: 'app/vue',
    rules: {
      // Component styles are CSS modules only: `<style module="cn">`, never `scoped`.
      'vue/enforce-style-attribute': ['error', { allow: ['module'] }],
      // Not needed with SFC + TypeScript: optional props (`variant?: string`) need no defaults.
      'vue/require-default-prop': 'off',
    },
  },
  {
    ...compat.configs['flat/recommended'],
    // Vite only lowers syntax and polyfills nothing, so APIs missing in the .browserslistrc
    // targets are caught here. This rule checks web APIs (its JS API data is outdated, es-x
    // covers that). A polyfilled API goes to `settings.polyfills`.
    files: browserFiles,
    name: 'app/browser-compat/web-apis',
  },
  {
    ...esX.configs['flat/restrict-to-es2023'],
    // ES2023 is the newest edition fully supported by .browserslistrc (Safari 16.4).
    // To use a newer API, add its polyfill and turn off its rule here.
    files: browserFiles,
    name: 'app/browser-compat/es-apis',
  },
  {
    name: 'app/stylistic',
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/arrow-spacing': ['error', { after: true, before: true }],
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error', { after: true, before: false }],
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/curly-newline': ['error', 'always'],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      '@stylistic/generator-star-spacing': ['error', { after: true, before: false }],
      '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/indent-binary-ops': ['error', 2],
      '@stylistic/key-spacing': ['error', { afterColon: true, beforeColon: false, mode: 'strict' }],
      '@stylistic/keyword-spacing': ['error', { after: true, before: true }],
      '@stylistic/line-comment-position': ['error', { position: 'above' }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/lines-between-class-members': ['error', {
        enforce: [
          { blankLine: 'always', next: 'method', prev: 'field' },
          { blankLine: 'always', next: 'method', prev: 'method' },
        ],
      }],
      '@stylistic/max-len': ['warn', {
        code: 100,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        tabWidth: 2,
      }],
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        multilineDetection: 'brackets',
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      }],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/new-parens': ['error', 'always'],
      '@stylistic/newline-per-chained-call': 'off',
      '@stylistic/no-confusing-arrow': 'error',
      '@stylistic/no-extra-parens': 'off',
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-floating-decimal': 'error',
      '@stylistic/no-mixed-operators': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
      '@stylistic/object-curly-newline': ['error', {
        consistent: true,
        multiline: true,
      }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      '@stylistic/one-var-declaration-per-line': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before', {
        overrides: {
          '=': 'after',
        },
      }],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: '*', prev: 'directive' },
        { blankLine: 'any', next: 'directive', prev: 'directive' },
        { blankLine: 'never', next: '*', prev: ['case', 'default'] },
      ],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/rest-spread-spacing': ['error', 'never'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-spacing': ['error', { after: true, before: false }],
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'never',
        asyncArrow: 'always',
        named: 'never',
      }],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': ['error', { nonwords: false, words: true }],
      '@stylistic/spaced-comment': ['error', 'always', {
        markers: ['#region', '#endregion'],
      }],
      '@stylistic/switch-colon-spacing': ['error', { after: true, before: false }],
      '@stylistic/template-curly-spacing': ['error', 'never'],
      '@stylistic/template-tag-spacing': ['error', 'never'],
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/type-generic-spacing': 'error',
      '@stylistic/type-named-tuple-spacing': 'error',
      '@stylistic/wrap-iife': ['error', 'inside'],
      '@stylistic/yield-star-spacing': ['error', { after: true, before: false }],
    },
  },
  {
    name: 'app/import',
    // The `import` plugin is eslint-plugin-import-x, registered by Nuxt.
    plugins: { unicorn },
    rules: {
      'import/no-empty-named-blocks': 'error',
      'import/no-relative-packages': 'error',
      'import/no-useless-path-segments': 'error',
      'import/order': ['error', {
        alphabetize: {
          caseInsensitive: false,
          order: 'asc',
        },
        groups: [
          ['builtin', 'external'],
          'internal',
          'unknown',
          ['parent', 'sibling', 'index'],
          ['object'],
        ],
        'newlines-between': 'always-and-inside-groups',
        pathGroups: [{ group: 'internal', pattern: '{@,~,#}/**', position: 'after' }],
      }],
      // import-x has no `enforce-node-protocol-usage`.
      'unicorn/prefer-node-protocol': 'error',
    },
  },
  {
    name: 'app/sort-objects',
    plugins: { perfectionist },
    rules: {
      // Object keys go in alphabetical order. A blank line starts a new group sorted on its own,
      // so keys can still be grouped by meaning. Comments move together with their keys.
      'perfectionist/sort-objects': ['error', {
        partitionByNewLine: true,
        type: 'alphabetical',
      }],
    },
  },
);
