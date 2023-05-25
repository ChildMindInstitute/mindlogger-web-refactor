import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import { resolve } from 'path'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'


// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if(command === 'serve') {
    return {
      define: {
        global: 'globalThis',
        'process.env': {
          REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY: env.REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY,
        },
      },
      plugins: [react(), eslint(), nodePolyfills()],
      resolve: {
        alias: {
          '~': resolve(__dirname, 'src'),
          Buffer: 'buffer'
        },
      },
    }
  } else if(command === 'build') {
    return {
      define: {
        'process.env': {
          REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY: env.REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY,
        }
      },
      plugins: [react()],
      resolve: {
        alias: {
          '~': resolve(__dirname, 'src'),
        },
      },
    }
  }
})
