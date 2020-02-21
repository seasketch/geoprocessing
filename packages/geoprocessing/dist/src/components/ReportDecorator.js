import React, { useState } from "react";
const containerStyle = {
    height: "auto",
    border: '1px solid rgba(0,0,0,0.12)',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 2,
    position: 'relative'
};
const styles = {
    backgroundColor: "#efefef",
    padding: 8,
    margin: 0,
    boxSizing: "border-box",
    boxShadow: "0px 0px 0px transparent, 0px 4px 4px 0px rgba(0, 0, 0, 0.06) inset, 0px 0px 0px transparent, 0px 0px 0px transparent",
};
const headerStyle = {
    fontFamily: 'sans-serif',
    padding: 10,
    backgroundColor: '#f5f5f5',
    zIndex: 2,
    borderBottom: '1px solid rgba(0,0,0,0.13)',
};
// @ts-ignore
const ReportWindow = ({ storyFn }) => {
    const [width, setWidth] = useState(500);
    return React.createElement(React.Fragment, null,
        React.createElement("div", { style: { width, ...containerStyle } },
            React.createElement("div", { style: headerStyle },
                React.createElement("h1", { style: { fontSize: 18, fontWeight: 500 } }, "Sketch Name")),
            React.createElement("div", { style: { ...styles, width } }, storyFn()),
            React.createElement("select", { value: width, onChange: (e) => setWidth(parseInt(e.target.value)), style: { position: 'absolute', bottom: -30 } },
                React.createElement("option", { value: 500 }, "Desktop - Standard Size"),
                React.createElement("option", { value: 800 }, "Desktop - Large"),
                React.createElement("option", { value: 320 }, "iPhone 5"),
                React.createElement("option", { value: 375 }, "iPhone 6, iPhone X"),
                React.createElement("option", { value: 414 }, "iPhone 6 Plus, iPhone 8 Plus, iPhone XR"),
                React.createElement("option", { value: 360 }, "Galaxy S5"),
                React.createElement("option", { value: 412 }, "Nexus 5x"),
                React.createElement("option", { value: 540 }, "Pixel"))));
};
// @ts-ignore
export default (storyFn) => React.createElement(ReportWindow, { storyFn: storyFn });
//# sourceMappingURL=ReportDecorator.js.map