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
const styled_components_1 = __importStar(require("styled-components"));
const ReportSidebarContents_1 = __importDefault(require("./ReportSidebarContents"));
const styled_spinkit_1 = require("styled-spinkit");
var ReportSidebarSize;
(function (ReportSidebarSize) {
    ReportSidebarSize[ReportSidebarSize["Normal"] = 0] = "Normal";
    ReportSidebarSize[ReportSidebarSize["Large"] = 1] = "Large";
})(ReportSidebarSize = exports.ReportSidebarSize || (exports.ReportSidebarSize = {}));
const Container = styled_components_1.default.div `
  height: calc(100vh - 40px);
  ${props => props.size === ReportSidebarSize.Normal
    ? styled_components_1.css `
          width: 500px;
        `
    : styled_components_1.css `
          width: 800px;
        `}
  border: 1px solid rgba(0,0,0,0.12);
  margin-left: auto;
  margin-right: auto;
  border-radius: 2px;
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  bottom: 0;
`;
const ContentContainer = styled_components_1.default.div `
  background-color: #efefef;
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  /* box-shadow: 0px 0px 0px transparent, 0px 4px 4px 0px rgba(0, 0, 0, 0.06) inset, */
    /* 0px 0px 0px transparent, 0px 0px 0px transparent; */
  flex: 1;
  overflow-y: scroll;
`;
const Header = styled_components_1.default.div `
  font-family: sans-serif;
  padding: 10px;
  background-color: #f5f5f5;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.13);
  flex: 0;
`;
const ReportSidebar = ({ size, sketch, geoprocessingProjectUri, clientOptions, clientTitle, style }) => {
    size = size || ReportSidebarSize.Normal;
    const [project, setProject] = react_1.useState();
    const [error, setError] = react_1.useState();
    const [loading, setLoading] = react_1.useState(true);
    const [tab, setTab] = react_1.useState();
    let client;
    if (project) {
        client = project.clients.find(c => c.title === clientTitle);
    }
    react_1.useEffect(() => {
        let didCancel = false;
        setLoading(true);
        const fetchProject = async () => {
            try {
                const response = await fetch(geoprocessingProjectUri);
                const data = await response.json();
                if (!didCancel) {
                    // TODO: should check for compatible version here at some point?
                    if (data.apiVersion) {
                        setProject(data);
                        setLoading(false);
                        const client = data.clients.find(c => c.title === clientTitle);
                        if (client) {
                            setTab(client.tabs[0].id);
                        }
                        else {
                            setError(`Could not find ReportClient with title ${clientTitle}.`);
                        }
                    }
                    else {
                        setError(`Problem interpretting geoprocessing project metadata. Missing apiVersion.`);
                    }
                }
            }
            catch (e) {
                if (!didCancel) {
                    setError(`Problem fetching geoprocessing project metadata. ${e.toString()}`);
                }
            }
        };
        fetchProject();
        return () => {
            didCancel = true;
        };
    }, [geoprocessingProjectUri]);
    return (react_1.default.createElement(Container, { size: size, style: style },
        react_1.default.createElement(Header, null,
            react_1.default.createElement("h1", { style: { fontWeight: 500, fontSize: 18 } }, sketch.properties && sketch.properties.name)),
        react_1.default.createElement(ContentContainer, null,
            loading && react_1.default.createElement(styled_spinkit_1.WanderingCubes, null),
            error && react_1.default.createElement("div", null, error),
            !loading && !error && client && project && tab && (react_1.default.createElement(ReportSidebarContents_1.default, { sketch: sketch, client: client, clientUri: project.clientUri, clientOptions: clientOptions, tabId: tab })))));
};
exports.default = ReportSidebar;
