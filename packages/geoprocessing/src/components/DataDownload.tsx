import React, { useEffect, useState } from "react";
import useDropdown from "../hooks/useDropdown";
import SimpleButton from "./buttons/SimpleButton";
import SimpleButtonStyled from "./buttons/SimpleButton";
import styled from "styled-components";

interface DownloadOption {
  label: string;
  extension: string;
  contentType: string;
  /** Object URL aka DOMString with data in final format */
  url: string;
}

interface DataFormatters {
  [key: string]: (data: any) => string;
}

export interface DownloadFileProps {
  /** Name minus extension */
  filename: string;
  /** Raw data to format and allow to download */
  data: any;
}

const DownloadButtonStyled = styled(SimpleButtonStyled)`
  font-size: 12px;
  padding: 5px;
`;

/** Default data formatters */
const formatters: DataFormatters = {
  csv: (data) => data.join("\n"),
  json: (data) => JSON.stringify(data, null, 2),
};

const defaultObjects: DownloadOption[] = [
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
 */
const DataDownload = ({ filename, data }: DownloadFileProps) => {
  const { toggleDropdown, isOpen, Dropdown } = useDropdown({
    width: 100,
  });
  // Default to emptry string
  const [objectUrls, setObjectUrls] = useState<DownloadOption[]>(
    defaultObjects
  );

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
