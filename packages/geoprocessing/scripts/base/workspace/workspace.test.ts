/**
 * @jest-environment node
 * @group scripts/e2e
 */

import { verifyWorkspace, genCog, genFgb, genGeojson } from "./workspace";
import fs from "fs-extra";
import path from "path";

const srcPath = "data/testing";
const dstPath = "data/testing/output";
const binPath = "data/bin";

describe("Docker", () => {
  beforeEach(() => {});
  test("verifyWorkspace - should return true if Docker running", async () => {
    const result = await verifyWorkspace();
    expect(result).toBe(true);
  }, 10000);
  afterEach(() => {});

  describe("Generate cloud-optimized raster datasets", () => {
    const datasourceId = "quad_10";
    const outId = "workspace_genCog_quad_10";

    beforeEach(() => {
      // Ensure out folder
      fs.mkdirsSync(dstPath);
    });
    test("genCog - can generate and output cog raster", async () => {
      const result = await genCog(
        {
          geo_type: "raster",
          src: path.join(srcPath, `${datasourceId}.tif`),
          datasourceId,
          formats: [],
          noDataValue: 0,
          band: 1,
          measurementType: "quantitative",
        },
        binPath,
        dstPath,
        1
      );
      expect(result).toBe(true);
      expect(fs.existsSync(path.join(dstPath, `${outId}.tif`)));
    }, 10000);
    afterEach(() => {
      fs.removeSync(path.join(dstPath, `${outId}.tif`));
    });
  });

  describe("Generate cloud-optimized vector datasets", () => {
    const datasourceId = "deepwater_bioregions";
    const outId = "workspace_genFgb_bioregions";

    beforeEach(() => {
      // Ensure out folder
      fs.mkdirsSync(dstPath);
    });
    test("genFgb - can generate and output flatgeobuf file", async () => {
      const result = await genFgb(
        {
          geo_type: "vector",
          src: path.join(srcPath, `${datasourceId}.json`),
          datasourceId,
          layerName: "deepwater_bioregions",
          classKeys: [],
          formats: [],
          propertiesToKeep: [],
        },
        binPath,
        dstPath
      );
      expect(result).toBe(true);
      expect(fs.existsSync(path.join(dstPath, `${outId}.fgb`)));
    }, 10000);

    test("genGeojson - can generate and output geojson file", async () => {
      const result = await genGeojson(
        {
          geo_type: "vector",
          src: path.join(srcPath, `${datasourceId}.json`),
          datasourceId,
          layerName: "deepwater_bioregions",
          classKeys: [],
          formats: [],
          propertiesToKeep: [],
        },
        binPath,
        dstPath
      );
      expect(result).toBe(true);
      expect(fs.existsSync(path.join(dstPath, `${outId}.json`)));
    }, 10000);
    afterEach(() => {
      fs.removeSync(path.join(dstPath, `${outId}.fgb`));
    });
  });
});
