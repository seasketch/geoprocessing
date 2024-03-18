/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    name: "src-e2e",
    root: "./src",
    include: ["**/*.test.e2e.?(c|m)[jt]s"],
    exclude: [...configDefaults.exclude],
    environment: "node",
    globals: true,
    setupFiles: ["./vitest-setup.ts"],
  },
});
