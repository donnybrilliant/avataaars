import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, existsSync, statSync } from "fs";
import { resolve, join } from "path";

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    // Plugin to serve docs from /docs path
    {
      name: "serve-docs",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/docs")) {
            const docsPath = resolve(__dirname, "..", "docs");
            // Remove /docs prefix and handle root as index.html
            const relativePath =
              req.url.replace(/^\/docs\/?/, "") || "index.html";
            const filePath = join(docsPath, relativePath);

            // Handle directory requests (add index.html)
            let finalPath = filePath;
            if (existsSync(filePath) && statSync(filePath).isDirectory()) {
              finalPath = join(filePath, "index.html");
            }

            if (existsSync(finalPath) && statSync(finalPath).isFile()) {
              const content = readFileSync(finalPath);
              const ext = finalPath.split(".").pop()?.toLowerCase();
              const contentType =
                ext === "html"
                  ? "text/html; charset=utf-8"
                  : ext === "js"
                  ? "application/javascript; charset=utf-8"
                  : ext === "css"
                  ? "text/css; charset=utf-8"
                  : ext === "svg"
                  ? "image/svg+xml"
                  : ext === "png"
                  ? "image/png"
                  : ext === "jpg" || ext === "jpeg"
                  ? "image/jpeg"
                  : "application/octet-stream";

              res.setHeader("Content-Type", contentType);
              res.end(content);
              return;
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
  server: {
    fs: {
      // Allow serving files from one level up to access docs directory
      allow: [".."],
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
