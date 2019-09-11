import "@testing-library/jest-dom/extend-expect";
import React from "react";
import AreaTab from "./AreaTab";
import { render } from "@testing-library/react";

test("Level of Protection tab renders", () => {
  const { getByText } = render(
    <AreaTab
      serviceResults={{
        area: {
          areaKm: 25123
        }
      }}
    />
  );
  expect(getByText("Zone Size")).toBeInTheDocument();
});
