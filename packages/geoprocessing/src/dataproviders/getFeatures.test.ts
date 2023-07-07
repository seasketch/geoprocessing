/**
 * @jest-environment node
 * @group unit
 */

import { getFeatures } from "./getFeatures";
import project from "../testing/project";

// import micronesia eez from global subdivided
describe("getFeatures", () => {
  test("should successfully fetch from subdivided eez datasource", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union"
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const feats = await getFeatures(
      eezDatasource,
      project.getVectorDatasourceUrl(eezDatasource),
      {
        bbox: [
          135.312441837621, -1.17311096529859, 165.676528225997,
          13.4454329253893,
        ],
        // Without this filter, GUAM would also be included
        propertyFilter: {
          property: "UNION",
          values: ["Micronesia"],
        },
      }
    );
    expect(feats.length).toEqual(1);
    expect(feats[0].properties?.["UNION"]).toEqual("Micronesia");
  }, 20000);

  test("should successfully fetch from subdivided land datasource", async () => {
    const landDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-osm-land"
    );
    if (!landDatasource)
      throw new Error("missing global eez land union datasource");
    const feats = await getFeatures(
      landDatasource,
      project.getVectorDatasourceUrl(landDatasource),
      {
        bbox: [
          135.312441837621, -1.17311096529859, 165.676528225997,
          13.4454329253893,
        ],
        unionProperty: "gid",
      }
    );
    expect(feats.length).toEqual(1050);
  }, 20000);
});
