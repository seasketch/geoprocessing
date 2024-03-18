/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
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
