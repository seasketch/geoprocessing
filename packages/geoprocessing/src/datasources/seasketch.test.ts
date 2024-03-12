// @ts-ignore
import fetchMock from "fetch-mock-jest";
import { describe, test, expect } from "vitest";
import { fetchGeoJSON } from "./seasketch.js";
import { isSketch } from "../helpers/index.js";
import { Sketch } from "../index.js";
import { SketchProperties } from "../types/index.js";

const exampleSketch: Sketch = {
  type: "Feature",
  bbox: [0, 1, 2, 3, 4, 5],
  properties: {
    id: "1234abcd",
    updatedAt: new Date().toISOString(),
    name: "Sketch A",
    sketchClassId: "123abc",
  } as SketchProperties,
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-125.46386718749999, 33.578014746143985],
        [-125.8154296875, 32.65787573695528],
        [-124.365234375, 32.0639555946604],
        [-123.662109375, 33.211116472416855],
        [-125.46386718749999, 33.578014746143985],
      ],
    ],
  },
};

test("Basic extraction from request", async () => {
  const sketch = await fetchGeoJSON({
    geometry: exampleSketch,
  });
  if (isSketch(sketch)) {
    expect(sketch.properties && sketch.properties["id"]).toBe("1234abcd");
  }
});

test("Fetch sketch from a server", async () => {
  fetchMock.get(
    "https://seasketch.org/p/1/sketch/1234abcd?token=paralabrax",
    JSON.stringify(exampleSketch)
  );
  const sketch = await fetchGeoJSON({
    geometryUri: "https://seasketch.org/p/1/sketch/1234abcd?token=paralabrax",
  });
  if (isSketch(sketch)) {
    expect(sketch.properties && sketch.properties["id"]).toBe("1234abcd");
  }
});
