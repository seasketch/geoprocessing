import ReportDecorator from "./components/ReportDecorator";
import Card from "./components/Card";

function storyLoader() {
  return [
    require("./components/Card.stories.js")
    // Don't include the sidebar in report implementations
    // require("./components/ReportSidebar.stories.js")
  ];
}

export { storyLoader, ReportDecorator, Card };
