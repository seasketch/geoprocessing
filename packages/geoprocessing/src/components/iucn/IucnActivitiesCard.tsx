import React from "react";
import { SketchAttributesCard } from "../SketchAttributesCard";
import { iucnActivities } from "../../iucn";

export const IucnActivitiesCard = () => {
  const actMapping = Object.values(iucnActivities)
    .map((act) => ({ [act.id]: act.display }))
    .reduce((actMapSoFar, oneActMap) => ({ ...actMapSoFar, ...oneActMap }), {});
  const mappings = {
    ACTIVITIES: {
      ...actMapping,
    },
  };

  return <SketchAttributesCard autoHide={true} mappings={mappings} />;
};

export default IucnActivitiesCard;
