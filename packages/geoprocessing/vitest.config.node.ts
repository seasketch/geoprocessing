import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "src-node",
    root: "./src",
    //include: ["**/*.{test}.?(c|m)[jt]s?(x)"],
    exclude: [
      ...configDefaults.exclude,
      "components/**",
      "hooks/**",
      "**/GeoprocessingHandler.test.ts",
    ],
    environment: "node",
    globals: true,
    setupFiles: ["./vitest-setup.ts"],
  },
});
