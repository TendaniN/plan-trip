import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: "/src/components",
      pages: "/src/pages",
      assets: "/src/assets",
      types: "/src/types",
      constants: "/src/constants",
      utils: "/src/utils",
      hooks: "/src/hooks",
      react: resolve(__dirname, "node_modules", "react"),
      "react-dom": resolve(__dirname, "node_modules", "react-dom"),
    },
  },
  server: {
    strictPort: true,
    host: "localhost",
    port: 3000,
  },
});
