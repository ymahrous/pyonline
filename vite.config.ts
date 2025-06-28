import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from 'vite-plugin-environment';
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    EnvironmentPlugin(['DATABASE_URL', 'SESSION_SECRET', 'NODE_ENV']),
    // 'PGDATABASE', 'PGHOST', 'PGPORT', 'PGUSER'
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production"? [await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer())]: []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  optimizeDeps: {
    exclude: ["pyodide"],
  }
});
