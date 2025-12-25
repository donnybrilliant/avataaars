import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          "react-vendor": ["react", "react-dom"],
          // react-syntax-highlighter is large, split it out
          "syntax-highlighter": ["react-syntax-highlighter"],
          // gifenc for export functionality
          gifenc: ["gifenc"],
        },
      },
    },
    // Increase chunk size warning threshold (1.25MB is acceptable for a demo)
    chunkSizeWarningLimit: 1000,
  },
});
