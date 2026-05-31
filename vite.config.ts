import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// base "/" works for a custom domain (thelinensolutions.com).
// If you instead host at https://<user>.github.io/thelinensolutions/,
// set VITE_BASE=/thelinensolutions/ when building.
export default defineConfig(() => ({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/firestore", "firebase/storage", "firebase/auth"],
          motion: ["framer-motion"],
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
}));
