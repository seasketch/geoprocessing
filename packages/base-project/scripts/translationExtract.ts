// Extract translations from project report UI components

import { $ } from "zx";
$.verbose = true;

await $`rm -rf src/i18n/lang/en`;
await $`NODE_ENV=development npx babel 'src/**/*.{ts,tsx}' > /dev/null`;
await $`mv extractedTranslations/en src/i18n/lang/en`;
await $`rm -rf extractedTranslations`;
await $`npx tsx scripts/extractExtraTerms.ts`;
console.log(
  "Translations extracted to src/i18n/lang/en and src/i18n/extraTerms.json",
);
