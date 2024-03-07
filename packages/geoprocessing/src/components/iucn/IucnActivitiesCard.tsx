import React from "react";
import { SketchAttributesCard } from "../SketchAttributesCard.js";
import { iucnActivities } from "../../iucn/index.js";

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
