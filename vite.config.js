import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/handson-analog-visual-timer/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'no-cache',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            res.setHeader('Cache-Control', 'no-store, max-age=0');
            next();
          });
        };
      },
      transformIndexHtml() {
        return [
          {
            tag: 'meta',
            attrs: { 
              'http-equiv': 'Cache-Control',
              'content': 'no-cache, no-store, must-revalidate'
            },
            injectTo: 'head'
          },
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'Pragma',
              'content': 'no-cache'
            },
            injectTo: 'head'
          },
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'Expires',
              'content': '0'
            },
            injectTo: 'head'
          }
        ];
      }
    }
  ],
})
