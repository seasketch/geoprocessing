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
const addon_knobs_1 = require("@storybook/addon-knobs");
const ReportSidebar_1 = __importDefault(require("./ReportSidebar"));
const sketch = {
    "type": "Feature",
    "properties": {
        "name": "Campus Point"
    },
    "bbox": [0, 1, 2, 3],
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    -119.94873046875,
                    34.28445325435288
                ],
                [
                    -119.78668212890624,
                    34.28445325435288
                ],
                [
                    -119.78668212890624,
                    34.43749580157603
                ],
                [
                    -119.94873046875,
                    34.43749580157603
                ],
                [
                    -119.94873046875,
                    34.28445325435288
                ]
            ]
        ]
    }
};
const stories = react_1.storiesOf('Components', module)
    .addDecorator(addon_knobs_1.withKnobs);
stories.add('ReportSidebar', () => React.createElement(ReportSidebar_1.default, { style: { position: 'relative' }, sketch: sketch, geoprocessingProjectUri: addon_knobs_1.text("geoprocessing project uri", "https://peartedq8b.execute-api.us-west-2.amazonaws.com/production/"), clientTitle: addon_knobs_1.text("clientTitle", "Example") }), {
    info: { text: "Usage instructions" },
    notes: {
        markdown: `
      ### Usage

      ~~~javascript
      <ReportSidebar 
        geoprocessingProjectUri="https://peartedq8b.execute-api.us-west-2.amazonaws.com/production/" 
        clientTitle="Example" 
        sketch="sketch" 
      />
      ~~~
    `
    },
});
