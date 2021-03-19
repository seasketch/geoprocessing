import React from "react";

export interface Props {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  style?: object;
}

const boxStyle = {
  fontFamily: "sans-serif",
  borderRadius: 4,
  backgroundColor: "#fff",
  boxShadow:
    "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
  padding: 16,
  margin: "8px 0px",
};

const titleStyle = {
  fontSize: 14,
  color: "rgba(116, 116, 116, 1)",
  marginBottom: "1em",
  marginTop: 0,
  fontWeight: 400,
};

const Card = ({ children, title, style }: Props) => {
  return (
    <div style={{ position: "relative", ...boxStyle, ...(style || {}) }}>
      {title && title !== "" && <h2 style={titleStyle}>{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
