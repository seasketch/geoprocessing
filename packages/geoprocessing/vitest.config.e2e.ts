import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "e2e",
    root: ".",
    include: ["**/*.test.e2e.?(c|m)[jt]s"],
    exclude: [...configDefaults.exclude],
    environment: "node",
    globals: true,
    globalSetup: ["./vitest-setup-web-server.ts"],
  },
});
