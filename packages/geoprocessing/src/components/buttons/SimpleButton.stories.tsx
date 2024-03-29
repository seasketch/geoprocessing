import React from "react";
import { SimpleButton } from "./SimpleButton";

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
