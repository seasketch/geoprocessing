import React, { useCallback } from "react";
import styled from "styled-components";
import { Checkbox } from "./types";

const Checkbox = styled.input`
  margin: 0px 10px 0px !important;
  cursor: pointer;
`;
const CheckboxLabel = styled.label`
  cursor: pointer;
  display: block;
  font-weight: normal;
`;

interface CheckboxGroupProps {
  checkboxes: Checkbox[];
  setCheckbox: (index: number, checked: boolean) => void;
}

/**
 * Controlled checkbox group
 * @param param0
 * @returns
 */
export default function CheckboxGroup({
  checkboxes,
  setCheckbox,
}: CheckboxGroupProps) {
  return (
    <>
      {checkboxes.map((checkbox, i) => (
        <CheckboxLabel key={i}>
          <Checkbox
            key={i}
            type="checkbox"
            checked={checkbox.checked}
            onChange={useCallback(
              (e) => {
                setCheckbox(i, e.target.checked);
              },
              [checkboxes]
            )}
          />
          {checkbox.name}
        </CheckboxLabel>
      ))}
    </>
  );
}
