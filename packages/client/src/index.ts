import ReportDecorator from "./components/ReportDecorator";
import Card from "./components/Card";
import ReportSidebar, {
  ReportContextMenuItem
} from "./components/ReportSidebar";
import { Sketch } from "@seasketch/serverless-geoprocessing";

function storyLoader() {
  return [
    require("./components/Card.stories.js")
    // Don't include the sidebar in report implementations
    // require("./components/ReportSidebar.stories.js")
  ];
}

export {
  storyLoader,
  ReportDecorator,
  Card,
  ReportSidebar,
  ReportContextMenuItem,
  Sketch
};
