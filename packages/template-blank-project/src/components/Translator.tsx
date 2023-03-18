import React, { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { getI18nInstance } from "../i18n/i18nAsync";

// Load translations and pass to react-i18next
const i18nInstance = getI18nInstance("./lang");

/**
 * Child component using react-i18next will have translations loaded
 */
export const Translator: React.FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default Translator;
