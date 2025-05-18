import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false, // remove all comments
      },
      compress: {
        drop_console: true, // remove all console.* calls
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.error', 'console.warn', 'console.info'], 
      },
    },
  },
})
