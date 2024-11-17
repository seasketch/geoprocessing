import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import extraTerms from "./extraTerms.json" with { type: "json" };
import languages from "./languages.json" with { type: "json" };

const defaultLang = "en";

/**
 * Returns an instance of i18n that lazy loads translations using passed langPath,
 * defaults to './lang' which gp projects will have by default.
 * JSON language modules are bundled using Vite's glob import.
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
  } = {},
) {
  const { langPath = "./lang", baseLangPath = "./baseLang" } = options;
  const instance = createInstance();

  const baseLangModules = import.meta.glob(`./baseLang/*/translation.json`, {
    query: "raw",
  });
  const langModules = import.meta.glob(`./lang/*/translation.json`, {
    query: "raw",
  });

  instance
    .use({
      type: "backend",
      read(
        language: string,
        namespace: string,
        callback: (errorValue: unknown, translations: null | any) => void,
      ) {
        const curLanguage = ((language: string) => {
          // language switcher sends zh when zh-Hans is selected, but we need zh-Hans
          if (language === "zh") return "zh-Hans";

          return languages.find(
            (curLang) => curLang.code.toLowerCase() === language.toLowerCase(),
          )?.code;
        })(language);

        const isDefault =
          language.toLowerCase() === "en" || /en-/i.test(language);

        const langToLoad = isDefault ? defaultLang : curLanguage;

        (async () => {
          // Load translations
          let baseLangResources = {};
          try {
            if (isDefault) {
              // Do not load if default language, let components render strings directly
              baseLangResources = {};
            } else {
              const baseLangToLoadPath = `${baseLangPath}/${langToLoad}/${namespace}.json`;
              const curModule = baseLangModules[baseLangToLoadPath];
              baseLangResources = JSON.parse(
                ((await curModule()) as unknown as any).default,
              );
            }
          } catch {
            console.info(`Warning: failed to find base lang resource.`);
          }
          // console.log("language baseLangResources", baseLangResources);

          let langResources = {};
          if (langPath !== undefined) {
            try {
              if (isDefault) {
                // Do not load if default language, let components render strings directly
                langResources = {};
              } else {
                const langToLoadPath = `${langPath}/${langToLoad}/${namespace}.json`;
                console.log("language langToLoadPath", langToLoadPath);
                const curModule = langModules[langToLoadPath];
                langResources = JSON.parse(
                  ((await curModule()) as unknown as any).default,
                );
              }
            } catch {
              console.info(`Warning: failed to find lang resource.`);
            }
          }
          // console.log("language langResources", langResources);
          // console.log("language extraTerms", extraTerms);

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
