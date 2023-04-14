import React from "react";
import {
  iucnActivities,
  iucnActivityCategories,
  iucnCategoriesList,
  fullColor,
  highColor,
  IucnActivityRankId,
} from "../../iucn";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

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

export interface IucnActivityRank {
  id: IucnActivityRankId;
  desc: string;
  display: string;
}

export const IucnMatrix = () => {
  const { t } = useTranslation();

  const iucnActivityLabels = {
    RESEARCH_NE: t("IUCN activity - research", "Research: non-extractive"),
    TRAD_USE_NE: t(
      "IUCN activity - traditional use",
      "Traditional use: non-extractive"
    ),
    RESTORE_CON: t(
      "IUCN activity - restoration",
      "Restoration/enhancement for conservation"
    ),
    TRAD_FISH_COLLECT: t(
      "IUCN activity - traditional fishing",
      "Traditional fishing/collection"
    ),
    RECREATE_NE: t(
      "IUCN activity - non-extractive",
      "Non-extractive recreation"
    ),
    TOURISM: t("IUCN activity - tourism", "Large scale high intensity tourism"),
    SHIPPING: t("IUCN activity - shipping", "Shipping"),
    RESEARCH: t("IUCN activity - research extractive", "Research: extractive"),
    RENEWABLE_ENERGY: t(
      "IUCN activity - renewable",
      "Renewable energy generation"
    ),
    RESTORE_OTH: t(
      "IUCN activity - restoration",
      "Restoration/enhancement for other reasons"
    ),
    FISH_COLLECT_REC: t(
      "IUCN activity - fishing sustainable",
      "Fishing/collection: recreational (sustainable)"
    ),
    FISH_COLLECT_LOCAL: t(
      "IUCN activity - local fishing",
      "Fishing/collection: local fishing (sustainable)"
    ),
    FISH_AQUA_INDUSTRIAL: t(
      "IUCN activity - industrial fishing",
      "Industrial fishing, industrial scale aquaculture"
    ),
    AQUA_SMALL: t("IUCN activity - aquaculture", "Aquaculture - small scale"),
    WORKS: t("IUCN activity - works", "Works (harbors, ports, dredging)"),
    UNTREATED_WATER: t(
      "IUCN activity - untreated water",
      "Untreated water discharge"
    ),
    MINING_OIL_GAS: t(
      "IUCN activity - extraction",
      "Mining, oil and gas extraction"
    ),
    HABITATION: t("IUCN activity - habitation", "Habitation"),
  };

  const activityRanks: Record<IucnActivityRankId, IucnActivityRank> = {
    no: {
      id: "no",
      desc: t("IUCN rank - no description", "No"),
      display: t("IUCN rank - shorthand label for no", "N"),
    },
    nobut: {
      id: "nobut",
      desc: t(
        "IUCN rank - special no description",
        "Generally no, a strong prerogative against unless special circumstances apply"
      ),
      display: `${t(
        "IUCN rank - shorthand label for no, with extra meaning",
        "N*"
      )}`,
    },
    yes: {
      id: "yes",
      desc: t("IUCN rank - yes description", "Yes"),
      display: t("IUCN rank - shorthand label for yes", "Y"),
    },
    yesbut: {
      id: "yesbut",
      desc: t(
        "IUCN rank - special yes description",
        "Yes because no alternative exists, but special approval is essential"
      ),
      display: `${t(
        "IUCN rank - shorthand label for yes, with extra meaning",
        "Y*"
      )}`,
    },
    variable: {
      id: "variable",
      desc: t(
        "IUCN rank - special 'variable' description",
        "Variable; depends on whether this activity can be managed in such a way that it is compatible with the MPA’s objectives"
      ),
      display: "*",
    },
  };

  console.log(activityRanks);
  return (
    <MatrixStyled>
      <table>
        <thead>
          <tr>
            <th></th>
            <th className="full" colSpan={4}>
              {t("Full protection level label", "Full")}
            </th>
            <th className="high" colSpan={3}>
              {t("High protection level label", "High")}
            </th>
          </tr>
          <tr>
            <th>{t("Activity")}</th>
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
                <td>{iucnActivityLabels[act.id]}</td>
                {iucnActivityCategories[act.id].map((rank, index) => {
                  /* i18next-extract-disable-next-line */
                  const display = t(activityRanks[rank].display);
                  return (
                    <td key={index} className={rank}>
                      {display}
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
