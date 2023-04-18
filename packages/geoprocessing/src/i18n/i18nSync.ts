import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

/** This is primarily used for debugging because it doesn't yet support merging base translations or extraTerms */

import en from "./lang/en/translation.json";
import pt from "./lang/pt/translation.json";

const defaultLang = "en";

/**
 * Returns an instance of i18n with directly imported translations.
 * The benefit of this function is its simplicity but it will
 * include all translations for all languages in the bundle, which
 * could start to get pretty big.
 *
 * Each call to this function returns an independent instance allowing
 * for multiple instances of i18n to be used in the same application.
 * Because GP cand GP projects contain a component library with multiple
 * report clients potentially loaded in storybook this is needed.  In
 * production there will typically be only one report client loaded at one time
 * but this allows for the possibility of multiple.  Note that i18nProvider
 * must be used with createInstance to load translations.
 */
export function createI18nSyncInstance() {
  const instance = createInstance({
    resources: {},
    debug: false,
    fallbackLng: defaultLang,
    interpolation: {
      escapeValue: false, // react is already safe from xss
    },
    lng: defaultLang,
    react: {
      useSuspense: false,
    },
  });

  instance.use(initReactI18next).init();
  instance.addResources("en", "translation", en);
  instance.addResources("pt", "translation", pt);

  return instance;
}
