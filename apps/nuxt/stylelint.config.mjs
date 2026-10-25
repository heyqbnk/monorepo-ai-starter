/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  ignoreFiles: ['.nuxt/**', '.output/**', 'dist/**'],
  // Every disable comment must explain itself: `-- <reason>`.
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    // CSS module class names are short and camelCase: `.root`, `.qrCodeStub`.
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Expected class selector "%s" to be camelCase' },
    ],
    'keyframes-name-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Expected keyframe name "%s" to be camelCase' },
    ],
    'scss/at-mixin-pattern': null,
    'scss/dollar-variable-pattern': null,
    // Keep specificity low: a selector is a single class.
    'selector-max-class': 1,
    'selector-max-compound-selectors': 1,
    'selector-max-id': 0,
    // Only pseudo-classes and pseudo-elements may be nested: `&:hover`, `&::after`.
    'selector-nested-pattern': [
      /^&::?[a-z-]+(\(.*\))?$/,
      { message: 'Expected nested selector "%s" to be a pseudo-class or pseudo-element' },
    ],
    'declaration-no-important': true,
    // Tailwind directives are not used inside component styles.
    'at-rule-disallowed-list': ['apply', 'reference'],
    // Tailwind directives used in global stylesheets.
    'scss/at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['source', 'theme', 'utility', 'variant', 'custom-variant', 'plugin'] },
    ],
  },
  overrides: [
    {
      // Components use token variables instead of raw colors.
      files: ['**/*.vue'],
      rules: {
        'color-named': 'never',
        'color-no-hex': true,
      },
    },
  ],
};
