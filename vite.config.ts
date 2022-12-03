import pkg from "./package.json";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/guide/build.html#library-mode
// https://dev.to/shashannkbawa/deploying-vite-app-to-github-pages-3ane
export default defineConfig({
  base: "/pixi-easing-graph/",
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: pkg.name,
      fileName: pkg.name,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom", "pixi.js", "@inlet/react-pixi"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDom",
          "pixi.js": "PIXI",
          "@inlet/react-pixi": "ReactPixi",
        },
      },
    },
  },
  plugins: [dts(), react()],
});
