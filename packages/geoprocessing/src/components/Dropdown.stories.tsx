import React from "react";
import Card from "./Card";
import SimpleButton from "./buttons/SimpleButton";
import Dropdown from "./Dropdown";

export default {
  component: Card,
  title: "Components/Dropdown",
  decorators: [],
};

export const simpleButton = () => {
  return (
    <Dropdown titleElement={<SimpleButton>⋮</SimpleButton>}>
      <a href="https://seasketch.org" target="_blank">
        <SimpleButton>➥ Seasketch</SimpleButton>
      </a>
    </Dropdown>
  );
};
