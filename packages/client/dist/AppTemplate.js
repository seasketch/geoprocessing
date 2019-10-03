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
// Will be replaced by plugin with actual Report implementations
const REPORTS = {};
const App = () => {
    const [state, setState] = react_1.useState(null);
    const [initialized, setInitialized] = react_1.useState(false);
    const onMessage = (event) => {
        const message = JSON.parse(event.data);
        setState({
            serviceResults: message.serviceResults,
            ReportTab: REPORTS[message.reportTab],
            sketchProperties: message.sketchProperties,
            geometryUri: message.geometryUri
        });
    };
    react_1.useEffect(() => {
        if (window.opener instanceof Window) {
            window.opener.addEventListener("message", onMessage);
            if (!initialized) {
                window.opener.postMessage("INIT", "*");
                setInitialized(true);
            }
            return () => {
                window.opener.removeEventListener("message", onMessage);
            };
        }
    });
    if (state !== null) {
        const { ReportTab } = state;
        return react_1.default.createElement(ReportTab, Object.assign({}, state));
    }
    else {
        return react_1.default.createElement("div", null, "initialized");
    }
};
