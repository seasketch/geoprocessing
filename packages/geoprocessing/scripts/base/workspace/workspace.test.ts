/**
 * @jest-environment node
 * @group e2e
 */

import { verifyWorkspace, genCog } from "./workspace";
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

  describe("Generate cloud-optimized datasets", () => {
    const datasourceId = "quad_10";
    const outId = "workspace_genCog_quad_10";

    beforeEach(() => {
      // Ensure out folder
      fs.mkdirsSync(dstPath);
    });
    test("genCog - can generate and output cog raster", async () => {
      const result = await genCog(
        srcPath,
        dstPath,
        binPath,
        `${datasourceId}.tif`,
        outId,
        1
      );
      expect(result).toBe(true);
      expect(fs.existsSync(path.join(dstPath, `${outId}.tif`)));
    }, 10000);
    afterEach(() => {
      fs.removeSync(path.join(dstPath, `${outId}.tif`));
    });
  });
});
