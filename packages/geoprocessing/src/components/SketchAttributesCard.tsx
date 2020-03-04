import React from "react";
import useSketchProperties from "../hooks/useSketchProperties";
import Card from "./Card";

export interface SketchAttributesCardProps {
  title?: string;
}

const SketchAttributesCard = (props: SketchAttributesCardProps) => {
  const [properties, getByExportId] = useSketchProperties();
  if (properties) {
    // TODO: handle arbitrary sketch attributes. Need to handle difference
    // between property ID and label somehow. filter out stuff like sketchClassId, id, etc
    return (
      <Card title={props.title || "Attributes"}>
        {properties.userAttributes.map(attr => (
          <div key={attr.exportId}>
            <span>{attr.label}</span>=<span>{attr.value}</span>
          </div>
        ))}
      </Card>
    );
  } else {
    return (
      <Card title={props.title || "Attributes"}>
        <p>No attributes found</p>
      </Card>
    );
  }
};

export default SketchAttributesCard;
