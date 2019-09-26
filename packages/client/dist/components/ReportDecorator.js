"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
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
    const [width, setWidth] = react_1.useState(500);
    return react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { style: { width, ...containerStyle } },
            react_1.default.createElement("div", { style: headerStyle },
                react_1.default.createElement("h1", { style: { fontSize: 18, fontWeight: 500 } }, "Sketch Name")),
            react_1.default.createElement("div", { style: { ...styles, width } }, storyFn()),
            react_1.default.createElement("select", { value: width, onChange: (e) => setWidth(parseInt(e.target.value)), style: { position: 'absolute', bottom: -30 } },
                react_1.default.createElement("option", { value: 500 }, "Desktop - Standard Size"),
                react_1.default.createElement("option", { value: 800 }, "Desktop - Large"),
                react_1.default.createElement("option", { value: 320 }, "iPhone 5"),
                react_1.default.createElement("option", { value: 375 }, "iPhone 6, iPhone X"),
                react_1.default.createElement("option", { value: 414 }, "iPhone 6 Plus, iPhone 8 Plus, iPhone XR"),
                react_1.default.createElement("option", { value: 360 }, "Galaxy S5"),
                react_1.default.createElement("option", { value: 412 }, "Nexus 5x"),
                react_1.default.createElement("option", { value: 540 }, "Pixel"))));
};
// @ts-ignore
exports.default = (storyFn) => react_1.default.createElement(ReportWindow, { storyFn: storyFn });
