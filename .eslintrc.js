module.exports = {
  env: {
    es6: true,
    browser: true,
    es2021: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'eslint-plugin-import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        'linebreak-style': ['error', 'unix'],
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
        'prettier/prettier': 'error',
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-console': "warn",
        'no-case-declarations': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'import/order': [
          'error',
          {
            groups: [
              ['external', 'builtin'],
              'internal',
              ['sibling', 'parent'],
              'index',
            ],
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
        ]
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};