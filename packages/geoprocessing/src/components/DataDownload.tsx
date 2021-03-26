import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import SimpleButton from "./buttons/SimpleButton";
import SimpleButtonStyled from "./buttons/SimpleButton";
import styled from "styled-components";
import { Parser, transforms } from "json2csv";
import useSketchProperties from "../hooks/useSketchProperties";

// Strictly limit format and data types accepted
const SUPPORTED_FORMATS = ["json", "csv"] as const;
export type SUPPORTED_FORMAT = typeof SUPPORTED_FORMATS[number];
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

export interface DataDownloadProps {
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
}

const DownloadButtonStyled = styled(SimpleButtonStyled)`
  font-size: 12px;
`;

const formatConfigs: DownloadOption[] = [
  {
    label: "Export CSV",
    extension: "csv",
    contentType: "application/csv",
    url: "",
  },
  {
    label: "Export JSON",
    extension: "json",
    contentType: "application/json",
    url: "",
  },
];

/**
 * Dropdown menu for transforming data to CSV/JSON format and initiating a browser download
 * Defaults to CSV and JSON, and filename will include sketch name from ReportContext (if available)
 * and current timestamp
 */
const DataDownload = ({
  filename = "export",
  data,
  formats = ["csv", "json"],
  addSketchName = true,
  addTimestamp = true,
}: DataDownloadProps) => {
  const defaultState: DownloadOption[] = formatConfigs.filter((c) =>
    formats.includes(c.extension)
  );
  const [objectUrls, setObjectUrls] = useState<DownloadOption[]>(defaultState);

  const name = (() => {
    try {
      const [{ name }] = useSketchProperties();
      return name;
    } catch (error) {
      console.info(
        `ReportContext is not available. sketchName not added for "${filename}"`
      );
      return "";
    }
  })();

  const sketchSegment =
    addSketchName && name ? `__${name.replace(/\s/g, "_")}` : "";
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

    const dObjects = objectUrls.map(
      (dOption) => {
        const blob = new Blob([formatters[dOption.extension]()], {
          type: dOption.contentType,
        });
        if (dOption.url != "") window.URL.revokeObjectURL(dOption.url); // clean up last first
        return { ...dOption, url: window.URL.createObjectURL(blob) };
      },
      [data]
    );

    setObjectUrls(dObjects);
  }, [data]);

  const links = objectUrls.map((dOption, index) => (
    <a
      key={index}
      download={`${fullFilename}.${dOption.extension}`}
      href={data && data.length > 0 ? dOption.url : "javascript:;"}
      aria-disabled={!data || data.length === 0}
    >
      <DownloadButtonStyled>➥ {dOption.label}</DownloadButtonStyled>
    </a>
  ));

  return (
    <>
      <Dropdown titleElement={<SimpleButton>⋮</SimpleButton>}>{links}</Dropdown>
    </>
  );
};

export default DataDownload;
