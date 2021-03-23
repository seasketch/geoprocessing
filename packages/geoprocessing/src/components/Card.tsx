import React, { ReactNode } from "react";

export interface CardProps {
  title?: string | ReactNode;
  children: ReactNode;
  style?: object;
}

const styles = {
  box: {
    fontFamily: "sans-serif",
    borderRadius: 4,
    backgroundColor: "#fff",
    boxShadow:
      "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
    padding: 16,
    margin: "8px 0px",
  },
  title: {
    fontSize: 14,
    color: "rgba(116, 116, 116, 1)",
    marginBottom: "1em",
    marginTop: 0,
    fontWeight: 400,
  },
};

const Card = ({ children, title, style }: CardProps) => {
  return (
    <div style={{ position: "relative", ...styles.box, ...(style || {}) }}>
      {title && title !== "" && <h2 style={styles.title}>{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
