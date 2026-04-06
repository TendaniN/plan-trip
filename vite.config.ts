import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/plan-trip/",
  resolve: {
    alias: {
      api: "/src/api",
      assets: "/src/assets",
      components: "/src/components",
      constants: "/src/constants",
      pages: "/src/pages",
      features: "/src/features",
      types: "/src/types",
      db: "/src/db",
      utils: "/src/utils",
      hooks: "/src/hooks",
      layouts: "/src/layouts",

      react: resolve(__dirname, "node_modules", "react"),
      "react-dom": resolve(__dirname, "node_modules", "react-dom"),
    },
  },
  plugins: [react()],
});
