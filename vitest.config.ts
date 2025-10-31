import { defineConfig } from 'vitest/config'
import {resolve} from "path";

export default defineConfig({
  test: {
      setupFiles: ['./src/test/vitest.setup.ts'],
      environment: 'jsdom',
      include: ['src/**/*.test.ts', 'src/**/*.test.tsx'], // only include unit/integration tests
      exclude: ['e2e', 'node_modules', 'dist'],           // exclude E2E and build folders
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
    },
})
