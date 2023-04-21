import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import extraTerms from "./extraTerms.json";
import languages from "./supported";

const defaultLang = "en";

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
 * @returns i18n instance
 */
export function createI18nAsyncInstance(
  /** i18n language paths relative to this directory */
  options: {
    /** path to main language translations.  If baseLangPath present, then will merge with and override base resources */
    langPath?: string;
    /** path to extra base language translations (for gp projects), which langPath strings merge with and override */
    baseLangPath?: string;
  } = {}
) {
  const { langPath = "./lang", baseLangPath = "./baseLang" } = options;
  const instance = createInstance();
  instance
    .use({
      type: "backend",
      read(
        language: string,
        namespace: string,
        callback: (errorValue: unknown, translations: null | any) => void
      ) {
        const curLanguage = ((language: string) => {
          // language switcher sends zh when zh-Hans is selected, but we need zh-Hans
          if (language === "zh") return "zh-Hans";

          return languages.find(
            (curLang) => curLang.code.toLowerCase() === language.toLowerCase()
          )?.code;
        })(language);

        const isDefault =
          language.toLowerCase() === "en" || /en-/i.test(language);
        (async () => {
          // Load translations
          let baseLangResources = {};
          try {
            baseLangResources = await import(
              /* webpackChunkName: "baseLang" */ `${baseLangPath}/${
                isDefault ? defaultLang : curLanguage
              }/${namespace}.json`
            );
          } catch (error: unknown) {
            console.info(
              `Warning: failed to find base lang resource.  If this is not a gp project, then this is expected.`
            );
          }
          //console.log("baseLangResources", baseLangResources);

          let langResources = {};
          if (langPath !== undefined) {
            langResources = await import(
              /* webpackChunkName: "localLang" */ `${langPath}/${
                isDefault ? defaultLang : curLanguage
              }/${namespace}.json`
            );
          }
          //console.log("langResources", langResources);

          // Return merged translations
          if (defaultLang) {
            // merge in plurals if english, because extractor leaves them blank, so they are managed specially
            callback(null, {
              ...baseLangResources,
              ...langResources,
              ...extraTerms,
            });
          } else {
            callback(null, {
              ...baseLangResources,
              ...langResources,
            });
          }
        })();
      },
    })
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      debug: false,
      lng: defaultLang,
      fallbackLng: defaultLang,
      cleanCode: true,
      keySeparator: false,
      nsSeparator: false,
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
