"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("./Card"));
const ReportDecorator_1 = __importDefault(require("./ReportDecorator"));
exports.default = {
    component: Card_1.default,
    title: 'Card',
    decorators: [ReportDecorator_1.default],
};
exports.simple = () => react_1.default.createElement(Card_1.default, { title: "Card Title" },
    react_1.default.createElement("p", null, "Body text goes here."));
