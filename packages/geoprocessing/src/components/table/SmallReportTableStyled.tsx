import { styled } from "styled-components";
import { ReportTableStyled } from "./ReportTableStyled.js";

export const SmallReportTableStyled = styled(ReportTableStyled)`
  .styled {
    font-size: 13px;

    td:last-child,
    th:last-child {
      text-align: right;
    }
  }
`;
