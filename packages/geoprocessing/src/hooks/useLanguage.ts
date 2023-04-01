import { useContext } from "react";
import { ReportContext } from "../context";

/** Hook that returns current language from report context, and provides function to change the language */
export function useLanguage(): [string, (language: string) => void] {
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
  return [context.language, changeLanguage];
}
