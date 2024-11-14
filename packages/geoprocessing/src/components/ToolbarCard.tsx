import React, { ReactNode } from "react";
import Toolbar from "./Toolbar.js";

export interface ToolbarCardProps {
  /** Card body elements */
  children: ReactNode;
  /** Parent toolbar style properties */
  toolbarStyle?: object;
  /** Title string or elements for left side */
  title?: string | ReactNode;
  /** Optional style properties for left side */
  titleStyle?: React.CSSProperties;
  /** Toolbar items for right side  */
  items?: ReactNode;
  /** Optional style properties for items container */
  itemsStyle?: React.CSSProperties;
}

export const ToolbarCard = ({
  children,
  toolbarStyle,
  title = <></>,
  titleStyle = {},
  items = <></>,
  itemsStyle = {},
}: ToolbarCardProps) => {
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
    left: {
      fontSize: "1em",
      fontWeight: 500,
      color: "#6C7282",
      marginBottom: 0,
      marginTop: 0,
      minHeight: 24,
    },
    right: {
      display: "flex",
      alignItems: "center",
    },
  };

  return (
    <div
      style={{ position: "relative", ...styles.box, ...toolbarStyle }}
      role="region"
      aria-label={typeof title === "string" ? title : "Report"}
    >
      {title && title !== "" && (
        <Toolbar titleAlign="center" variant="min" useGutters={false}>
          <h1
            style={{
              ...styles.left,
              ...titleStyle,
            }}
          >
            {title}
          </h1>
          <div
            style={{
              ...styles.right,
              ...itemsStyle,
            }}
            role="toolbar"
            aria-label={
              (typeof title === "string" ? title : "Report") + " toolbar items"
            }
          >
            {items}
          </div>
        </Toolbar>
      )}
      {children}
    </div>
  );
};

export default ToolbarCard;
