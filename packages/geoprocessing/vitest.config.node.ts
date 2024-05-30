import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "node",
    root: ".",
    //include: ["**/*.{test}.?(c|m)[jt]s?(x)"],
    exclude: [
      ...configDefaults.exclude,
      "src/components/**",
      "src/hooks/**",
      "**/GeoprocessingHandler.test.ts",
    ],
    environment: "node",
    globals: true,
    globalSetup: ["./vitest-setup-web-server.ts"],
  },
});
