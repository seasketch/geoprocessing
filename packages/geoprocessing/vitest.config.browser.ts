import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import {
  defineConfig as defineVitestConfig,
  configDefaults,
} from "vitest/config";
import react from "@vitejs/plugin-react";

const viteConfig = defineViteConfig({
  plugins: [react()],
});

const vitestConfig = defineVitestConfig({
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
    // setupFiles: ["./vitest-setup.ts"],
  },
});

export default mergeConfig(viteConfig, vitestConfig);
