import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if(command === 'serve') {
    return {
      plugins: [react(), eslint()]
    }
  } else if(command === 'build') {
    return {
      plugins: [react()]
    }
  }
})
