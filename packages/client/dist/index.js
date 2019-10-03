"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportDecorator_1 = __importDefault(require("./components/ReportDecorator"));
exports.ReportDecorator = ReportDecorator_1.default;
const Card_1 = __importDefault(require("./components/Card"));
exports.Card = Card_1.default;
const ReportSidebar_1 = __importDefault(require("./components/ReportSidebar"));
exports.ReportSidebar = ReportSidebar_1.default;
var ReportSidebarContents_1 = require("./components/ReportSidebarContents");
exports.SeaSketchReportingMessageEventType = ReportSidebarContents_1.SeaSketchReportingMessageEventType;
function storyLoader() {
    return [
        require("./components/Card.stories")
        // Don't include the sidebar in report implementations
        // require("./components/ReportSidebar.stories.js")
    ];
}
exports.storyLoader = storyLoader;
const toDataURI = (geojson) => {
    let base64;
    if (btoa) {
        base64 = btoa(JSON.stringify(geojson));
    }
    else {
        base64 = Buffer.from(JSON.stringify(geojson)).toString("base64");
    }
    return `data:application/json;base64,${base64}`;
};
exports.toDataURI = toDataURI;
