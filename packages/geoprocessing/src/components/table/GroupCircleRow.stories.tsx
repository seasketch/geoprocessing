import React from "react";
import Card from "../Card.js";
import { GroupCircleRow } from "./GroupCircleRow.js";
import ReportDecorator from "../storybook/ReportDecorator.js";
import { Table, Column } from "./Table.js";
import fixtures, { HumanUse } from "../../testing/fixtures/index.js";
import { capitalize } from "../../helpers/string.js";

export default {
  component: GroupCircleRow,
  title: "Components/Table/GroupCircleRow",
  decorators: [ReportDecorator],
};

const groupColorMap = {
  high: "#BEE4BE",
  med: "#FFE1A3",
  low: "#F7A6B4",
};

export const simple = () => {
  const columns: Column<HumanUse>[] = [
    {
      Header: "Group assignments",
      accessor: (row) => (
        <GroupCircleRow
          group={row.group}
          groupColorMap={groupColorMap}
          circleText={`${capitalize(row.group[0])}`}
          rowText={row.name}
        />
      ),
    },
  ];
  return (
    <Card title="Report Title">
      <Table columns={columns} data={fixtures.humanUse} />
    </Card>
  );
};
