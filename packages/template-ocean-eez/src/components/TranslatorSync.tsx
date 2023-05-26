import React, { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18nSyncInstance } from "../i18n/i18nSync";
import { useLanguage } from "@seasketch/geoprocessing/client-ui";

// Load translations and pass to react-i18next
const i18nInstance = createI18nSyncInstance();

/**
 * Loads translations synchronously and child component using react-i18next will have translations loaded immediately
 *
 */
export const Translator: React.FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [language] = useLanguage();

  // useEffect used to avoid react warning about changing state during render
  // https://github.com/i18next/react-i18next/issues/1124
  useEffect(() => {
    i18nInstance.language !== language && i18nInstance.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default Translator;
