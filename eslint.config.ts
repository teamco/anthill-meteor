import jsLint from '@eslint/js';
import tsLint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import json from 'eslint-plugin-json';
import * as importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import * as mdx from 'eslint-plugin-mdx';

export default [
  jsLint.configs.recommended,
  {
    files: [
      'client/**/*.ts',
      'client/**/*.tsx',
      'imports/**/*.ts',
      'imports/**/*.tsx',
      'server/**/*.ts',
    ],
    ignores: ['node_modules', 'package.json', '**/*.config.ts'],
    languageOptions: {
      parser: tsParser,
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      jsdoc,
      import: importPlugin,
      json,
      mdx,
      '@typescript-eslint': tsLint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsLint.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
      // Enforce consistent indentation (4 spaces in this case)
      indent: ['error', 2],
      // Enforce the use of single quotes for strings
      quotes: ['error', 'single'],
      // Enforce semicolons at the end of statements
      semi: ['error', 'always'],
      // Enforce consistent line breaks (LF for Unix)
      'linebreak-style': ['error', 'unix'],
      // Require the use of === and !== (no implicit type conversions)
      eqeqeq: ['error', 'always'],
      // Enforce a maximum line length (usually 80 or 100 characters)
      'max-len': ['warn', { code: 80 }],
      // Enable Prettier as a lint rule
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          singleQuote: true,
          semi: true,
        },
      ],
      'import/no-unresolved': 0,
      'import/extensions': 1,
      'import/named': 1,
      'import/namespace': 1,
      'import/default': 1,
      'import/export': 1,
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
  },
];
