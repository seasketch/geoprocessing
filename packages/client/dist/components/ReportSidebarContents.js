"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const useGeoprocessingResults_1 = __importDefault(require("../hooks/useGeoprocessingResults"));
const styled_components_1 = __importStar(require("styled-components"));
const styled_spinkit_1 = require("styled-spinkit");
exports.SeaSketchReportingMessageEventType = "SeaSketchReportingMessageEventType";
const Sandbox = styled_components_1.default.iframe `
  width: 100%;
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  border: none;
  ${props => props.hide &&
    styled_components_1.css `
      position: absolute;
      left: -20000px;
    `}
`;
const ReportSidebarContents = ({ sketchProperties, geometryUri, client, clientUri, clientOptions, tabId }) => {
    const iframeEl = react_1.useRef(null);
    const [iframeLoaded, setIframeLoaded] = react_1.useState(false);
    const { results, failed, loading, tasks, eta } = useGeoprocessingResults_1.default(sketchProperties, geometryUri, client, tabId, clientOptions);
    const onMessage = (e) => {
        if (e.data === "INIT") {
            setIframeLoaded(true);
        }
    };
    react_1.useEffect(() => {
        window.addEventListener("message", onMessage);
        if (!loading && iframeLoaded && iframeEl.current && iframeEl.current.contentWindow) {
            const msg = {
                type: exports.SeaSketchReportingMessageEventType,
                reportTab: tabId,
                serviceResults: results,
                sketchProperties,
                geometryUri
            };
            console.log('postMessage', msg);
            iframeEl.current.contentWindow.postMessage(msg, "*");
        }
        return () => {
            window.removeEventListener("message", onMessage);
        };
    }, [results, iframeLoaded, loading]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        loading && react_1.default.createElement(styled_spinkit_1.WanderingCubes, null),
        failed && react_1.default.createElement("div", null, "An error occurred"),
        react_1.default.createElement(Sandbox, { ref: iframeEl, src: clientUri, sandbox: "allow-same-origin allow-scripts", hide: loading || !iframeLoaded })));
};
exports.default = ReportSidebarContents;
