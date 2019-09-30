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
function storyLoader() {
    return [
        require("./components/Card.stories.js")
        // Don't include the sidebar in report implementations
        // require("./components/ReportSidebar.stories.js")
    ];
}
exports.storyLoader = storyLoader;
