import React from "react";
import { SimpleButton } from "./SimpleButton.js";
import Dropdown from "./Dropdown.js";
import ReportDecorator from "./storybook/ReportDecorator.js";
import { ThreeDotsVertical } from "@styled-icons/bootstrap";

export default {
  component: Dropdown,
  title: "Components/Dropdown",
  decorators: [ReportDecorator],
};

export const dropdown = () => {
  return (
    <Dropdown titleElement={<ThreeDotsVertical size={18} color="#999" />}>
      <a href="https://seasketch.org" target="_blank" rel="noreferrer">
        <SimpleButton>➥ Item 1</SimpleButton>
      </a>
      <a href="https://seasketch.org" target="_blank" rel="noreferrer">
        <SimpleButton>➥ Item 2</SimpleButton>
      </a>
    </Dropdown>
  );
};
