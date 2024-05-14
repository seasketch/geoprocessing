import React, { useCallback } from "react";
import { styled } from "styled-components";
import { Checkbox } from "./types.js";

const CheckboxStyled = styled.input`
  margin: 3px 10px;
  cursor: pointer;
`;
const CheckboxLabel = styled.label`
  cursor: pointer;
  display: block;
  font-weight: normal;

  & input {
    vertical-align: middle;
  }

  & .checkbox-label-text {
    vertical-align: middle;
  }
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
export function CheckboxGroup({ checkboxes, setCheckbox }: CheckboxGroupProps) {
  return (
    <div className="checkbox-group">
      {checkboxes.map((checkbox, i) => (
        <CheckboxLabel key={i}>
          <CheckboxStyled
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
          <span className="checkbox-label-text">{checkbox.name}</span>
        </CheckboxLabel>
      ))}
    </div>
  );
}

export default CheckboxGroup;
