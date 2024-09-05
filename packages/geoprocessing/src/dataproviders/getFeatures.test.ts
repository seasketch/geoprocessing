import { describe, test, expect } from "vitest";
import { getFeatures } from "./getFeatures.js";
import project from "../testing/project/testProjectClient.js";

// import micronesia eez from global subdivided
describe("getFeatures", () => {
  test("should successfully fetch from external subdivided eez datasource", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union",
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const url = project.getDatasourceUrl(eezDatasource, { format: "fgb" });
    // console.log("url", url);
    const feats = await getFeatures(eezDatasource, url, {
      bbox: [
        135.312441837621, -1.17311096529859, 165.676528225997, 13.4454329253893,
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
  }, 30000);

  test("should successfully fetch from external subdivided land datasource", async () => {
    const landDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-osm-land",
    );
    if (!landDatasource)
      throw new Error("missing global eez land union datasource");
    const feats = await getFeatures(
      landDatasource,
      project.getDatasourceUrl(landDatasource),
      {
        bbox: [
          135.312441837621, -1.17311096529859, 165.676528225997,
          13.4454329253893,
        ],
        unionProperty: "gid",
      },
    );
    expect(feats.length).toEqual(1050);
  }, 30000);

  test("getFeatures - fetch subdivided with bbox crossing antimeridian greater than 180", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union",
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const feats = await getFeatures(
      eezDatasource,
      project.getDatasourceUrl(eezDatasource, { format: "fgb" }),
      {
        bbox: [170.3874, -15.761472, 186.44315, -14.24049],
      },
    );
    // toJsonFile(featureCollection(feats), "SUB_FIJI_OUTSIDE_SUB.json");
    expect(feats.length).toEqual(4); // Only returns left side of antimeridian
  }, 30000);

  test("getFeatures - fetch subdivided with bbox crossing antimeridian within 180", async () => {
    const eezDatasource = project.getExternalVectorDatasourceById(
      "global-clipping-eez-land-union",
    );
    if (!eezDatasource)
      throw new Error("missing global eez land union datasource");
    const feats = await getFeatures(
      eezDatasource,
      project.getDatasourceUrl(eezDatasource, { format: "fgb" }),
      {
        bbox: [-180, -15.706455006156576, 180, -14.274583217973047],
      },
    );
    // toJsonFile(featureCollection(feats), "SUB_FIJI_INSIDE_SUB.json");
    expect(feats.length).toEqual(29); // Returns eez features across entire world crossing
  }, 30000);

  // The same behavior is observed when using a flatgeobuf datasource, they just take a lot more time to run

  test("getFeatures - fetch flatgeobuf with bbox crossing antimeridian outside 180 returns long way", async () => {
    const fgbDatasourceId =
      project.getVectorDatasourceById("global-eez-mr-v12");
    const feats = await getFeatures(
      fgbDatasourceId,
      project.getDatasourceUrl(fgbDatasourceId, { format: "fgb" }),
      {
        bbox: [170.3874, -15.761472, 186.44315, -14.24049],
      },
    );
    // toJsonFile(featureCollection(feats), "SUB_FIJI_OUTSIDE_FGB.json");
    expect(feats.length).toEqual(4); // Returns eez features across entire world crossing
  }, 90000);

  test("getFeatures - fetch flatgeobuf with bbox crossing antimeridian within 180 returns long way", async () => {
    const fgbDatasourceId =
      project.getVectorDatasourceById("global-eez-mr-v12");
    const feats = await getFeatures(
      fgbDatasourceId,
      project.getDatasourceUrl(fgbDatasourceId, { format: "fgb" }),
      {
        bbox: [-180, -15.706455006156576, 180, -14.274583217973047],
      },
    );
    // toJsonFile(featureCollection(feats), "SUB_FIJI_INSIDE_FGB.json");
    expect(feats.length).toEqual(25); // Returns 50 eez features because bbox spans the world
  }, 90000);
});
