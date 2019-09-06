"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const boxStyle = {
    fontFamily: 'sans-serif',
    borderRadius: 4,
    backgroundColor: "#fff",
    boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
    padding: 16,
    margin: "8px 0px"
};
const titleStyle = {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.54)",
    marginBottom: "0.35em",
    marginTop: 0,
    fontWeight: 400,
};
const Card = ({ children, title, style }) => {
    return react_1.default.createElement("div", { style: { ...boxStyle, ...(style || {}) } },
        title && title.length && react_1.default.createElement("h2", { style: titleStyle }, title),
        children);
};
exports.default = Card;
