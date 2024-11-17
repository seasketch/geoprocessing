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
      "website/**/node_modules/**",
      "website/.docusaurus/**",
      "website/build/**",
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
      "@typescript-eslint/ban-ts-comment": "off",
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
      "unicorn/prefer-array-flat": "warn",
      "unicorn/no-array-push-push": "warn",
      "unicorn/prefer-logical-operator-over-ternary": "warn",
      "unicorn/prefer-add-event-listener": "warn",
      "unicorn/no-object-as-default-parameter": "warn",
      "unicorn/no-array-callback-reference": "warn",
      "unicorn/no-new-array": "warn",
      "unicorn/prefer-string-slice": "warn",
      "unicorn/consistent-function-scoping": "warn",
      "unicorn/no-process-exit": "off",
      "unicorn/prefer-module": "warn",
      "unicorn/no-array-method-this-argument": "warn",
      "unicorn/no-useless-undefined": "warn",
      "unicorn/prefer-string-replace-all": "warn",
    },
  },
];
