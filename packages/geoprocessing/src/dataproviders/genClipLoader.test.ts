/**
 * @jest-environment node
 * @group unit
 */

import project from "../../defaultProjectConfig";
import { genClipLoader } from "./genClipLoader";

// import micronesia eez from global subdivided
describe("genClipLoader", () => {
  test("should successfully fetch datasources and return ClipOperations", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union"
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
            [149.3793667126688, 7.033915089905491],
            [167.1102326219892, 7.196404501212555],
            [167.0449537138265, 7.671995147373664],
            [149.3384476090506, 7.40755063883897],
            [149.3793667126688, 7.033915089905491],
          ],
        ],
      },
    });
    expect(clipOperations.length).toEqual(2);
    expect(clipOperations[0].clipFeatures.length).toEqual(151);
    expect(clipOperations[1].clipFeatures.length).toEqual(1);
  });
});
