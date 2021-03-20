import React, { useEffect, useState } from "react";
import useDropdown from "../hooks/useDropdown";
import SimpleButton from "./buttons/SimpleButton";
import SimpleButtonStyled from "./buttons/SimpleButton";
import styled from "styled-components";
import { parse } from "json2csv";

// Strictly limit format and data types accepted
const SUPPORTED_FORMATS = ["json", "csv"] as const;
export type SUPPORTED_FORMAT = typeof SUPPORTED_FORMATS[number];
export type StringOrNumber = string | number;

export interface DataFormatters {
  [key: string]: (data: StringOrNumber[][]) => string; // Future: figure out index signature to use more specific keyof SUPPORTED_FORMATS
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
  filename: string;
  /** Raw data to format and allow to download */
  data: StringOrNumber[][];
  /** Formats to offer, defaults to csv only */
  formats?: SUPPORTED_FORMAT[];
}

const DownloadButtonStyled = styled(SimpleButtonStyled)`
  font-size: 12px;
  padding: 5px;
`;

const formatters: DataFormatters = {
  csv: (data) => parse(data),
  json: (data) => JSON.stringify(data, null, 2),
};

const formatConfigs: DownloadOption[] = [
  { label: "CSV", extension: "csv", contentType: "application/csv", url: "" },
  {
    label: "JSON",
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
  filename,
  data,
  formats = ["csv"],
}: DownloadFileProps) => {
  const { toggleDropdown, isOpen, Dropdown } = useDropdown({
    width: 100,
  });

  const defaultState: DownloadOption[] = formatConfigs.filter((c) =>
    formats.includes(c.extension)
  );
  const [objectUrls, setObjectUrls] = useState<DownloadOption[]>(defaultState);

  useEffect(() => {
    const dObjects = objectUrls.map((dOption) => {
      const blob = new Blob([formatters[dOption.extension](data)], {
        type: dOption.contentType,
      });
      if (dOption.url != "") window.URL.revokeObjectURL(dOption.url); // clean up last first
      return { ...dOption, url: window.URL.createObjectURL(blob) };
    }, {});

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
