/**
 * @jest-environment node
 * @group unit
 */

import area from "@turf/area";
import project from "../../defaultProjectConfig";
import { genClipOperationLoader } from "../dataproviders";
import { Sketch } from "../types";
import { genClipToPolygonPreprocessor } from "./genClipToPolygonPreprocessor";

// import micronesia eez from global subdivided
describe("genClipToPolygonPreprocessor", () => {
  test("should successfully generate and run preprocessor", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union"
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const opsLoader = genClipOperationLoader(project, [
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

    const preprocessor = genClipToPolygonPreprocessor(opsLoader);
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
            [149.3793667126688, 7.033915089905491],
            [167.1102326219892, 7.196404501212555],
            [167.0449537138265, 7.671995147373664],
            [149.3384476090506, 7.40755063883897],
            [149.3793667126688, 7.033915089905491],
          ],
        ],
      },
    });

    expect(result).toBeTruthy();
    expect(area(result)).toBe(75066892447.21024);
  });

  test("sketch outside of datasource should not clip at all", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union"
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const opsLoader = genClipOperationLoader(project, [
      {
        datasourceId: "global-clipping-osm-land",
        // subtract out land from sketch
        operation: "difference",
        // reconstruct subdivided land polygons
        options: {
          unionProperty: "gid",
        },
      },
    ]);

    const preprocessor = genClipToPolygonPreprocessor(opsLoader);

    const theSketch: Sketch = {
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
            [-120.18218994140626, 34.136815058265334],
            [-119.83337402343749, 34.136815058265334],
            [-119.83337402343749, 34.35477416538757],
            [-120.18218994140626, 34.35477416538757],
            [-120.18218994140626, 34.136815058265334],
          ],
        ],
      },
    };
    const origArea = area(theSketch);
    const result = await preprocessor(theSketch);

    expect(result).toBeTruthy();
    expect(area(result)).toEqual(origArea);
  });
});
