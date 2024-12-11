import { expect, test } from "vitest";
import { loadFgb } from "./flatgeobuf.js";
import canonicalize from "../util/canonicalize.js";
import { deserialize } from "flatgeobuf/lib/mjs/geojson.js";

import { readFileSync } from "node:fs";
import path from "node:path";
import { isFeatureCollection } from "../index.js";
import fs from "fs-extra";

describe("flatgeobuf", () => {
  test("flatgeobuf - local world fgb", async () => {
    const worldJson = fs.readJsonSync("data/in/world.json");
    // pull features out of FC and add index based ID, just as the flatgeobuf client does on read
    const worldFeatures = worldJson.features.map((f, index) => {
      f.id = index;
      return f;
    });
    const canonicalStr = canonicalize(worldFeatures);
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
});
