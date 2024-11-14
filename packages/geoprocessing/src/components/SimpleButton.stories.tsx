import React from "react";
import { SimpleButton } from "./SimpleButton.js";

export default {
  component: SimpleButton,
  title: "Components/SimpleButton",
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
      <SimpleButton>Text</SimpleButton>
    </>
  );
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
