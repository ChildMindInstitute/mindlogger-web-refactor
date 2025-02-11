import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import _import from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['*', '!**/src', '!*.js', '!*.ts'],
  },
  {
    plugins: {
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      '@typescript-eslint': typescriptEslint,
      prettier,
      import: fixupPluginRules(_import),
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },

      parser: tsParser,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:prettier/recommended',
      'prettier',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],

      'react-hooks/rules-of-hooks': 'error',

      'import/order': [
        'error',
        {
          groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],

          pathGroups: [
            {
              pattern: '@(react)',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@(~app|~shared|~features|~pages|~entities)/**',
              group: 'internal',
            },
          ],

          pathGroupsExcludedImportTypes: ['internal', 'react'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'unused-imports/no-unused-imports': 'error',
      'import/no-cycle': 'error',
      'constructor-super': 'error',
      'no-this-before-super': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'off',
      'no-useless-rename': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-restricted-syntax': ['error', 'ForInStatement', 'SequenceExpression'],
      'no-caller': 'error',
      'no-template-curly-in-string': 'error',
      'array-callback-return': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      eqeqeq: ['error', 'always'],
      'no-lone-blocks': 'error',
      'no-proto': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-unused-labels': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      'react/display-name': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': ["warn", { allow: ["info", "error"] }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-extra-semi': 'off',
      'prefer-destructuring': 'off',
      camelcase: 'off',
      'react/prop-types': 'off',
    },
  },
  eslintConfigPrettier,
];
