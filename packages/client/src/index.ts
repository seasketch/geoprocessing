import ReportDecorator from "./components/ReportDecorator";
import Card from "./components/Card";

function loadStories() {
  require("./components/Card.stories.js");
  require("./components/ReportSidebar.stories.js");
}

export { loadStories, ReportDecorator, Card };
