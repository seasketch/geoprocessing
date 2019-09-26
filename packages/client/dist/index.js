"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportDecorator_1 = __importDefault(require("./components/ReportDecorator"));
exports.ReportDecorator = ReportDecorator_1.default;
const Card_1 = __importDefault(require("./components/Card"));
exports.Card = Card_1.default;
function loadStories() {
    require("./components/Card.stories.js");
    require("./components/ReportSidebar.stories.js");
}
exports.loadStories = loadStories;
