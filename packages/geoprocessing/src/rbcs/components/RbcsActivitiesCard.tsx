import React from "react";
import { SketchAttributesCard } from "../../components";
import { constants } from "mpa-reg-based-classification";

export const RbcsActivitiesCard = () => {
  const mappings = {
    GEAR_TYPES: constants.GEAR_TYPES,
    AQUACULTURE: constants.AQUACULTURE_AND_BOTTOM_EXPLOITATION,
    BOATING: constants.BOATING_AND_ANCHORING,
  };

  return <SketchAttributesCard autoHide={true} mappings={mappings} />;
};

export default RbcsActivitiesCard;
