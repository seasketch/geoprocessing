import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import extraTerms from "./extraTerms.json";
import languages from "./supported.js";

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
            const { default: data } = await import(
              `${baseLangPath}/${
                isDefault ? defaultLang : curLanguage
              }/${namespace}.json`, {
                with: { type: 'json' }
              }
            );
            baseLangResources = data
          } catch (error: unknown) {
            console.info(
              `Warning: failed to find base lang resource.  This is expected if you are loading the core geoprocessing library directly (storybook) instead of a GP project.`
            );
          }
          // console.log("baseLangResources", baseLangResources);

          let langResources = {};
          if (langPath !== undefined) {
            try {
              if (!isDefault) {
                const { default: data } = await import(
                  `${langPath}/${
                    isDefault ? defaultLang : curLanguage
                  }/${namespace}.json`, {
                    with: { type: 'json' }
                  }
                );
                langResources = data
              } else {
                langResources = {}
              }
            } catch (error: unknown) {
              console.info(
                `Warning: failed to find lang resource.`
              );
            }
          }
          // console.log("langResources", langResources);
          // console.log("extraTerms", extraTerms)

          // Return merged translations
          if (isDefault) {
            // merge in extraTerms if english
            callback(null, {
              ...baseLangResources,
              ...langResources,
              ...extraTerms,
            });
          } else {
            // otherwise extra terms should already be translated in langResources
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
