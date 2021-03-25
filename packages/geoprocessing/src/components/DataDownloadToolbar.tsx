import React, { ReactNode } from "react";
import styled from "styled-components";
import Toolbar, { ToolbarProps } from "./Toolbar";
import DataDownload, { DataDownloadProps } from "./DataDownload";
import "./DataDownloadToolbar.css";

export interface DataDownloadToolbarProps
  extends DataDownloadProps,
    Omit<ToolbarProps, "toolbarCls" | "children"> {
  title: string;
}

/**
 * Convenience component that creates a Toolbar with Header and DataDownload
 */
const DataDownloadToolbar = ({
  title,
  variant = "dense",
  useGutters = false,
  filename,
  formats,
  data,
}: DataDownloadToolbarProps) => {
  const toolbarProps = { title, variant, useGutters };
  const downloadProps = { filename, formats, data };

  return (
    <Toolbar toolbarCls="gp-data-download-toolbar" {...toolbarProps}>
      {typeof title === "string" ? <h2>{title}</h2> : title}
      <div>
        <DataDownload {...downloadProps} />
      </div>
    </Toolbar>
  );
};

export default DataDownloadToolbar;
