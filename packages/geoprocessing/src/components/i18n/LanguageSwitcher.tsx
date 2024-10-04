import React from "react";
import { useLanguage } from "../../hooks/useLanguage.js";
import languages from "../../i18n/languages.json" with { type: "json" };

export const LanguageSwitcher = () => {
  const [language, changeLanguage] = useLanguage();
  return (
    <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};
