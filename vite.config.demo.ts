import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/pixi-easing-graph/",
  build: {
    rollupOptions: {
      output: { dir: "demo" },
    },
  },
  plugins: [react()],
});
