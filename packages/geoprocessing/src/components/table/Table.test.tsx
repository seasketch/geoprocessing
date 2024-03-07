import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table, { Column } from "./Table.js";
import fixtures from "../../testing/fixtures/index.js";

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
