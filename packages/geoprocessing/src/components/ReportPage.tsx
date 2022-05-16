import React, { FunctionComponent, ReactNode } from "react";

export interface ReportPageProps {
  hidden: boolean;
  children: ReactNode;
}

export const ReportPage: FunctionComponent<ReportPageProps> = ({
  hidden,
  children,
}) => {
  return <div style={{ display: hidden ? "none" : "block" }}>{children}</div>;
};
