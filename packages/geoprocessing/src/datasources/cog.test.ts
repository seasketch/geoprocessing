/**
 * @jest-environment node
 * @group e2e
 */
import { loadCogWindow } from "./cog";
import { Feature, Polygon } from "../types";
// @ts-ignore
import geoblaze from "geoblaze";

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

  test("window box 2 smaller than and within pixel should work properly", async () => {
    const url = "http://127.0.0.1:8080/feature_abyssopelagic_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: [
        -64.86625596136682, 32.20595207620439, -64.76875229925741,
        32.250097107343166,
      ],
    });
    expect(raster).toBeTruthy();
    expect(raster.values.length).toBeGreaterThan(0);
  });

  test("window box 3 smaller than and within pixel should work properly", async () => {
    const feature: Feature<Polygon> = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.98190014112853, 32.28094566811551],
            [-64.97915355909728, 32.328245479189846],
            [-64.93314831007392, 32.32186289702012],
            [-64.94207470167548, 32.281816439778545],
            [-64.98190014112853, 32.28094566811551],
          ],
        ],
        bbox: [
          -64.98190014112853, 32.28094566811551, -64.93314831007392,
          32.328245479189846,
        ],
      },
      properties: {},
      id: "1",
      bbox: [
        -64.98190014112853, 32.28094566811551, -64.93314831007392,
        32.328245479189846,
      ],
    };

    const url = "http://127.0.0.1:8080/Bathypelagic1_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: feature.bbox,
    });

    const sum = geoblaze.sum(raster, feature);

    expect(raster.pixelHeight).toBe(0.07777950326934817);
    expect(raster.pixelWidth).toBe(0.07777950326934817);
    expect(raster.values.length).toBe(1);
    expect(raster.values[0][0].length).toBe(2);
    expect(raster.values[0][1].length).toBe(2);
    expect(raster.values[0][0][0]).toBe(1);
    expect(raster.values[0][0][1]).toBe(-3.3999999521443642e38);
    expect(raster.values[0][1][0]).toBe(-3.3999999521443642e38);
    expect(raster.values[0][1][1]).toBe(-3.3999999521443642e38);
    expect(sum[0]).toBe(0); // feature should only overlap nodata cells, the 1 value should not get picked up
  });
});
