import { describe, test, expect } from "vitest";
import { overlapFeatures } from "./overlapFeatures.js";
import area from "@turf/area";
import { Feature, FeatureCollection, MultiPolygon } from "geojson";
import fs from "fs-extra";
import { fgbFetchAll } from "../dataproviders/flatgeobuf.js";
import bbox from "@turf/bbox";
import { featureCollection } from "@turf/helpers";

describe("overlapFeatures e2e", () => {
  test("overlapFeatures e2e - rocky hole 2", async () => {
    const rockSketch = fs.readJsonSync("src/testing/fixtures/rockySketch.json");

    const url = "http://127.0.0.1:8080/data/in/rocky_shores.fgb";
    const rocky = await fgbFetchAll<Feature<MultiPolygon>>(
      url,
      bbox(rockSketch)
    );

    const rockyArea = area(featureCollection(rocky));
    console.log("rockyArea fgb", rockyArea);

    const metrics = await overlapFeatures("test", rocky, rockSketch);

    const overlapArea = metrics[0].value;
    console.log("overlapArea", overlapArea);
    console.log(JSON.stringify(metrics, null, 2));

    // const rockyJson: FeatureCollection<MultiPolygon> = fs.readJSONSync(
    //   "src/testing/fixtures/rocky_shores.json"
    // );
    // const rockyJsonArea = area(rockyJson);
    // console.log("rockyArea json", rockyJsonArea);
    // const metricsJson = await overlapFeatures(
    //   "test",
    //   rockyJson.features,
    //   rockSketch
    // );
    // const overlapAreaJson = metricsJson[0].value;
    // console.log("overlapArea json", overlapAreaJson);

    expect(metrics.length).toEqual(1);
  });
});
