import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  // Server config
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
