import { fgbFetchAll } from "./flatgeobuf.js";
import canonicalize from "../util/canonicalize.js";
import "../util/fetchPolyfill.js";
import { deserialize } from "flatgeobuf/lib/mjs/geojson.js";
import { Polygon } from "geojson";

import { readFileSync } from "fs";
import path from "path";
import * as url from "url";

test("flatgeobuf - internal world fgb", async () => {
  const str = canonicalize([
    {
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
  const features = await fgbFetchAll(url);
  expect(features.length).toEqual(1);
  expect(canonicalize(features)).toEqual(str);
});

test("flatgeobuf - file countries fgb", async () => {
  const str = canonicalize([
    {
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

  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

  const filePath = path.join(__dirname, "../../data/in/countries.fgb");
  console.log(filePath);
  const data = readFileSync(filePath);
  const view = new Uint8Array(data.buffer);
  const fc = deserialize(view);

  expect(fc.features.length).toEqual(179);
});

test.skip("flatgeobuf - external world fgb", async () => {
  const url =
    "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/world.fgb";
  const features = await fgbFetchAll(url)
  expect(features.length).toEqual(1);
}, 20000);

// test("flatgeobuf - external world fgb", async () => {
//   const url =
//     "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/world.fgb";
//   const response = await fetch(url);
//   const features: Polygon[] = [];
//   for await (let feature of deserialize(response.body)) {
//     // add each feature to the map, after projecting it to
//     console.log(feature);
//     features.push(feature);
//   }
//   expect(features.length).toEqual(1);
// });
