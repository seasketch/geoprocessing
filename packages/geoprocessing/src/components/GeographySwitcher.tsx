import { Geography } from "../types/index.js";
import React, { ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";

export interface GeographySwitcherProps {
  curGeographyId: string;
  geographies: Geography[];
  changeGeography: ChangeEventHandler<HTMLSelectElement>;
}

export const GeographySwitcher: React.FunctionComponent<
  GeographySwitcherProps
> = (props) => {
  const { geographies, curGeographyId, changeGeography } = props;
  const { t } = useTranslation();

  return (
    <select
      onChange={changeGeography}
      value={curGeographyId}
      aria-label={t("Select geography")}
    >
      {geographies.map((geography) => {
        /* i18next-extract-disable-next-line */
        const transString = t(geography.display || "");
        return (
          <option
            key={geography.geographyId}
            value={geography.geographyId}
            aria-label={transString}
          >
            {transString}
          </option>
        );
      })}
    </select>
  );
};
