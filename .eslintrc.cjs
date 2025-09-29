/* ESLint configuration for MandorPro */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['expo', 'plugin:@typescript-eslint/recommended'],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  ignorePatterns: ['dist/', 'android/', 'ios/'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: undefined,
  },
  rules: {
    // Keep arrays out of DOM style props for RNW compatibility
    'no-dom-style-array': 'warn',
  },
  settings: {},
};
