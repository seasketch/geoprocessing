/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "scripts-e2e",
    root: "./scripts",
    include: ["**/*.test.e2e.?(c|m)[jt]s"],
    exclude: [...configDefaults.exclude],
    environment: "node",
    globals: true,
    // setupFiles: ["./vitest-setup.ts"],
    globalSetup: ["./vitest-setup-web-server.ts"],
  },
});
