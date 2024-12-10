import { describe, test, expect } from "vitest";
import { getDatasourceFeatures } from "./getDatasourceFeatures.js";
import project from "../testing/project/testProjectClient.js";

// import micronesia eez from global subdivided
describe("getDatasourceFeatures", () => {
  test("should successfully fetch from external subdivided eez datasource", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union",
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const url = project.getDatasourceUrl(eezDatasource, { format: "fgb" });
    // console.log("url", url);
    const feats = await getDatasourceFeatures(eezDatasource, url, {
      bbox: [
        135.312_441_837_621, -1.173_110_965_298_59, 165.676_528_225_997,
        13.445_432_925_389_3,
      ],
      // Without this filter, GUAM would also be included
      propertyFilter: {
        property: "UNION",
        values: ["Micronesia"],
      },
    });
    expect(feats.length).toEqual(1);
    expect(feats[0].properties?.["UNION"]).toEqual("Micronesia");
    expect(1).toEqual(1);
  }, 30_000);

  test("should successfully fetch from external subdivided land datasource", async () => {
    const landDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-osm-land",
    );
    if (!landDatasource)
      throw new Error("missing global eez land union datasource");
    const feats = await getDatasourceFeatures(
      landDatasource,
      project.getDatasourceUrl(landDatasource),
      {
        bbox: [
          135.312_441_837_621, -1.173_110_965_298_59, 165.676_528_225_997,
          13.445_432_925_389_3,
        ],
        unionProperty: "gid",
      },
    );
    expect(feats.length).toEqual(1050);
  }, 30_000);
});
