/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    name: "src",
    root: "./src",
    // include: ["**/*.{test}.?(c|m)[jt]s?(x)"],
    exclude: ["src/components/**"],
    environment: "node",
    globals: true,
  },
});
