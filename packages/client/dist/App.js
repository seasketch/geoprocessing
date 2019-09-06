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
if (window.opener instanceof Window) {
    window.opener.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
    }, false);
}
const App = () => {
    const [serviceData, setServiceData] = react_1.useState(null);
    const [ReportTab, setReportTab] = react_1.useState(null);
    if (ReportTab !== null && serviceData !== null) {
        return react_1.default.createElement(ReportTab, { serviceData: serviceData });
    }
    else {
        return react_1.default.createElement("div", null);
    }
};
