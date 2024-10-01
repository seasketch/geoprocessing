import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

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
      "packages/*/examples/**",
      "packages/*/examples/**",
      "packages/geoprocessing/cdk.out/**",
      "packages/geoprocessing/scripts/__test__/**",
      "**/.story-cache/**",
    ],
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  eslintPluginUnicorn.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      trailingComma: "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
      "unicorn/prefer-spread": "off",
      "unicorn/no-null": "off",
      "unicorn/no-await-expression-member": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-for-each": "warn",
      "unicorn/explicit-length-check": "off",
      "unicorn/prefer-object-from-entries": "off",
      "unicorn/prefer-logic-operator-over-ternary": "warn",
    },
  },
  {
    extends: ["plugin:storybook/recommended"],
    files: ["**/.stories.{js,jsx,ts,tsx}"],
  },
];
