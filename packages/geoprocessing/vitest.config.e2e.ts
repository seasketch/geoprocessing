import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "src-e2e",
    root: "./src",
    include: ["**/*.test.e2e.?(c|m)[jt]s"],
    exclude: [...configDefaults.exclude],
    environment: "node",
    globals: true,
    // setupFiles: ["./vitest-setup.ts"],
  },
});
