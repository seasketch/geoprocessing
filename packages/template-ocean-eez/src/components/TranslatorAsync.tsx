import React, { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18nAsyncInstance } from "../i18n/i18nAsync.js";
import { useLanguage } from "@seasketch/geoprocessing/client-ui";

// Load translations and pass to react-i18next
const i18nInstance = createI18nAsyncInstance();

/**
 * Loads translations asynchronously using dynamic import abd react-i18next will have translations eventually and update
 * When language changes in context, the i18n instance will be updated and child components will update
 */
export const Translator: React.FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [language] = useLanguage();

  // useEffect used to avoid react warning about changing state during render
  // https://github.com/i18next/react-i18next/issues/1124
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    i18nInstance.language !== language && i18nInstance.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default Translator;
