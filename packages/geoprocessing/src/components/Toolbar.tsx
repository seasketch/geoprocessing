import React, { ReactNode } from "react";
import styled from "styled-components";
import classnames from "classnames";
import "./Toolbar.css";

export interface ToolbarProps {
  children: ReactNode;
  variant?: "regular" | "dense";
  useGutters?: boolean;
  toolbarCls?: string;
}

const Toolbar = ({
  children,
  variant = "regular",
  useGutters = true,
  toolbarCls = "",
  ...otherProps
}: ToolbarProps) => {
  const classes = classnames("gp-toolbar", toolbarCls, {
    "gp-toolbar": true,
    "gp-toolbar-root": true,
    "gp-toolbar-gutter": useGutters,
    "gp-toolbar-regular": variant === "regular",
    "gp-toolbar-dense": variant === "dense",
  });
  console.log("classes", classes);
  return (
    <div className={classes} {...otherProps}>
      {children}
    </div>
  );
};

export default Toolbar;
