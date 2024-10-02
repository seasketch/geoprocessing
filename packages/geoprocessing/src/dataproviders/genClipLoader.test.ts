import { describe, test, expect } from "vitest";
import project from "../testing/project/testProjectClient.js";
import { genClipLoader } from "./genClipLoader.js";

// import micronesia eez from global subdivided
describe("genClipLoader", () => {
  test.skip("should successfully fetch datasources and return ClipOperations", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union",
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const clipLoader = genClipLoader(project, [
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
    ]);
    const clipOperations = await clipLoader({
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
    expect(clipOperations.length).toEqual(2);
    expect(clipOperations[0].clipFeatures.length).toEqual(151);
    expect(clipOperations[1].clipFeatures.length).toEqual(1);
  }, 10_000);
});
