import { describe, test, expect } from "vitest";
import { overlapFeatures } from "./overlapFeatures.js";
import area from "@turf/area";
import fix from "../testing/fixtures/squareSketches.js";
import sk from "../testing/fixtures/sketches.js";
import { firstMatchingMetric } from "../metrics/index.js";
import { testWithinPerc } from "../testing/index.js";
import { over } from "lodash";
import { Sketch } from "../types/sketch.js";
import { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import fs from "fs-extra";

describe("overlapFeatures", () => {
  test("function is present", () => {
    expect(typeof overlapFeatures).toBe("function");
  });

  test("outerArea", () => {
    expect(fix.outerArea).toBeCloseTo(49447340364.08609);
  });
  test("outerOuterArea", () => {
    expect(fix.outerOuterArea).toBeCloseTo(197668873521.43488);
  });

  test("overlapFeatures - sketch polygon fully inside", async () => {
    const metrics = await overlapFeatures("test", [fix.outer], fix.sketch1);
    expect(metrics[0].value).toBeCloseTo(area(fix.sketch1));
  });

  test("overlapFeatures - sketch polygon fully inside - truncation", async () => {
    const metricsNoTruncation = await overlapFeatures(
      "test",
      [fix.tiny],
      fix.sketch1,
      {
        truncate: false,
      }
    );
    expect(metricsNoTruncation[0].value).toBe(0.012364345868141814);

    const metricsTruncation = await overlapFeatures(
      "test",
      [fix.tiny],
      fix.sketch1,
      {
        truncate: true,
      }
    );
    expect(metricsTruncation[0].value).toBe(0.012364);

    const metricsTruncationDefault = await overlapFeatures(
      "test",
      [fix.tiny],
      fix.sketch1
    );
    expect(metricsTruncationDefault[0].value).toBe(0.012364);
  });

  test("overlapFeatures - sketch multipolygon fully inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.outer],
      fix.sketchMultiPoly1
    );
    expect(metrics[0].value).toBeCloseTo(area(fix.sketchMultiPoly1));
  });

  test("overlapFeatures - multipolygon both arguments", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.sketchMultiPoly1],
      fix.sketchMultiPoly1
    );
    expect(metrics[0].value).toBeCloseTo(area(fix.sketchMultiPoly1));
  });

  test.skip("overlapFeatures - sketch polygon half inside", async () => {
    const metrics = await overlapFeatures("test", [fix.outer], fix.sketch2);
    expect(metrics.length).toEqual(1);
    // overlap should be ~50% of original sketch area
    const areaOf2 = area(fix.sketch2);
    const percDiff = (metrics[0].value / (areaOf2 * 0.5)) % 1;
    expect(percDiff).toBeCloseTo(0);
  });

  test("overlapFeatures - should not count holes", async () => {
    console.log(JSON.stringify(sk.holeBlPoly));
    const metrics = await overlapFeatures(
      "test",
      [sk.wholePoly],
      sk.holeBlPoly
    );

    // 3487699295400.2056 qgis
    // 3473074014471.342  turf

    expect(metrics.length).toEqual(1);
    const wholeArea = area(sk.wholePoly);
    console.log("wholeArea", wholeArea);
    const holeArea = area(sk.holeBlPoly);
    console.log("holeArea", holeArea);
    const overlapArea = metrics[0].value;
    console.log("overlapArea", overlapArea);
    const percDiff = Math.abs(overlapArea - holeArea) / holeArea;
    console.log("percDiff", percDiff);
    expect(percDiff).toBeGreaterThan(0);
    expect(percDiff).toBeLessThan(1);
  });

  test("overlapFeatures - rocky hole", async () => {
    const rockSketch: Sketch<Polygon> = {
      id: 31101,
      bbox: [-121.938805, 36.639385, -121.93787, 36.640285],
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-121.938801828, 36.640264799],
            [-121.938789663, 36.639396058],
            [-121.937877297, 36.639386297],
            [-121.937865132, 36.640284321],
            [-121.938801828, 36.640264799],
          ],
        ],
      },
      properties: {
        id: "31101",
        fid: 1,
        name: "small_square",
        createdAt: "2024-07-01T21:25:21.698968+00:00",
        updatedAt: "2024-07-01T21:25:21.698968+00:00",
        isCollection: false,
        sketchClassId: "492",
        userAttributes: [],
      },
    };

    const rocky: FeatureCollection<MultiPolygon> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [-121.93855676950048, 36.639918179124649],
                  [-121.938488300581682, 36.639935543018694],
                  [-121.938461770614836, 36.639944349179309],
                  [-121.938461699675912, 36.639944372271515],
                  [-121.938434301627566, 36.63995311628026],
                  [-121.938432183377458, 36.639953433890526],
                  [-121.938398041631274, 36.639953183941202],
                  [-121.938398028446272, 36.639953183832176],
                  [-121.938370722921263, 36.63995293225949],
                  [-121.938366067394611, 36.639950854608934],
                  [-121.938351610348917, 36.639932661245233],
                  [-121.938350730816111, 36.639930194010674],
                  [-121.938350960906902, 36.639912271313278],
                  [-121.938350501266441, 36.63989421148861],
                  [-121.93835131850463, 36.639891777773009],
                  [-121.938364857268795, 36.639873935340468],
                  [-121.938366069542553, 36.639872810437616],
                  [-121.938392405838982, 36.639855309586878],
                  [-121.93842541832953, 36.63982001943242],
                  [-121.938426970385379, 36.639818885702518],
                  [-121.938480743480881, 36.63979243037528],
                  [-121.938507291217661, 36.63977489949994],
                  [-121.938512174134544, 36.639774004414512],
                  [-121.938560406306479, 36.639783459646779],
                  [-121.938563225761158, 36.639784807074577],
                  [-121.93858378564812, 36.639803010837049],
                  [-121.938584376988402, 36.639803636480949],
                  [-121.938605716427659, 36.639830858376605],
                  [-121.938606491409118, 36.639834043203606],
                  [-121.938600524252294, 36.63986101359383],
                  [-121.938600481574539, 36.639861186710149],
                  [-121.938593139448088, 36.639888179690686],
                  [-121.938591665043376, 36.639890370700314],
                  [-121.938559080005049, 36.639917040464454],
                  [-121.93855676950048, 36.639918179124649],
                ],
                [
                  [-121.938582542908492, 36.639884992651155],
                  [-121.938589517197116, 36.639859352022071],
                  [-121.938595086178566, 36.639834181324169],
                  [-121.93857516222036, 36.639808765098344],
                  [-121.938556084948203, 36.639791874044462],
                  [-121.938512239391102, 36.639783278745945],
                  [-121.938487554516044, 36.639799579475458],
                  [-121.938486923194205, 36.639799940597385],
                  [-121.938433729410733, 36.639826110915664],
                  [-121.938400960877402, 36.639861140284992],
                  [-121.938400053472719, 36.639861904063103],
                  [-121.938373930831929, 36.639879262937932],
                  [-121.938361731463104, 36.63989534021426],
                  [-121.938362159458038, 36.6399121565507],
                  [-121.938362160330499, 36.63991229492045],
                  [-121.938361946540866, 36.639928948044329],
                  [-121.938373878057206, 36.639943963171945],
                  [-121.938398150270999, 36.639944186797678],
                  [-121.938431187539265, 36.63994442866133],
                  [-121.938457529648815, 36.639936021652375],
                  [-121.938484247008802, 36.63992715328996],
                  [-121.938484699627054, 36.639927021055541],
                  [-121.938552066369596, 36.639909936676851],
                  [-121.938582542908492, 36.639884992651155],
                ],
              ],
            ],
          },
        },
      ],
    };

    const rockyArea = area(rocky);
    console.log("rockyArea", rockyArea);

    const metrics = await overlapFeatures("test", rocky.features, rockSketch);

    const overlapArea = metrics[0].value;
    console.log("overlapArea", overlapArea);

    expect(metrics.length).toEqual(1);
  });

  test("overlapFeatures - sketch polygon fully outside", async () => {
    const metrics = await overlapFeatures("test", [fix.outer], fix.sketch3);
    expect(metrics.length).toEqual(1);
    expect(metrics[0].value).toBe(0);
  });

  test("overlapFeatures - mixed poly sketch collection fully inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.outer],
      fix.mixedPolySketchCollection
    );
    expect(metrics.length).toBe(3);
    const ids = [
      fix.mixedCollectionId,
      ...fix.mixedPolySketchCollection.features.map((sk) => sk.properties.id),
    ];
    const areas = [
      area(fix.mixedPolySketchCollection),
      ...fix.mixedPolySketchCollection.features.map((sk) => area(sk)),
    ];
    const percs = [0.5, 1, 1]; // the poly and multipoly overlap 100% so overlapFeatures area should be half
    ids.forEach((curSketchId, index) => {
      // console.log("index", index);
      testWithinPerc(
        firstMatchingMetric(metrics, (m) => m.sketchId === curSketchId).value,
        areas[index] * percs[index]
      );
    });
  });

  test("overlapFeatures - sketch collection two inside polys SUM", async () => {
    // Two sketches in sketch collection, both within feature.
    // Individual sketches and sketch collection metrics should all list 1 as sum
    // Tests that features aren't being double counted.

    const metrics = await overlapFeatures(
      "test",
      [sk.outer],
      sk.twoPolyInsideSC,
      { operation: "sum" }
    );
    expect(metrics.length).toBe(3);
    metrics.forEach((metric) => {
      expect(metric.value).toBe(1);
    });
  });

  test("overlapFeatures - sketch collection half inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.outer],
      fix.sketchCollection
    );
    expect(metrics.length).toBe(4);
    const ids = [
      fix.collectionId,
      ...fix.sketchCollection.features.map((sk) => sk.properties.id),
    ];
    const areas = [
      area(fix.sketchCollection),
      ...fix.sketchCollection.features.map((sk) => area(sk)),
    ];
    const percs = [0.5, 1, 0.5, 0]; // expected percentage of sketch to overlap
    ids.forEach((curSketchId, index) => {
      testWithinPerc(
        firstMatchingMetric(metrics, (m) => m.sketchId === curSketchId).value,
        areas[index] * percs[index],
        { debug: true }
      );
    });
  });

  /**
   * Zero polygon geometry sketch is generated by functions like clipToGeography in place of creating a null geometry
   * sketh, because turf and other libraries types don't handle null geometry well. With
   * a null geometry, toolbox functions will see that it has no overlap with any sketches (unless planning is occuring on null island)
   */
  test("overlapFeatures - test that zero geometry sketch returns zero value metric", async () => {
    const metrics = await overlapFeatures("test", [sk.topRightPoly], sk.zero, {
      operation: "area",
    });
    expect(metrics.length).toBe(1);
    metrics.forEach((metric) => {
      expect(metric.value).toBe(0);
    });
  });
});
