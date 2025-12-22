
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
// import a11yPlugin from "eslint-plugin-jsx-a11y";

import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import playwrightPlugin from "eslint-plugin-playwright";

import prettierConfig from "eslint-config-prettier";

export default [
  // --- Ignore only build artifacts, not tests ---
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      ".playwright-cache",
    ],
  },

  // --- Base JS recommended rules ---
  js.configs.recommended,

  // --- Web app (browser + React + TS) ---
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        // Enable if you want type-aware linting (slower). Remove if not needed.
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      // "jsx-a11y": a11yPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    settings: { react: { version: "detect" } },
    rules: {
      // TypeScript & React recommendations
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      // ...a11yPlugin.configs.recommended.rules,

      // React modern JSX
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Your original strict TS preferences
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Import hygiene
      "import/order": [
        "error",
        {
          groups: [["external", "builtin"], "internal", ["sibling", "parent"], "index"],
          pathGroups: [
            { pattern: "@(react)", group: "external", position: "before" },
            { pattern: "@(~app|~shared|~features|~pages|~entities)/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["internal", "react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-cycle": "error",

      // Unused imports/vars
      "unused-imports/no-unused-imports": "warn", // should be error
      "unused-imports/no-unused-vars": "warn", // TODO It should be the commented out bit below
      // "unused-imports/no-unused-vars": [
      //   "warn",
      //   { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      // ],

      // General cleanups / best practices (kept from your config)
      "no-console": ["warn", { allow: ["info", "error"] }],
      "no-debugger": "error",
      "constructor-super": "error",
      "no-this-before-super": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "off",
      "no-useless-rename": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "no-restricted-syntax": ["error", "ForInStatement", "SequenceExpression"],
      "no-caller": "error",
      "no-template-curly-in-string": "error",
      "array-callback-return": "error",
      "no-eval": "error",
      "no-extend-native": "error",
      eqeqeq: ["error", "always"],
      "no-lone-blocks": "error",
      "no-proto": "error",
      "no-redeclare": "warn", // TODO this should be error
      "no-script-url": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-undef-init": "error",
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "no-empty": "error",
      "no-unused-labels": "error",
      "prefer-const": "error",
      "react/display-name": "warn",
      "react/jsx-uses-react": "off",
      "no-case-declarations": "off",
      "no-extra-semi": "off",
      "prefer-destructuring": "off",
      camelcase: "off",
      // Typescript takes care of the undef check
      "no-undef": "off"
    },
  },

  // --- Playwright tests (Node-like env + plugin rules) ---
  {
    files: ["tests/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        // Enable type-aware checks for tests if needed
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
        test: "readonly",
        expect: "readonly",
      },
    },
    plugins: {
      playwright: playwrightPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      ...playwrightPlugin.configs.recommended.rules,
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
      "no-console": "off", // e2e output is fine
    },
  },

  // --- Node/config files (no browser globals) ---
  {
    files: [
      "*.cjs",
      "*.mjs",
      "eslint.config.js",
      "vite.config.{ts,js,mjs,cjs}",
      "webpack.config.{ts,js,mjs,cjs}",
      "playwright.config.{ts,js}",
      "scripts/**/*.{ts,js}",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      parser: tsParser,
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "off",
    },
  },

  // --- Prettier: disable stylistic conflicts (run Prettier separately) ---
  prettierConfig,
];
