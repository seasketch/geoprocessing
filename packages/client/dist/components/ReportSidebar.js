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
const Close_1 = require("styled-icons/material/Close");
const MoveHorizontal_1 = require("styled-icons/boxicons-regular/MoveHorizontal");
const Cog_1 = require("styled-icons/fa-solid/Cog");
var ReportSidebarSize;
(function (ReportSidebarSize) {
    ReportSidebarSize[ReportSidebarSize["Normal"] = 0] = "Normal";
    ReportSidebarSize[ReportSidebarSize["Large"] = 1] = "Large";
})(ReportSidebarSize = exports.ReportSidebarSize || (exports.ReportSidebarSize = {}));
const Container = styled_components_1.default.div `
  height: calc(100vh - 60px);
  ${props => props.size === ReportSidebarSize.Normal
    ? styled_components_1.css `
          width: 500px;
        `
    : styled_components_1.css `
          width: 800px;
        `}
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 3px 0px 0px 0px;
  box-shadow: rgba(0, 0, 0, 0.6) 0px 0px 4px;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  right: -1px;
  display: flex;
  flex-direction: column;
  bottom: -1px;
  z-index: 10000;
  transition: right 250ms;
`;
const ContentContainer = styled_components_1.default.div `
  background-color: rgb(244,247,249);
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.12);
  flex: 1;
  overflow-y: scroll;
`;
const Header = styled_components_1.default.div `
  font-family: sans-serif;
  padding: 10px;
  padding-left: 14px;
  background-color: #f5f5f5;
  z-index: 2;
  flex: 0;
  border-radius: 3px 3px 0px 0px;
  border-bottom: 1px solid rgba(0,0,0,0.16);
`;
const Actions = styled_components_1.default.div `
  position: absolute;
  right: 0px;
  top: 0px;
  padding: 12px;
`;
const ActionButton = styled_components_1.default.button `
  float: right;
  cursor: pointer;
  border: none;
  background: transparent;
  border-radius: 24px;
  padding: 4px;
  width: 25px;
  height: 25px;
  margin-left: 4px;
  font-weight: bold;
  color: #555;
  line-height: normal;
  &:focus {
    border: none;
    box-shadow: none;
    outline: none;
  }

  &:hover {
    background-color: #efefef;
    color: black;
  }
  &:active {
    background-color: #ccc;
  }
`;
const ReportSidebar = ({ size, sketchProperties, geometryUri, geoprocessingProjectUri, clientOptions, clientTitle, style, contextMenuItems, onClose }) => {
    size = size || ReportSidebarSize.Normal;
    const [project, setProject] = react_1.useState();
    const [error, setError] = react_1.useState();
    const [loading, setLoading] = react_1.useState(true);
    const [tab, setTab] = react_1.useState();
    const [offset, setOffset] = react_1.useState(false);
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
    return (react_1.default.createElement(Container, { size: size, style: { ...(style || {}), ...(offset ? { right: 499 } : {}) } },
        react_1.default.createElement(Header, null,
            react_1.default.createElement("h1", { style: { fontWeight: 500, fontSize: 18 } }, sketchProperties.name || "Untitled Sketch"),
            react_1.default.createElement(Actions, null,
                react_1.default.createElement(ActionButton, { onClick: onClose },
                    react_1.default.createElement(Close_1.Close, null)),
                react_1.default.createElement(ActionButton, null,
                    react_1.default.createElement(Cog_1.Cog, null)),
                react_1.default.createElement(ActionButton, { onClick: () => setOffset(!offset) },
                    react_1.default.createElement(MoveHorizontal_1.MoveHorizontal, null)))),
        react_1.default.createElement(ContentContainer, null,
            loading && react_1.default.createElement(styled_spinkit_1.WanderingCubes, null),
            error && react_1.default.createElement("div", null, error),
            !loading && !error && client && project && tab && (react_1.default.createElement(ReportSidebarContents_1.default, { sketchProperties: sketchProperties, geometryUri: geometryUri, client: client, clientUri: project.clientUri, clientOptions: clientOptions, tabId: tab })))));
};
exports.default = ReportSidebar;
