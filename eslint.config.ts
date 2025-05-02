import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import json from 'eslint-plugin-json';
import * as importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import * as mdx from 'eslint-plugin-mdx';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  {
    root: true,
    ignores: [
      'node_modules',
      '**/*',
      'package.json',
      'commitlint.config.ts',
      'eslint.config.ts',
    ],
    plugins: {
      jsdoc,
      import: importPlugin,
      prettier,
      json,
      mdx,
    },
    extends: [
      js.configs.recommended,
      'plugin:json/recommended-legacy',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
      'plugin:mdx/recommended',
    ],
    rules: {
      'import/no-unresolved': 0,
      'import/extensions': 1,
      'import/named': 1,
      'import/namespace': 1,
      'import/default': 1,
      'import/export': 1,
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
        },
      ],
      'jsdoc/require-param': ['warn', { contexts: ['TSParameterProperty'] }],
      'jsdoc/require-param-description': [
        'warn',
        { contexts: ['TSParameterProperty'] },
      ],
      'jsdoc/require-param-name': [
        'warn',
        { contexts: ['TSParameterProperty'] },
      ],
      'jsdoc/require-returns': ['warn', { contexts: ['TSPropertySignature'] }],
      'jsdoc/require-returns-description': [
        'warn',
        { contexts: ['TSPropertySignature'] },
      ],
      'jsdoc/require-returns-type': [
        'warn',
        { contexts: ['TSPropertySignature'] },
      ],
      'jsdoc/require-description': [
        'warn',
        { contexts: ['TSPropertySignature'] },
      ],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          extensions: ['.ts', '.tsx'],
          alwaysTryTypes: true,
          project: ['./apps/hub/tsconfig.json'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
  {
    files: ['*.spec.ts', '*.spec.tsx', '*.spec.js', '*.spec.jsx'],
    env: { jest: true },
  },
];
