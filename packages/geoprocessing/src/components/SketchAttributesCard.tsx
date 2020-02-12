import React from "react";
import useSketchProperties from "../hooks/useSketchProperties"
import Card from "./Card";

export interface SketchAttributesCardProps {
  title?: string;
}

const SketchAttributesCard = (props: SketchAttributesCardProps) => {
  const properties = useSketchProperties();
  if (properties) {
    // TODO: handle arbitrary sketch attributes. Need to handle difference 
    // between property ID and label somehow
    return <Card title={props.title || "Attributes"}>
      <p>
        No attributes found
      </p>
    </Card>
  } else {
    return <Card title={props.title || "Attributes"}>
      <p>
        No attributes found
      </p>
    </Card>
  }
}

export default SketchAttributesCard;