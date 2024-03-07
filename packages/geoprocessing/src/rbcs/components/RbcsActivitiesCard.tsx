import React from "react";
import { SketchAttributesCard } from "../../components/index.js";
import { rbcsConstants } from "../rbcs.js";

export const RbcsActivitiesCard = () => {
  const mappings = {
    GEAR_TYPES: rbcsConstants.GEAR_TYPES,
    AQUACULTURE: rbcsConstants.AQUACULTURE_AND_BOTTOM_EXPLOITATION,
    BOATING: rbcsConstants.BOATING_AND_ANCHORING,
  };

  return <SketchAttributesCard autoHide={true} mappings={mappings} />;
};

export default RbcsActivitiesCard;
