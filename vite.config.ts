import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000",
        changeOrigin: true,
        secure: false,
        // Keep the same path (/api/v1/chat -> /api/v1/chat)
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.error("Proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("➡️ Sending Request to Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("⬅️ Received Response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
