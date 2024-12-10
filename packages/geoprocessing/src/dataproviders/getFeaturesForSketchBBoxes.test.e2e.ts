import { expect, test } from "vitest";
import { loadFgb } from "./flatgeobuf.js";
import canonicalize from "../util/canonicalize.js";
import { deserialize } from "flatgeobuf/lib/mjs/geojson.js";

import { readFileSync } from "node:fs";
import path from "node:path";
import { isFeatureCollection } from "../index.js";

describe("getFeaturesForBBoxes", () => {
  test("getFeaturesForBBoxes - simple", async () => {
    const canonicalStr = canonicalize([
      {
        id: 0, // this is not in the data, but fgb client automatically adds it on deserialize as of v3.36.0
        type: "Feature",
        properties: {
          name: "World boundary",
          description: "World",
        },
        geometry: {
          coordinates: [
            [
              [-180, 90],
              [-180, -90],
              [180, -90],
              [180, 90],
              [-180, 90],
            ],
          ],
          type: "Polygon",
        },
      },
    ]);
    const url = "http://127.0.0.1:8080/data/in/world.fgb";
    const features = await loadFgb(url);
    expect(features.length).toEqual(1);
    expect(canonicalize(features)).toEqual(canonicalStr);
  });
});
