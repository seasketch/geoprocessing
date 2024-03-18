/**
 * @vitest-environment node
 * @group e2e
 */
import { describe, test, expect } from "vitest";
import { rasterMetrics } from "./rasterMetrics.js";
//@ts-ignore
import geoblaze from "geoblaze";
import {
  MultiPolygon,
  Polygon,
  Sketch,
  SketchCollection,
} from "../types/index.js";

describe("rasterMetrics", () => {
  test("rasterMetrics - special", async () => {
    const url = "http://127.0.0.1:8080/data/in/all_commercial_fishing_ous.tif";
    const raster = await geoblaze.parse(url);

    const sketch: SketchCollection<MultiPolygon | Polygon> = {
      type: "FeatureCollection",
      features: [
        {
          id: 17853,
          bbox: [-25.110502, 36.93442, -24.901377, 37.090153],
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-25.110501923, 37.082653473],
                [-25.103452752, 37.026396695],
                [-24.9883163, 37.024520751],
                [-24.969518512, 36.93442097],
                [-24.90137653, 36.96634351],
                [-24.9883163, 37.090151225],
                [-25.110501923, 37.082653473],
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
          id: 17852,
          bbox: [-25.370367, 37.873585, -25.242638, 37.932014],
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-25.370367244, 37.875047844],
                [-25.24263829, 37.873586626],
                [-25.270405454, 37.932012737],
                [-25.364813811, 37.929092533],
                [-25.370367244, 37.875047844],
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
      bbox: [-25.110502, 36.93442, -24.901377, 37.090153],
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

    const metrics = await rasterMetrics(raster, { feature: sketch });
    // console.log(JSON.stringify(metrics, null, 2));
  });

  test("rasterMetrics - all fishing", async () => {
    const url = "http://127.0.0.1:8080/data/in/all-fishing.tif";
    const raster = await geoblaze.parse(url);

    const sketch: SketchCollection<MultiPolygon | Polygon> = {
      type: "FeatureCollection",
      features: [
        {
          id: 17853,
          bbox: [-25.110502, 36.93442, -24.901377, 37.090153],
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-25.110501923, 37.082653473],
                [-25.103452752, 37.026396695],
                [-24.9883163, 37.024520751],
                [-24.969518512, 36.93442097],
                [-24.90137653, 36.96634351],
                [-24.9883163, 37.090151225],
                [-25.110501923, 37.082653473],
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
          id: 17852,
          bbox: [-25.370367, 37.873585, -25.242638, 37.932014],
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-25.370367244, 37.875047844],
                [-25.24263829, 37.873586626],
                [-25.270405454, 37.932012737],
                [-25.364813811, 37.929092533],
                [-25.370367244, 37.875047844],
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
      bbox: [-25.110502, 36.93442, -24.901377, 37.090153],
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

    const metrics = await rasterMetrics(raster, { feature: sketch });
    console.log(JSON.stringify(metrics, null, 2));
  });
});
