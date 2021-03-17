import React from "react";
import ReportCardDecorator from "../ReportCardDecorator";
import useCheckboxes from "../../hooks/useCheckboxes";
import CheckboxGroup from "./CheckboxGroup";

export default {
  component: CheckboxGroup,
  title: "Components|CheckboxGroup",
  decorators: [ReportCardDecorator],
};

export const simple = () => {
  const options = [
    { name: "one", checked: false },
    { name: "two", checked: false },
    { name: "three", checked: false },
    { name: "four", checked: false },
  ];
  const checkboxState = useCheckboxes(options);
  console.log("checkbox", checkboxState.checkboxes);
  // The whole point of using a hook is we can easily access the state externally and indepdendently of the checkbox UI component
  return (
    <div>
      <CheckboxGroup {...checkboxState} />
      <div>
        Selected:{" "}
        {checkboxState.checkboxes
          .map((c) => (c.checked ? c.name : ""))
          .join(" ")}
      </div>
    </div>
  );
};
