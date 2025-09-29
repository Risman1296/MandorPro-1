// Flat ESLint config for MandorPro
// Loads Expo rules and TypeScript plugin, plus a custom local rule.

import expo from 'eslint-config-expo';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';

// Load custom rule implementation
import noDomStyleArrayRule from './eslint-rules/no-dom-style-array.js';

export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    ignores: ['dist/**', 'android/**', 'ios/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        JSX: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'local': {
        rules: {
          'no-dom-style-array': noDomStyleArrayRule,
        },
      },
    },
    rules: {
      ...expo.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'local/no-dom-style-array': 'warn',
    },
  },
];
