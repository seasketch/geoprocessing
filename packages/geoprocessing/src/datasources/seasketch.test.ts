import { test, expect } from "vitest";
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
        [-125.463_867_187_499_99, 33.578_014_746_143_985],
        [-125.815_429_687_5, 32.657_875_736_955_28],
        [-124.365_234_375, 32.063_955_594_660_4],
        [-123.662_109_375, 33.211_116_472_416_855],
        [-125.463_867_187_499_99, 33.578_014_746_143_985],
      ],
    ],
  },
};

test.skip("Basic extraction from request", async () => {
  const sketch = await fetchGeoJSON({
    geometry: exampleSketch,
  });
  if (isSketch(sketch)) {
    expect(sketch.properties && sketch.properties["id"]).toBe("1234abcd");
  }
});

test.skip("Fetch sketch from a server", async () => {
  // fetchMock.get(
  //   "https://seasketch.org/p/1/sketch/1234abcd?token=paralabrax",
  //   JSON.stringify(exampleSketch)
  // );
  const sketch = await fetchGeoJSON({
    geometryUri: "https://seasketch.org/p/1/sketch/1234abcd?token=paralabrax",
  });
  if (isSketch(sketch)) {
    expect(sketch.properties && sketch.properties["id"]).toBe("1234abcd");
  }
});
