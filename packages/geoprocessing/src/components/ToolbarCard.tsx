import React, { ReactNode } from "react";
import { SimpleButton } from "./buttons";
import Toolbar from "./Toolbar";

export interface ToolbarCardProps {
  /** Card body elements */
  children: ReactNode;
  /** Parent toolbar style properties */
  toolbarStyle?: object;
  /** Title string or elements for left side */
  leftItems?: string | ReactNode;
  /** Optional style properties for left side */
  leftStyle?: React.CSSProperties;
  /** Toolbar elements for right side */
  rightItems?: string | ReactNode;
  /** Optional style properties for right side */
  rightStyle?: React.CSSProperties;
}

export const ToolbarCard = ({
  children,
  leftItems = <></>,
  rightItems = <></>,
  toolbarStyle,
  leftStyle = {},
  rightStyle = {},
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
    },
    right: {
      display: "flex",
    },
  };

  return (
    <>
      <div
        style={{ position: "relative", ...styles.box, ...(toolbarStyle || {}) }}
      >
        {leftItems && leftItems !== "" && (
          <Toolbar
            titleAlign="center"
            variant="min"
            useGutters={false}
            style={{}}
          >
            <div
              style={{
                ...styles.left,
                ...(leftStyle || {}),
              }}
            >
              {leftItems}
            </div>
            <div
              style={{
                ...styles.right,
                ...(rightStyle || {}),
              }}
            >
              {rightItems}
            </div>
          </Toolbar>
        )}
        {children}
      </div>
    </>
  );
};

export default ToolbarCard;
