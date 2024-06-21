/// <reference types="vitest" />
/// <reference types="vite/client" />

import { UserConfig, defineConfig, loadEnv } from 'vite';
import AllureReporter from "allure-vitest";
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { resolve } from 'path';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
  const env = loadEnv(mode, process.cwd(), '');

  const baseConfig: UserConfig = {
    define: {
      global: 'globalThis',
      'process.env': {
        REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY: env.REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY,
      },
    },
    plugins: [react(), nodePolyfills()],
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
        Buffer: 'buffer',
      },
    },
    test: {
      setupFiles: ['./src/test/vitest.setup.ts'],
      environment: 'jsdom',
      server: {
        deps: {
          inline: ['vitest-canvas-mock'],
        },
      },
      globals: true,
      css: true,
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
      alias: {
        '~': resolve(__dirname, 'src'),
        Buffer: 'buffer',
      },
      reporters: [
      // do not forget to keep the "default" if you want to see something in the console
      "default",
      new AllureReporter({
        links: [
          {
            type: "issue",
            urlTemplate: "https://example.org/issue/%s",
          },
          {
            type: "tms",
            urlTemplate: "https://example.org/task/%s",
          },
        ],
        resultsDir: "./allure-results",
      }),
    ],
    },
  };

  if (command === 'serve') {
    baseConfig.plugins = [react(), eslint(), nodePolyfills()];

    return baseConfig;
  } else if (command === 'build') {
    baseConfig.plugins = [react(), nodePolyfills()];

    return baseConfig;
  } else {
    return baseConfig;
  }
});
