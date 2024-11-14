import React, { ReactNode } from "react";

export interface KeySectionProps {
  children: ReactNode;
  style?: object;
}

const keyStyle = {
  padding: 10,
  marginBottom: 10,
  borderRadus: 4,
  backgroundColor: "#efefef",
  boxShadow:
    "rgb(0 0 0 / 20%) 0px 1px 3px 0px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px",
};

export const KeySection = ({ children, style }: KeySectionProps) => {
  return (
    <div style={{ ...keyStyle, ...style }} aria-label="Key section">
      {children}
    </div>
  );
};
