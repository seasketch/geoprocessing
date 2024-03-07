/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    name: "src",
    root: "./src",
    environment: "jsdom",
    globals: true,
  },
});
