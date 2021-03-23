import React, { useEffect, useState } from "react";
import useDropdown from "../hooks/useDropdown";
import SimpleButton from "./buttons/SimpleButton";
import SimpleButtonStyled from "./buttons/SimpleButton";
import styled from "styled-components";
import { Parser, transforms } from "json2csv";

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

export interface DownloadFileProps {
  /** Name minus extension */
  filename?: string;
  /** Raw data to format and allow to download, nested objects and arrays will get flattened */
  data: object[];
  /** Formats to offer, defaults to csv only */
  formats?: SUPPORTED_FORMAT[];
}

const DownloadButtonStyled = styled(SimpleButtonStyled)`
  font-size: 12px;
  padding: 5px;
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
 * Defaults to CSV download only
 */
const DataDownload = ({
  filename = "export",
  data,
  formats = ["csv"],
}: DownloadFileProps) => {
  const { toggleDropdown, isOpen, Dropdown } = useDropdown({
    width: 120,
  });

  const defaultState: DownloadOption[] = formatConfigs.filter((c) =>
    formats.includes(c.extension)
  );
  const [objectUrls, setObjectUrls] = useState<DownloadOption[]>(defaultState);

  useEffect(() => {
    const headers = Object.keys(data[0]);
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
      download={`${filename}.${dOption.extension}`}
      href={dOption.url}
    >
      <DownloadButtonStyled>➥ {dOption.label}</DownloadButtonStyled>
    </a>
  ));

  return (
    <>
      <SimpleButton onClick={toggleDropdown}>⋮</SimpleButton>
      {isOpen && <Dropdown>{links}</Dropdown>}
    </>
  );
};

export default DataDownload;
