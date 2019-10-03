import ReportDecorator from "./components/ReportDecorator";
import Card from "./components/Card";
import ReportSidebar, {
  ReportContextMenuItem
} from "./components/ReportSidebar";
import { Sketch } from "@seasketch/serverless-geoprocessing";
import { GeoJsonObject } from "geojson";
export {
  SeaSketchReportingMessageEvent,
  SeaSketchReportingMessageEventType
} from "./components/ReportSidebarContents";

function storyLoader() {
  return [
    require("./components/Card.stories")
    // Don't include the sidebar in report implementations
    // require("./components/ReportSidebar.stories.js")
  ];
}

const toDataURI = (geojson: GeoJsonObject) => {
  let base64;
  if (btoa) {
    base64 = btoa(JSON.stringify(geojson));
  } else {
    base64 = Buffer.from(JSON.stringify(geojson)).toString("base64");
  }
  return `data:application/json;base64,${base64}`;
};

export {
  storyLoader,
  ReportDecorator,
  Card,
  ReportSidebar,
  ReportContextMenuItem,
  Sketch,
  toDataURI
};
