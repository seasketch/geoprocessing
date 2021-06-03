import fixtures from "../fixtures";
import { v4 as uuid } from "uuid";
import { Sketch, Polygon, LineString, Point } from "../types";
import bbox from "@turf/bbox";

export const genSampleSketch = (
  geometry: Polygon | LineString | Point
): Sketch => ({
  type: "Feature",
  properties: {
    id: uuid(),
    isCollection: false,
    userAttributes: [],
    sketchClassId: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "genSampleSketch",
  },
  geometry,
  bbox: bbox(geometry),
});

export const genSampleSketchContext = () => ({
  sketchProperties: {
    name: "My Sketch",
    id: "abc123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sketchClassId: "efg345",
    isCollection: false,
    userAttributes: [
      {
        exportId: "DESIGNATION",
        fieldType: "ChoiceField",
        label: "Designation",
        value: "Marine Reserve",
      },
      {
        exportId: "COMMENTS",
        fieldType: "TextArea",
        label: "Comments",
        value: "This is my MPA and it is going to be the greatest. Amazing.",
      },
    ],
  },
  geometryUri: "",
  projectUrl: "https://example.com/project",
  exampleOutputs: [
    {
      functionName: "ranked",
      sketchName: "My Sketch",
      results: {
        // RankedResult
        ranked: fixtures.ranked,
      },
    },
  ],
});
