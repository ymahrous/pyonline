import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    EnvironmentPlugin(['DATABASE_URL', 'SESSION_SECRET', 'PGDATABASE', 'PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD']),
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production"? [await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer())]: []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      // "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
