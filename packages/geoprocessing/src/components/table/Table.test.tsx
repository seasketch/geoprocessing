import { test, expect } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table, { Column } from "./Table.js";
import fixtures from "../../testing/fixtures/index.js";

expect.extend(matchers);

test("Table renders", () => {
  const columns: Column[] = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Count",
      accessor: "count",
    },
  ];
  render(<Table columns={columns} data={fixtures.humanUse} />);
  fixtures.humanUse.forEach(({ name }) => {
    expect(screen.getByText(name)).toBeInTheDocument();
  });
});
