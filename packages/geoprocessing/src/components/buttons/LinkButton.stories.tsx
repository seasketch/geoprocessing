import React from "react";
import { SimpleButton } from "./SimpleButton.js";

export default {
  component: SimpleButton,
  title: "Components/Buttons/LinkButton",
  decorators: [],
};

export const linkButton = () => {
  return (
    <>
      <a href="https://google.com" target="_blank" rel="noreferrer">
        <SimpleButton>⬇</SimpleButton>
      </a>
    </>
  );
};
