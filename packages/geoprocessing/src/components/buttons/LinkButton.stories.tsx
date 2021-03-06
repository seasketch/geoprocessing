import React from "react";
import SimpleButton from "./SimpleButton";

export default {
  component: SimpleButton,
  title: "Components|Buttons|",
  decorators: [],
};

export const linkButton = () => {
  return (
    <>
      <a href="https://google.com" target="_blank">
        <SimpleButton>⬇</SimpleButton>
      </a>
    </>
  );
};
