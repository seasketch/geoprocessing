import React, { CSSProperties, ReactNode, useState } from "react";
import {
  ReportContext,
  ReportContextValue,
  sampleSketchReportContextValue,
} from "../../context/index.js";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher.js";
import { ReportTextDirection } from "../i18n/ReportTextDirection.js";

const containerStyle = {
  height: "auto",
  border: "1px solid rgba(0,0,0,0.12)",
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: 2,
  position: "relative",
} as CSSProperties;

const styles = {
  backgroundColor: "#efefef",
  padding: 8,
  margin: 0,
  boxSizing: "border-box",
  boxShadow:
    "0px 0px 0px transparent, 0px 4px 4px 0px rgba(0, 0, 0, 0.06) inset, 0px 0px 0px transparent, 0px 0px 0px transparent",
} as CSSProperties;

const headerStyle = {
  fontFamily: "sans-serif",
  padding: 10,
  backgroundColor: "#f5f5f5",
  zIndex: 2,
  borderBottom: "1px solid rgba(0,0,0,0.13)",
};

export interface ReportStoryLayoutProps {
  children: ReactNode;
  /** Optional ReportContext partial to merge */
  value?: Partial<ReportContextValue>;
}

/**
 * Wraps a story to look and behave like a sketch report
 * It also replicates much of the functionality of App.tx like setting text
 * direction and loading ReportContext.
 * The context value can be added to or overridden by passing a value prop
 * Layout includes a language switcher (connected to the report context)
 * and a report width selector
 * The caller must wrap the story in a Translator component to provide translations
 */
export const ReportStoryLayout: React.FunctionComponent<
  ReportStoryLayoutProps
> = ({ value = {}, children }) => {
  const [width, setWidth] = useState(500);

  const defaultContext = sampleSketchReportContextValue({
    changeLanguage: (language: string) => {
      setReportContext((prev) => {
        const wasChanged = prev.language !== language;
        return {
          ...prev,
          language: wasChanged ? language : prev.language,
        };
      });
    },
    ...value,
  });

  // Report context source of truth
  const [reportContext, setReportContext] =
    useState<ReportContextValue>(defaultContext);

  return (
    <ReportContext.Provider value={{ ...reportContext }}>
      <div style={{ width, ...containerStyle }}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: 18, fontWeight: 500 }}>Sketch Name</h1>
        </div>
        <ReportTextDirection style={{ ...styles, width }}>
          {children}
        </ReportTextDirection>
        <div
          className="storyControls"
          style={{
            position: "absolute",
            bottom: -30,
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
          }}
        >
          <LanguageSwitcher />
          <select
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          >
            <option value={500}>Desktop - Standard Size</option>
            <option value={800}>Desktop - Large</option>
            <option value={320}>iPhone 5</option>
            <option value={375}>iPhone 6, iPhone X</option>
            <option value={414}>iPhone 6 Plus, iPhone 8 Plus, iPhone XR</option>
            <option value={360}>Galaxy S5</option>
            <option value={412}>Nexus 5x</option>
            <option value={540}>Pixel</option>
          </select>
        </div>
      </div>
    </ReportContext.Provider>
  );
};
