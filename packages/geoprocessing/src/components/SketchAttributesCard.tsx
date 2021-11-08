import React from "react";
import useSketchProperties from "../hooks/useSketchProperties";
import Card from "./Card";

export interface SketchAttributesCardProps {
  title?: string;
  autoHide?: boolean;
  /** Map from value IDs to human readable for one or more exportIds */
  mappings?: { [exportId: string]: { [value: string]: string } };
}

const SketchAttributesCard = ({
  title,
  autoHide,
  mappings,
}: SketchAttributesCardProps) => {
  const titleStyle: React.CSSProperties = {
    fontSize: "1em",
    fontWeight: 500,
    color: "#6C7282",
    marginBottom: "1.5em",
  };

  const [properties] = useSketchProperties();
  if (autoHide === true && properties.userAttributes.length === 0) {
    return null;
  }
  if (properties) {
    return (
      <Card titleStyle={titleStyle} title={title || "Attributes"}>
        <table style={{ width: "100%" }}>
          <tbody>
            {properties.userAttributes.map((attr) => {
              const value = attr.value || "";
              let valueDisplay = value;
              if (mappings && mappings[attr.exportId]) {
                const listValues =
                  typeof value === "string" ? JSON.parse(value) : value;
                const displayValues = listValues.map(
                  (listValue) => mappings[attr.exportId][listValue]
                );
                valueDisplay = displayValues
                  .map((v) => v.toString())
                  .join(", ");
              } else if (Array.isArray(value)) {
                // array no mapping
                valueDisplay = value.map((v) => v.toString()).join(", ");
              } else {
                valueDisplay = value.toString();
              }

              return (
                <tr key={attr.exportId} style={{ verticalAlign: "top" }}>
                  <td
                    style={{
                      padding: 0,
                      paddingRight: 4,
                      borderBottom: "1px solid #f5f5f5",
                      paddingBottom: 6,
                      paddingTop: 6,
                    }}
                  >
                    {attr.label}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                      paddingBottom: 6,
                      paddingTop: 6,
                      paddingLeft: 6,
                    }}
                  >
                    {valueDisplay}
                  </td>
                  {/* <span>{attr.label}</span>=<span>{attr.value}</span> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    );
  } else {
    return (
      <Card titleStyle={titleStyle} title={title || "Attributes"}>
        <p>No attributes found</p>
      </Card>
    );
  }
};

export default SketchAttributesCard;
