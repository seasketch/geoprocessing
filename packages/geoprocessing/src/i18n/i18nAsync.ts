import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import plurals from "./plurals.json";

const defaultLang = "pt";

/**
 * Returns an instance of i18n that lazy loads translations using dynamic
 * import from passed langPath, defaults to './lang' which gp projects will
 * have by default.  This function will save bandwidth if there
 * are lots of translations and languages to support, but it takes time
 * to load and is more sophisticated, using a webpack magic chunk comment.
 *
 * Each call to this function returns an independent instance allowing
 * for multiple instances of i18n to be used in the same application.
 * Because GP cand GP projects contain a component library with multiple
 * report clients potentially loaded in storybook this is needed.  In
 * production there will typically be only one report client loaded at one time
 * but this allows for the possibility of multiple.  Note that i18nProvider
 * must be used with createInstance to load translations.
 * @param langPath - relative path to language translations from this file
 * @returns i18n instance
 */
export function getI18nInstance(langPath: string = "./lang") {
  const instance = createInstance();
  instance
    .use({
      type: "backend",
      read(
        language: string,
        namespace: string,
        callback: (errorValue: unknown, translations: null | any) => void
      ) {
        import(
          /* webpackChunkName: "lang" */ `${langPath}/${defaultLang}/${namespace}.json`
        )
          .then((resources) => {
            if (defaultLang) {
              callback(null, {
                ...resources,
                ...plurals,
              });
            } else {
              callback(null, resources);
            }
          })
          .catch((error) => {
            callback(error, null);
          });
      },
    })
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      ns: ["gp"],
      debug: true,
      lng: defaultLang,
      fallbackLng: defaultLang,
      cleanCode: true,
      keySeparator: false,
      nsSeparator: ":",
      interpolation: {
        escapeValue: false,
      },
      react: {
        // Using suspense for language content leads to a lot of flashing and
        // re-rendering in unexpected places. It can even lead to weird issues
        // like poorly placed popups as positioning is determined in a suspended
        // state. Just avoiding for now.
        useSuspense: false,
      },
    });

  return instance;
}
