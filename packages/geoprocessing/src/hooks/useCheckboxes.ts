import React, { useState, useCallback } from "react";
import { Checkbox } from "../components/checkbox/types.js";

/**
 * Hook to maintain checkbox state
 */
export default function useCheckboxes(defaultState: Checkbox[]) {
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>(defaultState);
  const setCheckbox = useCallback(
    (index, checked) => {
      const newCheckboxes = [...checkboxes];
      newCheckboxes[index].checked = checked;
      setCheckboxes(newCheckboxes);
    },
    [checkboxes],
  );
  return {
    setCheckbox,
    checkboxes,
  };
}
