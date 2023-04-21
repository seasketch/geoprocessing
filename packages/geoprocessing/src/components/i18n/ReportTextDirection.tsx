import React, { ReactNode } from "react";
import { useLanguage } from "../../hooks";

/** Controls text direction for report based on current language */
export const ReportTextDirection: React.FunctionComponent<{
  children: ReactNode;
  style?: React.CSSProperties;
}> = ({ style, children }) => {
  const [language, changeLanguage, isRtl] = useLanguage();
  return (
    <div style={style} dir={isRtl ? "rtl" : "ltr"}>
      {children}
    </div>
  );
};
