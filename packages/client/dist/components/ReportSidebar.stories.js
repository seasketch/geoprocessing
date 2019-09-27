"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ReportSidebar_1 = __importDefault(require("./ReportSidebar"));
exports.default = {
    component: ReportSidebar_1.default,
    title: 'Private|ReportSidebar'
};
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
exports.areaReport = () => (react_1.default.createElement(ReportSidebar_1.default, { style: { position: 'relative' }, sketch: sketch, geoprocessingProjectUri: "https://peartedq8b.execute-api.us-west-2.amazonaws.com/production/", clientTitle: "Example" }));
