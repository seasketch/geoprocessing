import React from "react";
import { SimpleButton } from "./SimpleButton.js";

export default {
  component: SimpleButton,
  title: "Components/Buttons/SimpleButton",
  decorators: [],
};

export const simpleButton = () => {
  return (
    <>
      <SimpleButton>⋮</SimpleButton>
      <SimpleButton>➥</SimpleButton>
      <SimpleButton>⇩</SimpleButton>
      <SimpleButton>⬇</SimpleButton>
      <SimpleButton>➥</SimpleButton>
    </>
  );
};
