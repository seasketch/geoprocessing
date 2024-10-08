import { useContext } from "react";
import { ReportContext } from "../context/index.js";
import languages from "../i18n/languages.json" with { type: "json" };

/**
 * Hook that returns current language from report context, and provides function to change the language
 * Also include language text direction as third parameter
 */
export function useLanguage(): [string, (language: string) => void, boolean] {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("ReportContext could not be found.");
  }
  /* Change the language in context, which will trigger change in i18n instance */
  function changeLanguage(language: string) {
    if (context && context.changeLanguage) {
      context.changeLanguage(language);
    }
  }
  const curLang =
    languages.find((l) => l.code === context.language) || languages[0];

  return [curLang.code, changeLanguage, curLang.rtl || false];
}
