//@ts-nocheck
import React from "react";
import styled from "styled-components";
import BaseTable from "./BaseTable";

const Styles = styled.div`
  table {
    width: 100%;
    border: 1px solid darken(@bg, 10%);
    border-collapse: collapse;

    th {
      text-shadow: 0px 1px 1px white;
      padding-top: 8px;
      padding: 4px;
      border: 1px solid darken(#fafafa, 10%);
      background-color: #fafafa;
      color: #2200cc;
      font-weight: normal;
    }

    tr {
      font-size: 1em;
      text-align: left;
      width: 100%;
      border: 1px solid #f3f3f3;
      padding: 2px 5px;
    }
    td {
      padding-left: 5px;
      text-transform: capitalize;
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;
export interface TableProps {}

export interface TableState {
  columns: Object[];
  data: Object[];
}
class ReportTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.data,
      columns: props.columns,
    };
  }

  render() {
    return (
      <Styles>
        <BaseTable columns={this.state.columns} data={this.state.data} />
      </Styles>
    );
  }
}

export default ReportTable;
