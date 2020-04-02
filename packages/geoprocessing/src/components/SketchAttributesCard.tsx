import React from "react";
import useSketchProperties from "../hooks/useSketchProperties";
import Card from "./Card";

export interface SketchAttributesCardProps {
  title?: string;
  autoHide?: boolean;
}

const SketchAttributesCard = (props: SketchAttributesCardProps) => {
  const [properties] = useSketchProperties();
  if (props.autoHide === true && properties.userAttributes.length === 0) {
    return null;
  }
  if (properties) {
    return (
      <Card title={props.title || "Attributes"}>
        <table style={{ fontSize: 14, width: "100%" }}>
          <tbody>
            {properties.userAttributes.map(attr => {
              const value = attr.value || "";
              return (
                <tr key={attr.exportId} style={{ verticalAlign: "top" }}>
                  <td
                    style={{
                      fontWeight: 200,
                      padding: 0,
                      paddingRight: 4,
                      borderBottom: "1px solid #f5f5f5",
                      paddingBottom: 6,
                      paddingTop: 6
                    }}
                  >
                    {attr.label}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                      paddingBottom: 6,
                      paddingTop: 6,
                      paddingLeft: 6
                    }}
                  >
                    {Array.isArray(value)
                      ? value.map(v => v.toString()).join(", ")
                      : value.toString()}
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
      <Card title={props.title || "Attributes"}>
        <p>No attributes found</p>
      </Card>
    );
  }
};

export default SketchAttributesCard;
