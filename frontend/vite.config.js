import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ["react", "react-dom", "scheduler"],
  },

  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },

  server: {
    host: "0.0.0.0",
  },
});