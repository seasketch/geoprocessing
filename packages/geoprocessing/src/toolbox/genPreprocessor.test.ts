import { describe, test, expect } from "vitest";
import { area } from "@turf/turf";
import project from "../testing/project/testProjectClient.js";
import { Polygon, Sketch } from "../types/index.js";
import {
  DatasourceClipOperation,
  FeatureClipOperation,
  genClipToPolygonDatasources,
  genClipToPolygonFeatures,
} from "./genPreprocessor.js";
import fix from "../testing/fixtures/squareSketches.js";

// import micronesia eez from global subdivided
describe("genPreprocessor", () => {
  test.skip("should successfully generate and run preprocessor", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union",
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const clipOperations: DatasourceClipOperation[] = [
      {
        datasourceId: "global-clipping-osm-land",
        // subtract out land from sketch
        operation: "difference",
        // reconstruct subdivided land polygons
        options: {
          unionProperty: "gid",
        },
      },
      {
        datasourceId: "global-clipping-eez-land-union",
        // keep portion of sketch overlapping with eez
        operation: "intersection",
        options: {
          // Filter to specific EEZ polygons
          // Does not union subdivided eez polygons due to looping error - https://github.com/seasketch/union-subdivided-polygons/issues/5
          propertyFilter: {
            property: "UNION",
            values: ["Micronesia"],
          },
        },
      },
    ];

    const preprocessor = genClipToPolygonDatasources(project, clipOperations);
    const result = await preprocessor({
      type: "Feature",
      properties: {
        name: "fsm-east-west",
        updatedAt: "2022-11-17T10:02:53.645Z",
        sketchClassId: "123abc",
        id: "abc123",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [149.379_366_712_668_8, 7.033_915_089_905_491],
            [167.110_232_621_989_2, 7.196_404_501_212_555],
            [167.044_953_713_826_5, 7.671_995_147_373_664],
            [149.338_447_609_050_6, 7.407_550_638_838_97],
            [149.379_366_712_668_8, 7.033_915_089_905_491],
          ],
        ],
      },
    });

    expect(result).toBeTruthy();
    expect(area(result)).toBe(75_066_892_447.210_24);
  }, 60_000);

  test("sketch outside of datasource should not clip at all", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union",
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const clipOperations: DatasourceClipOperation[] = [
      {
        datasourceId: "global-clipping-osm-land",
        // subtract out land from sketch
        operation: "difference",
        // reconstruct subdivided land polygons
        options: {
          unionProperty: "gid",
        },
      },
    ];

    const preprocessor = genClipToPolygonDatasources(project, clipOperations);

    const theSketch: Sketch<Polygon> = {
      type: "Feature",
      properties: {
        name: "fsm-east-west",
        updatedAt: "2022-11-17T10:02:53.645Z",
        createdAt: "2022-11-17T10:02:53.645Z",
        sketchClassId: "123abc",
        id: "abc123",
        isCollection: false,
        userAttributes: [],
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-120.182_189_941_406_26, 34.136_815_058_265_334],
            [-119.833_374_023_437_49, 34.136_815_058_265_334],
            [-119.833_374_023_437_49, 34.354_774_165_387_57],
            [-120.182_189_941_406_26, 34.354_774_165_387_57],
            [-120.182_189_941_406_26, 34.136_815_058_265_334],
          ],
        ],
      },
    };
    const origArea = area(theSketch);
    const result = await preprocessor(theSketch);

    expect(result).toBeTruthy();
    expect(area(result)).toEqual(origArea);
  }, 20_000);
});

describe("genClipToPolygonsPreprocessor", () => {
  test("genClipToPolygonsPreprocessor should successfully generate and run preprocessor", async () => {
    const featureOperations: FeatureClipOperation[] = [
      {
        clipFeatures: [fix.twoByPoly],
        operation: "intersection",
      },
    ];

    const preprocessor = genClipToPolygonFeatures(featureOperations);
    const result = await preprocessor(fix.halfInsideTwoByPoly);

    expect(result).toBeTruthy();
    expect(area(result)).toBe(area(fix.fullyInsideTwoPoly));
  }, 60_000);

  test("geoprocessorz - sketch outside of datasource should not clip at all", async () => {
    const featureOperations: FeatureClipOperation[] = [
      {
        clipFeatures: [fix.twoByPoly],
        operation: "difference",
      },
    ];

    const preprocessor = genClipToPolygonFeatures(featureOperations, {});
    const result = await preprocessor(fix.outsideTwoByPolyTopRight);

    expect(result).toBeTruthy();
    expect(area(result)).toBe(area(fix.outsideTwoByPolyTopRight)); // should be same as input
  }, 20_000);
});
