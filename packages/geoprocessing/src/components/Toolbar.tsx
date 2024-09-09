import React, { ReactNode } from "react";
import { styled } from "styled-components";
import classnames from "classnames";

export interface ToolbarProps {
  children: ReactNode;
  /** defaults to regular height, dense is smaller height, min is height of toolbar items */
  variant?: "regular" | "dense" | "min";
  useGutters?: boolean;
  toolbarCls?: string;
  titleAlign?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  style?: React.HTMLAttributes<HTMLElement>["style"];
}

export const ToolbarStyled = styled.div`
  &.gp-toolbar {
    display: flex;
    position: relative;
    justify-content: space-between;
  }

  & h2 {
    font-family: sans-serif;
    font-size: 14px;
    color: rgb(116, 116, 116);
    margin: 0px;
    font-weight: 400;
  }

  &.gp-toolbar-gutter {
    padding: 0px 16px 0px 16px;
  }

  &.gp-toolbar-regular {
    min-height: 42px;
  }

  &.gp-toolbar-dense {
    min-height: 30px;
  }
`;

export const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  children,
  variant = "regular",
  useGutters = true,
  toolbarCls = "",
  titleAlign = "baseline",
  style = {},
  ...otherProps
}) => {
  const classes = classnames(
    "gp-toolbar",
    {
      "gp-toolbar-gutter": useGutters,
      "gp-toolbar-regular": variant === "regular",
      "gp-toolbar-dense": variant === "dense",
    },
    toolbarCls,
  );

  return (
    <ToolbarStyled
      className={classes}
      {...otherProps}
      style={{ ...style, alignItems: titleAlign }}
    >
      {children}
    </ToolbarStyled>
  );
};

export default Toolbar;
