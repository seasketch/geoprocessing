import React from "react";
import {
  iucnActivities,
  activityRanks,
  iucnActivityCategories,
  iucnCategoriesList,
  fullColor,
  highColor,
} from "../../iucn";
import styled from "styled-components";

const MatrixStyled = styled.div`
  td,
  th {
    padding: 5px 6px;
  }
  tr > :nth-child(n + 2) {
    text-align: center;
  }
  td {
    border: 1px solid #999;
  }
  table {
    border-collapse: collapse;
  }

  .full {
    background-color: ${fullColor};
  }

  .high {
    background-color: ${highColor};
  }

  .yes,
  .yesbut,
  .variable {
    background-color: #ddd;
  }
`;

export const IucnMatrix = () => {
  return (
    <MatrixStyled>
      <table>
        <thead>
          <tr>
            <th></th>
            <th className="full" colSpan={4}>
              Full
            </th>
            <th className="high" colSpan={3}>
              High
            </th>
          </tr>
          <tr>
            <th>Activity</th>
            {Object.keys(iucnCategoriesList)
              .sort()
              .map((cat, index) => (
                <th key={index} className={iucnCategoriesList[cat].level}>
                  {iucnCategoriesList[cat].category}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(iucnActivities).map((act, index) => {
            return (
              <tr key={index}>
                <td>{act.display}</td>
                {iucnActivityCategories[act.id].map((rank, index) => {
                  return (
                    <td key={index} className={rank}>
                      {activityRanks[rank].display}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </MatrixStyled>
  );
};
