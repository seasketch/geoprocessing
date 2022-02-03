import React from "react";
import Card from "../Card";
import { GroupCircleRow } from "./GroupCircleRow";
import ReportDecorator from "../storybook/ReportDecorator";
import { Table, Column } from "./Table";
import fixtures, { HumanUse } from "../../testing/fixtures";
import { capitalize } from "../..";

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
