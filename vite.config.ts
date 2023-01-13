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
      },
      server: {
        proxy: {
          "/api": {
               target: 'https://api-dev.cmiml.net/',
               changeOrigin: true,
               secure: false,
               rewrite: (path) => path.replace(/^\/api/, ''),
               ws: true,
               configure: (proxy, options) => {
                console.log(proxy)
                console.log(options)
  
                proxy.on('error', (err, _req, _res) => {
                  console.log('proxy error', err);
                });
                proxy.on('proxyReq', (proxyReq, req, _res) => {
                  console.log('Sending Request to the Target:', req.method, req.url);
                });
                proxy.on('proxyRes', (proxyRes, req, _res) => {
                  console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                });
              },
          }
      }
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
