/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    name: "scripts-node",
    root: "./scripts",
    exclude: [...configDefaults.exclude],
    environment: "node",
    globals: true,
    // setupFiles: ["./vitest-setup.ts"],
    globalSetup: ["./vitest-setup-web-server.ts"],
  },
});
