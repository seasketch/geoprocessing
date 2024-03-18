/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    name: "src-unit",
    root: "./src",
    include: [
      "**/components/*.{test,spec}.?(c|m)[jt]s?(x)",
      "**/hooks/*.{test,spec}.?(c|m)[jt]s?(x)",
    ],
    exclude: [...configDefaults.exclude],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest-setup.ts"],
  },
});
