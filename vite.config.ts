import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Production build optimizations
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-toast']
        }
      }
    }
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/apify': {
        target: 'https://api.apify.com/v2',
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api\/apify/, '');
          console.log(`🔄 Proxy rewrite: ${path} -> ${newPath}`);
          return newPath;
        },
        secure: true,
        // Add headers for security
        headers: {
          'X-Forwarded-Proto': 'https'
        },
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📤 Proxying request:', req.method, req.url);
            // Ensure secure headers in development
            proxyReq.setHeader('User-Agent', 'Apify-Actor-Playground/1.0');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Proxy response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
