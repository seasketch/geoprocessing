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
const React = __importStar(require("react"));
const react_1 = require("@storybook/react");
const Card_1 = __importDefault(require("./Card"));
const addon_knobs_1 = require("@storybook/addon-knobs");
const ReportDecorator_1 = __importDefault(require("./ReportDecorator"));
const stories = react_1.storiesOf('Components', module)
    .addDecorator(ReportDecorator_1.default)
    .addDecorator(addon_knobs_1.withKnobs);
stories.add('Card', () => React.createElement(Card_1.default, { title: addon_knobs_1.text("title", "Card Title") },
    React.createElement("p", null, "Body text goes here.")), {
    info: { text: "Usage instructions" },
    notes: {
        markdown: `
      ### Usage

      ~~~javascript
      <Card title="My Title">
        <p>My content</p>
      </Card>
      ~~~
    `
    },
});
