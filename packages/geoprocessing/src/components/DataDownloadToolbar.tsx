import React, { ReactNode } from "react";
import { styled } from "styled-components";
import Toolbar, { ToolbarProps } from "./Toolbar.js";
import DataDownload, { DataDownloadProps } from "./DataDownload.js";

export interface DataDownloadToolbarProps
  extends DataDownloadProps,
    Omit<ToolbarProps, "toolbarCls" | "children"> {
  title: string;
}

const DataDownloadToolbarStyled = styled.div`
  & .gp-data-download-toolbar h2 {
    flex-grow: 1;
  }
`;

/**
 * Convenience component that creates a Toolbar with Header and DataDownload
 */
export const DataDownloadToolbar = ({
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
    <DataDownloadToolbarStyled>
      <Toolbar toolbarCls="gp-data-download-toolbar" {...toolbarProps}>
        {typeof title === "string" ? <h2>{title}</h2> : title}
        <div>
          <DataDownload {...downloadProps} />
        </div>
      </Toolbar>
    </DataDownloadToolbarStyled>
  );
};

export default DataDownloadToolbar;
