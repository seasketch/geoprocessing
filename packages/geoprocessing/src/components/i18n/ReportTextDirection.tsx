import React, { ReactNode } from "react";
import { useLanguage } from "../../hooks/index.js";

/** Controls text direction for report based on current language */
export const ReportTextDirection: React.FunctionComponent<{
  children: ReactNode;
  style?: React.CSSProperties;
}> = ({ style, children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [language, changeLanguage, isRtl] = useLanguage();
  return (
    <div style={style} dir={isRtl ? "rtl" : "ltr"}>
      {children}
    </div>
  );
};
