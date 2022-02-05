import React from "react";
import ReportDecorator from "../storybook/ReportDecorator";
import useCheckboxes from "../../hooks/useCheckboxes";
import CheckboxGroup from "./CheckboxGroup";
import { Card } from "../Card";

export default {
  component: CheckboxGroup,
  title: "Components/CheckboxGroup",
  decorators: [ReportDecorator],
};

export const simple = () => {
  const options = [
    { name: "one", checked: false },
    { name: "two", checked: false },
    { name: "three", checked: false },
    { name: "four", checked: false },
  ];
  const checkboxState = useCheckboxes(options);
  // The whole point of using a hook here is we can easily access the state externally and indepdendently of the checkbox UI component
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

/** Demonstrate vertical alignment is maintained */
export const smallText = () => {
  const options = [
    { name: "one", checked: false },
    { name: "two", checked: false },
    { name: "three", checked: false },
    { name: "four", checked: false },
  ];
  const checkboxState = useCheckboxes(options);

  return (
    <Card>
      <div style={{ fontSize: 10 }}>
        <CheckboxGroup {...checkboxState} />
      </div>
    </Card>
  );
};
