import React, { ReactNode } from "react";

export interface ReportChartFigureProps {
  children: ReactNode;
}

/**
 * Chart container styled with spacing for layout in report pages
 */
export const ReportChartFigure: React.FunctionComponent<ReportChartFigureProps> =
  ({ children }) => {
    return <div style={{ margin: "1.75em 0em 2em 0em" }}>{children}</div>;
  };
