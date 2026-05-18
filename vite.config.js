import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 👈 এই লাইনটি যুক্ত করা হয়েছে, যা রাউটিংয়ের মিম টাইপ এরর দূর করবে
  optimizeDeps: {
    include: ['react-helmet-async']
  },
  resolve: {
    alias: {
      events: "events"
    }
  },
});