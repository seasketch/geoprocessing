import React from "react";
import useSketchProperties from "../hooks/useSketchProperties";
import Card from "./Card";
const SketchAttributesCard = (props) => {
    const properties = useSketchProperties();
    if (properties) {
        // TODO: handle arbitrary sketch attributes. Need to handle difference 
        // between property ID and label somehow. filter out stuff like sketchClassId, id, etc
        return React.createElement(Card, { title: props.title || "Attributes" }, Object.keys(properties).map((key) => React.createElement("div", null,
            React.createElement("span", null, key),
            "=",
            React.createElement("span", null, properties[key]))));
    }
    else {
        return React.createElement(Card, { title: props.title || "Attributes" },
            React.createElement("p", null, "No attributes found"));
    }
};
export default SketchAttributesCard;
//# sourceMappingURL=SketchAttributesCard.js.map