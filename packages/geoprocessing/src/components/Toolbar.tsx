import React, { ReactNode, FC } from "react";
import styled from "styled-components";
import classnames from "classnames";

export interface ToolbarProps {
  children: ReactNode;
  variant?: "regular" | "dense";
  useGutters?: boolean;
  toolbarCls?: string;
  titleAlign?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  style?: React.HTMLAttributes<HTMLElement>["style"];
}

export const ToolbarStyled = styled.div`
  &.gp-toolbar {
    display: flex;
    position: relative;
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

const Toolbar = ({
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
    toolbarCls
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
