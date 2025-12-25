import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  resolve: {
    alias: {
      // Workaround for Vite/Rollup not resolving subpath exports from package.json
      // React 19.2.3 exports "./compiler-runtime" but Vite's resolver doesn't handle it
      // See: https://github.com/vitejs/vite/issues/15412
      "react/compiler-runtime": resolve(
        __dirname,
        "node_modules/react/compiler-runtime.js"
      ),
    },
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
