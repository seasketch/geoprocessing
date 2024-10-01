import { describe, test } from "vitest";
import { rasterMetrics } from "./rasterMetrics.js";
import geoblaze from "geoblaze";
import { MultiPolygon, Polygon, SketchCollection } from "../types/index.js";

describe("rasterMetrics", () => {
  test("rasterMetrics - special", async () => {
    const url = "http://127.0.0.1:8080/data/in/all_commercial_fishing_ous.tif";
    const raster = await geoblaze.parse(url);

    const sketch: SketchCollection<MultiPolygon | Polygon> = {
      type: "FeatureCollection",
      features: [
        {
          id: 17_853,
          bbox: [-25.110_502, 36.934_42, -24.901_377, 37.090_153],
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-25.110_501_923, 37.082_653_473],
                [-25.103_452_752, 37.026_396_695],
                [-24.988_316_3, 37.024_520_751],
                [-24.969_518_512, 36.934_420_97],
                [-24.901_376_53, 36.966_343_51],
                [-24.988_316_3, 37.090_151_225],
                [-25.110_501_923, 37.082_653_473],
              ],
            ],
          },
          properties: {
            id: "17853",
            name: "santamaria",
            island: ["SANTA_MARIA"],
            postId: null,
            userId: "531",
            userSlug: "Abby",
            createdAt: "2023-08-03T23:24:22.925443+00:00",
            updatedAt: "2023-08-03T23:24:30.60074+00:00",
            designation: "HIGHLY_PROTECTED",
            collectionId: "17851",
            isCollection: false,
            sharedInForum: false,
            sketchClassId: "212",
            userAttributes: [],
          },
        },
        {
          id: 17_852,
          bbox: [-25.370_367, 37.873_585, -25.242_638, 37.932_014],
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-25.370_367_244, 37.875_047_844],
                [-25.242_638_29, 37.873_586_626],
                [-25.270_405_454, 37.932_012_737],
                [-25.364_813_811, 37.929_092_533],
                [-25.370_367_244, 37.875_047_844],
              ],
            ],
          },
          properties: {
            id: "17852",
            name: "saomiguel",
            island: ["SAO_MIGUEL"],
            postId: null,
            userId: "531",
            userSlug: "Abby",
            createdAt: "2023-08-03T23:24:04.132735+00:00",
            updatedAt: "2023-08-03T23:24:36.079995+00:00",
            designation: "FULLY_PROTECTED",
            collectionId: "17851",
            isCollection: false,
            sharedInForum: false,
            sketchClassId: "212",
            userAttributes: [],
          },
        },
      ],
      bbox: [-25.110_502, 36.934_42, -24.901_377, 37.090_153],
      properties: {
        id: "17851",
        name: "2island",
        postId: null,
        userId: "531",
        userSlug: "Abby",
        createdAt: "2023-08-03T23:23:31.444221+00:00",
        updatedAt: "2023-08-03T23:24:36.079995+00:00",
        collectionId: null,
        isCollection: true,
        sharedInForum: false,
        sketchClassId: "213",
        userAttributes: [],
      },
    };

    await rasterMetrics(raster, { feature: sketch });
    // console.log(JSON.stringify(metrics, null, 2));
  }, 10_000);

  test("rasterMetrics - all fishing", async () => {
    const url = "http://127.0.0.1:8080/data/in/all-fishing.tif";
    const raster = await geoblaze.parse(url);

    const sketch: SketchCollection<MultiPolygon | Polygon> = {
      type: "FeatureCollection",
      features: [
        {
          id: 17_853,
          bbox: [-25.110_502, 36.934_42, -24.901_377, 37.090_153],
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-25.110_501_923, 37.082_653_473],
                [-25.103_452_752, 37.026_396_695],
                [-24.988_316_3, 37.024_520_751],
                [-24.969_518_512, 36.934_420_97],
                [-24.901_376_53, 36.966_343_51],
                [-24.988_316_3, 37.090_151_225],
                [-25.110_501_923, 37.082_653_473],
              ],
            ],
          },
          properties: {
            id: "17853",
            name: "santamaria",
            island: ["SANTA_MARIA"],
            postId: null,
            userId: "531",
            userSlug: "Abby",
            createdAt: "2023-08-03T23:24:22.925443+00:00",
            updatedAt: "2023-08-03T23:24:30.60074+00:00",
            designation: "HIGHLY_PROTECTED",
            collectionId: "17851",
            isCollection: false,
            sharedInForum: false,
            sketchClassId: "212",
            userAttributes: [],
          },
        },
        {
          id: 17_852,
          bbox: [-25.370_367, 37.873_585, -25.242_638, 37.932_014],
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-25.370_367_244, 37.875_047_844],
                [-25.242_638_29, 37.873_586_626],
                [-25.270_405_454, 37.932_012_737],
                [-25.364_813_811, 37.929_092_533],
                [-25.370_367_244, 37.875_047_844],
              ],
            ],
          },
          properties: {
            id: "17852",
            name: "saomiguel",
            island: ["SAO_MIGUEL"],
            postId: null,
            userId: "531",
            userSlug: "Abby",
            createdAt: "2023-08-03T23:24:04.132735+00:00",
            updatedAt: "2023-08-03T23:24:36.079995+00:00",
            designation: "FULLY_PROTECTED",
            collectionId: "17851",
            isCollection: false,
            sharedInForum: false,
            sketchClassId: "212",
            userAttributes: [],
          },
        },
      ],
      bbox: [-25.110_502, 36.934_42, -24.901_377, 37.090_153],
      properties: {
        id: "17851",
        name: "2island",
        postId: null,
        userId: "531",
        userSlug: "Abby",
        createdAt: "2023-08-03T23:23:31.444221+00:00",
        updatedAt: "2023-08-03T23:24:36.079995+00:00",
        collectionId: null,
        isCollection: true,
        sharedInForum: false,
        sketchClassId: "213",
        userAttributes: [],
      },
    };

    await rasterMetrics(raster, { feature: sketch });
    // console.log(JSON.stringify(metrics, null, 2));
  }, 10_000);
});
