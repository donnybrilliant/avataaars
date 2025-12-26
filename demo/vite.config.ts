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
      enforce: "pre", // Run before Vite's default middleware
      configureServer(server) {
        const docsPath = resolve(__dirname, "..", "docs");

        // Serve docs before Vite's default middleware
        server.middlewares.use((req, res, next) => {
          const url = req.url;

          // Handle asset requests that should be served from /docs/
          // When HTML at /docs/ references assets/main.js, browser requests /assets/main.js
          // We need to intercept and serve from /docs/assets/main.js
          // Also handle /media/, /classes/, /enums/, /functions/, /interfaces/, /modules/, /types/, /variables/
          const docsSubdirs = [
            "assets",
            "media",
            "classes",
            "enums",
            "functions",
            "interfaces",
            "modules",
            "types",
            "variables",
          ];
          for (const subdir of docsSubdirs) {
            if (url?.startsWith(`/${subdir}/`) && !url.startsWith("/docs/")) {
              // Check if this file exists in docs/{subdir}
              const filePath = url.replace(new RegExp(`^/${subdir}/`), "");
              const docsFilePath = join(docsPath, subdir, filePath);

              if (existsSync(docsFilePath) && statSync(docsFilePath).isFile()) {
                const content = readFileSync(docsFilePath);
                const ext = docsFilePath.split(".").pop()?.toLowerCase();

                const contentTypeMap: Record<string, string> = {
                  html: "text/html; charset=utf-8",
                  js: "application/javascript; charset=utf-8",
                  mjs: "application/javascript; charset=utf-8",
                  css: "text/css; charset=utf-8",
                  svg: "image/svg+xml",
                  png: "image/png",
                  jpg: "image/jpeg",
                  jpeg: "image/jpeg",
                  gif: "image/gif",
                  webp: "image/webp",
                  ico: "image/x-icon",
                  json: "application/json",
                  xml: "application/xml",
                  woff: "font/woff",
                  woff2: "font/woff2",
                  ttf: "font/ttf",
                };

                const contentType =
                  contentTypeMap[ext || ""] || "application/octet-stream";
                res.setHeader("Content-Type", contentType);
                res.setHeader("Cache-Control", "public, max-age=0");
                res.statusCode = 200;
                res.end(content);
                return;
              }
            }
          }

          // Handle /docs requests
          if (!url?.startsWith("/docs")) {
            return next();
          }

          // Remove /docs prefix and normalize path
          let relativePath = url.replace(/^\/docs\/?/, "") || "index.html";
          // Remove query string and hash
          relativePath = relativePath.split("?")[0].split("#")[0];
          // Normalize path separators
          relativePath = relativePath.replace(/^\/+/, ""); // Remove leading slashes
          const filePath = join(docsPath, relativePath);

          // Handle directory requests (add index.html)
          let finalPath = filePath;
          try {
            if (existsSync(filePath)) {
              const stat = statSync(filePath);
              if (stat.isDirectory()) {
                finalPath = join(filePath, "index.html");
              }
            }

            if (existsSync(finalPath) && statSync(finalPath).isFile()) {
              const content = readFileSync(finalPath);
              const ext = finalPath.split(".").pop()?.toLowerCase();

              // More comprehensive content type mapping
              const contentTypeMap: Record<string, string> = {
                html: "text/html; charset=utf-8",
                htm: "text/html; charset=utf-8",
                js: "application/javascript; charset=utf-8",
                mjs: "application/javascript; charset=utf-8",
                css: "text/css; charset=utf-8",
                svg: "image/svg+xml",
                png: "image/png",
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                gif: "image/gif",
                webp: "image/webp",
                ico: "image/x-icon",
                json: "application/json",
                xml: "application/xml",
                txt: "text/plain",
                woff: "font/woff",
                woff2: "font/woff2",
                ttf: "font/ttf",
              };

              const contentType =
                contentTypeMap[ext || ""] || "application/octet-stream";

              res.setHeader("Content-Type", contentType);
              res.setHeader("Cache-Control", "public, max-age=0");
              res.statusCode = 200;
              res.end(content);
              return;
            } else {
              // Debug logging for missing files
              console.log(
                `[serve-docs] 404: ${url} -> ${finalPath} (exists: ${existsSync(
                  finalPath
                )})`
              );
            }
          } catch (error) {
            // If there's an error, continue to next middleware
            console.error(
              `[serve-docs] Error serving docs file ${url}:`,
              error
            );
          }

          // If file not found, return 404 or continue
          if (url === "/docs" || url === "/docs/") {
            // Try index.html for root docs path
            const indexPath = join(docsPath, "index.html");
            if (existsSync(indexPath)) {
              const content = readFileSync(indexPath);
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              res.statusCode = 200;
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
