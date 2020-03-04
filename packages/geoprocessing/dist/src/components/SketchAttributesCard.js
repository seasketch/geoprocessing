import React from "react";
import useSketchProperties from "../hooks/useSketchProperties";
import Card from "./Card";
const SketchAttributesCard = (props) => {
    const [properties, getByExportId] = useSketchProperties();
    if (properties) {
        // TODO: handle arbitrary sketch attributes. Need to handle difference
        // between property ID and label somehow. filter out stuff like sketchClassId, id, etc
        return (React.createElement(Card, { title: props.title || "Attributes" }, properties.userAttributes.map(attr => (React.createElement("div", { key: attr.exportId },
            React.createElement("span", null, attr.label),
            "=",
            React.createElement("span", null, attr.value))))));
    }
    else {
        return (React.createElement(Card, { title: props.title || "Attributes" },
            React.createElement("p", null, "No attributes found")));
    }
};
export default SketchAttributesCard;
//# sourceMappingURL=SketchAttributesCard.js.map