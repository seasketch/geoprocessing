import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  // standalone ignores object required to ignore whole directories
  {
    ignores: [
      "node_modules/**",
      "**/node_modules/**",
      "packages/**/node_modules/**",
      "packages/example-project/**",
      "packages/geoprocessing/dist/**",
      "packages/geoprocessing/data/**",
      "packages/geoprocessing/docs/**",
      "packages/geoprocessing/examples/**",
      "packages/geoprocessing/cdk.out/**",
      "packages/geoprocessing/scripts/__test__/**",
      "**/.story-cache/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      trailingComma: "off",
    },
  },

  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
