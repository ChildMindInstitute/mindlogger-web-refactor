/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { UserConfig, defineConfig, loadEnv } from 'vite';
import Checker from 'vite-plugin-checker';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
  const env = loadEnv(mode, process.cwd(), '');

  // Error if missing required environment variable
  if (command === 'build') {
    if (!env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY) {
      throw new Error('Missing required environment variable VITE_SECURE_LOCAL_STORAGE_HASH_KEY');
    }
  }

  const baseConfig: UserConfig = {
    optimizeDeps: {
      exclude: ['vite', 'tests/*'],
    },
    define: {
      global: 'globalThis',
      // Pass through environment variable to react-secure-storage
      // https://www.npmjs.com/package/react-secure-storage#how-to-use-with-vite
      'process.env': {
        VITE_SECURE_LOCAL_STORAGE_HASH_KEY: env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY,
      },
    },
    plugins: [react(), nodePolyfills()],
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
        Buffer: 'buffer',
      },
    },
    build: {
      sourcemap: env.VITE_ENV === 'dev',
    },
  };

  if (command === 'serve') {
    baseConfig.plugins.push(
      Checker({
        overlay: false,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
      }),
    );
  }

  return baseConfig;
});
