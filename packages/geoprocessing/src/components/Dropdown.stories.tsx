import React from "react";
import Card from "./Card.js";
import { SimpleButton } from "./buttons/SimpleButton.js";
import Dropdown from "./Dropdown.js";

export default {
  component: Card,
  title: "Components/Dropdown",
  decorators: [],
};

export const simpleButton = () => {
  return (
    <Dropdown titleElement={<>⋮</>}>
      <a href="https://seasketch.org" target="_blank" rel="noreferrer">
        <SimpleButton>➥ Seasketch</SimpleButton>
      </a>
    </Dropdown>
  );
};
