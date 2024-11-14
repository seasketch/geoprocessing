import React, { useEffect, useState } from "react";
import Dropdown, { DropdownProps } from "./Dropdown.js";
import { SimpleButtonStyled } from "./SimpleButton.js";
import { styled } from "styled-components";
import { Parser, transforms } from "json2csv";
import useSketchProperties from "../hooks/useSketchProperties.js";
import { ThreeDotsVertical } from "@styled-icons/bootstrap/ThreeDotsVertical/ThreeDotsVertical.esm.js";
import { CloudArrowDown } from "@styled-icons/bootstrap/CloudArrowDown/CloudArrowDown.esm.js";
import { useTranslation } from "react-i18next";

// Strictly limit format and data types accepted
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SUPPORTED_FORMATS = ["json", "csv"] as const;
export type SUPPORTED_FORMAT = (typeof SUPPORTED_FORMATS)[number];
export type StringOrNumber = string | number;

export interface DataFormatters {
  [key: string]: () => string; // Future: figure out index signature to use more specific keyof SUPPORTED_FORMATS https://github.com/microsoft/TypeScript/issues/24220
}

export interface DownloadOption {
  /** File extension for format, also used to uniquely identify each format */
  extension: SUPPORTED_FORMAT;
  /** Label to display for download option */
  label: string;
  /** MIME type of associated with data format */
  contentType: string;
  /** Object blob URL aka DOMString, stores transformed data in format */
  url: string;
}

type DataDownloadDropdownProps = Omit<DropdownProps, "children">;

export interface DataDownloadProps extends DataDownloadDropdownProps {
  /** Name minus extension */
  filename?: string;
  /** Raw data to format and allow to download, nested objects and arrays will get flattened */
  data: object[];
  /** Formats to offer, defaults to csv only */
  formats?: SUPPORTED_FORMAT[];
  /** Add sketch name to filename, default to true */
  addSketchName?: boolean;
  /** Add timestamp to filename, defaults to true */
  addTimestamp?: boolean;
  titleElement?: JSX.Element;
}

const DownloadButtonStyled = styled(SimpleButtonStyled)`
  font-size: 12px;
`;

/**
 * Dropdown menu for transforming data to CSV/JSON format and initiating a browser download
 * Defaults to CSV and JSON, and filename will include sketch name from ReportContext (if available)
 * and current timestamp
 */
export const DataDownload = ({
  filename = "export",
  data,
  formats = ["csv", "json"],
  addSketchName = true,
  addTimestamp = true,
  ...dropdownProps
}: DataDownloadProps) => {
  const { t } = useTranslation();
  const formatConfigs: DownloadOption[] = [
    {
      label: t("DataDownload - export CSV format label", "Export CSV"),
      extension: "csv",
      contentType: "application/csv",
      url: "",
    },
    {
      label: t("DataDownload - export JSON format label", "Export JSON"),
      extension: "json",
      contentType: "application/json",
      url: "",
    },
  ];

  const defaultState: DownloadOption[] = formatConfigs.filter((c) =>
    formats.includes(c.extension),
  );
  const [objectUrls, setObjectUrls] = useState<DownloadOption[]>(defaultState);

  const name = (() => {
    try {
      const [{ name }] = useSketchProperties();
      return name;
    } catch {
      return "";
    }
  })();

  const sketchSegment =
    addSketchName && name ? `__${name.replaceAll(/\s/g, "_")}` : "";
  const timeSegment = addTimestamp
    ? `__${new Date().toISOString().split(".")[0]}Z`
    : "";
  const fullFilename = `${filename}${sketchSegment}${timeSegment}`;

  useEffect(() => {
    if (!data || data.length === 0) return;
    const formatters: DataFormatters = {
      csv: () =>
        new Parser({
          transforms: [transforms.flatten({ arrays: true })], // Flatten nested objects AND arrays
        }).parse(data),
      json: () => JSON.stringify(data, null, 2),
    };

    const dObjects = objectUrls.map((dOption) => {
      const blob = new Blob([formatters[dOption.extension]()], {
        type: dOption.contentType,
      });
      if (dOption.url != "") window.URL.revokeObjectURL(dOption.url); // clean up last first
      return { ...dOption, url: window.URL.createObjectURL(blob) };
    });

    setObjectUrls(dObjects);
  }, [data]);

  const links = objectUrls.map((dOption, index) => (
    <a
      key={index}
      download={`${fullFilename}.${dOption.extension}`}
      href={data && data.length > 0 ? dOption.url : "#"}
      aria-disabled={!data || data.length === 0}
    >
      <DownloadButtonStyled>
        <CloudArrowDown color="#999" size="20" style={{ paddingRight: 5 }} />
        <span style={{ verticalAlign: "middle" }}>{dOption.label}</span>
      </DownloadButtonStyled>
    </a>
  ));

  const dropdownPropsMerged: DataDownloadDropdownProps = {
    titleElement: <ThreeDotsVertical size={18} color="#999" />,
    ...dropdownProps,
  };

  return <Dropdown {...dropdownPropsMerged}>{links}</Dropdown>;
};

export default DataDownload;
