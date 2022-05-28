import React, { ReactNode } from "react";

export interface CardProps {
  title?: string | ReactNode;
  titleStyle?: React.CSSProperties;
  children: ReactNode;
  style?: object;
}

export const Card = ({
  children,
  title,
  style,
  titleStyle = {},
}: CardProps) => {
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
      fontSize: "1em",
      fontWeight: 500,
      color: "#6C7282",
      marginBottom: 0,
      marginTop: 0,
      minHeight: 24,
    },
  };

  return (
    <div style={{ position: "relative", ...styles.box, ...(style || {}) }}>
      {title && title !== "" && (
        <div style={{ ...styles.title, ...(titleStyle || {}) }}>{title}</div>
      )}
      {children}
    </div>
  );
};

export default Card;
