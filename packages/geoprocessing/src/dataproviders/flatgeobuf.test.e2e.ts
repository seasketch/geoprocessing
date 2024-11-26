import { expect, test } from "vitest";
import { loadFgb } from "./flatgeobuf.js";
import canonicalize from "../util/canonicalize.js";
import { deserialize } from "flatgeobuf/lib/mjs/geojson.js";

import { readFileSync } from "node:fs";
import path from "node:path";
import { isFeatureCollection } from "../index.js";

test("flatgeobuf - local world fgb", async () => {
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

test("flatgeobuf - file countries fgb from disk", async () => {
  const filePath = path.join(
    import.meta.dirname,
    "../../data/in/countries.fgb",
  );
  // console.log(filePath);
  const data = readFileSync(filePath);
  const view = new Uint8Array(data.buffer);
  const fc = deserialize(view);
  if (isFeatureCollection(fc)) {
    expect(fc.features.length).toEqual(179);
  }
});

test("flatgeobuf - external world fgb", async () => {
  const url =
    "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/world-unstable.fgb";
  const features = await loadFgb(url);
  expect(features.length).toEqual(1);
  // console.log(JSON.stringify(features))
}, 20_000);
