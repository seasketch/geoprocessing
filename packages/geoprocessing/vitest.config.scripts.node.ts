import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
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
