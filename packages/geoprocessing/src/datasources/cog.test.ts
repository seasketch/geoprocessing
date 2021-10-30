/**
 * @jest-environment node
 * @group e2e
 */
import { genSampleSketch } from "../helpers";
import { loadCogWindow } from "./cog";

describe("COG test", () => {
  test("window box smaller than and within pixel should work properly", async () => {
    const url = "http://127.0.0.1:8080/feature_abyssopelagic_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: [
        -64.98190014112853, 32.28094566811551, -64.93314831007392,
        32.328245479189846,
      ],
    });
    expect(raster).toBeTruthy();
    expect(raster.values.length).toBeGreaterThan(0);
  });
});
