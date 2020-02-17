import React from "react";
import Card from "./Card";
import { useFunction } from "../hooks/useFunction";
function ResultsCard(props) {
    if (!props.functionName) {
        throw new Error("No function specified for ResultsCard");
    }
    const { task, loading, error } = useFunction(props.functionName);
    if (error) {
        return React.createElement(Card, { title: props.title },
            React.createElement("h3", null, "Error!"),
            React.createElement("p", null, error));
    }
    else {
        return React.createElement(Card, { title: props.title }, loading || !task ? React.createElement(React.Fragment, null,
            React.createElement("p", null, "loading...")) : React.createElement(React.Fragment, null, props.children(task.data)));
    }
}
export default ResultsCard;
//# sourceMappingURL=ResultsCard.js.map