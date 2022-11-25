import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if(command === 'serve') {
    return {
      plugins: [react(), eslint()],
      resolve: {
        alias: {
          '~': resolve(__dirname, 'src'),
        },
      }
    }
  } else if(command === 'build') {
    return {
      plugins: [react()],
      resolve: {
        alias: {
          '~': resolve(__dirname, 'src'),
        },
      }
    }
  }
})
