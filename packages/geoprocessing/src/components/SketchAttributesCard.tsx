import React from "react";
import useSketchProperties from "../hooks/useSketchProperties.js";
import { useTranslation } from "react-i18next";
import Card from "./Card.js";

export interface SketchAttributesCardProps {
  title?: string;
  autoHide?: boolean;
  /** Map from value IDs to human readable for one or more exportIds */
  mappings?: { [exportId: string]: { [value: string]: string } };
}

export const SketchAttributesCard = ({
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
  const { t, i18n } = useTranslation();

  const attributesLabel = t("Attributes");

  if (autoHide === true && properties.userAttributes.length === 0) {
    return null;
  }
  if (properties) {
    return (
      <Card titleStyle={titleStyle} title={title || attributesLabel}>
        <table style={{ width: "100%" }}>
          <tbody>
            {properties.userAttributes.map((attr) => {
              let label; // label: "Designation"
              let valueLabel; // valueLabel: "Fully Protected",

              // seasketch legacy - has no valueLabel, need to generate it
              if (!attr.valueLabel) {
                // Use label directly
                label = attr.label;
                // there is valueLabel provided, it is just the attribute value unless there's a caller provided mapping
                const value =
                  attr && attr.value !== undefined && attr.value !== null
                    ? attr.value
                    : t("(Not answered)");
                valueLabel = value;
                if (
                  mappings &&
                  mappings[attr.exportId] &&
                  typeof value === "string"
                ) {
                  if (value[0] === "[") {
                    const listValues = JSON.parse(value);
                    const displayValues = listValues.map(
                      (listValue) => mappings[attr.exportId][listValue],
                    );
                    valueLabel = displayValues
                      .map((v) => v.toString())
                      .join(", ");
                  } else {
                    valueLabel = mappings[attr.exportId][value];
                  }
                } else if (Array.isArray(value)) {
                  // array no mapping
                  valueLabel = value.map((v) => v.toString()).join(", ");
                } else {
                  valueLabel = value.toString();
                }
              }

              // seasketch next - has label and optional translation
              if (attr.label) {
                label = attr.label;

                // If language not english, override with translation if available
                if (i18n.language === "en") {
                  label = attr.label;
                } else if (
                  attr.alternateLanguages &&
                  Object.keys(attr.alternateLanguages).includes(i18n.language)
                ) {
                  // Swap in translation
                  label = attr.alternateLanguages[i18n.language].label;
                }
              }

              // seasketch next - has valueLabel and optional translation
              if (attr.valueLabel) {
                valueLabel = attr.valueLabel;

                // If language not english, override with translation if available
                if (
                  i18n.language !== "en" &&
                  attr.alternateLanguages &&
                  Object.keys(attr.alternateLanguages).includes(i18n.language)
                ) {
                  // Swap in translation
                  valueLabel =
                    attr.alternateLanguages[i18n.language].valueLabel;
                }
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
                    {label}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                      paddingBottom: 6,
                      paddingTop: 6,
                      paddingLeft: 6,
                    }}
                  >
                    {valueLabel
                      ? Array.isArray(valueLabel)
                        ? valueLabel.map((v, index) => (
                            <div key={index}>{t(v)}</div>
                          ))
                        : t(valueLabel) /* i18next-extract-disable-line */
                      : "N/A"}
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
      <Card titleStyle={titleStyle} title={title || attributesLabel}>
        <p>{t("No attributes found")}</p>
      </Card>
    );
  }
};

export default SketchAttributesCard;
