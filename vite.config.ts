import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      assets: "./src/assets",
      components: "./src/components",
      constants: "./src/constants",
      pages: "./src/pages",
      types: "./src/types",
      db: "./src/db",
      utils: "./src/utils",
      hooks: "./src/hooks",
    },
  },
  plugins: [react()],
});
