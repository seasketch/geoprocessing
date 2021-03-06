import React from "react";
import useDropdown from "../hooks/useDropdown";
import Card from "./Card";
import SimpleButton from "./buttons/SimpleButton";

export default {
  component: Card,
  title: "Components|Dropdown",
  decorators: [],
};

export const controlled = () => {
  const { toggleDropdown, isOpen, Dropdown } = useDropdown({
    width: 200,
    height: 400,
  });
  return (
    <>
      <SimpleButton onClick={toggleDropdown}>⋮</SimpleButton>
      {isOpen && <Dropdown>Add children</Dropdown>}
    </>
  );
};
