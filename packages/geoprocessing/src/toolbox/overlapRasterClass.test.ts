/**
 * @jest-environment node
 * @group unit
 */
import { Polygon, MultiPolygon, Sketch, SketchCollection } from "../types";
import { genSampleSketch } from "../helpers";
import parseGeoraster from "georaster";
import { overlapRasterClass } from "./overlapRasterClass";
import { DataClass } from "../types";
import { classIdMapping } from "../datasources";
import bbox from "@turf/bbox";
import { featureCollection } from "@turf/helpers";
import fix from "../testing/fixtures/sketches";

// bbox  - [xmin, ymin, xmax, ymax]
// pixel - [left, bottom, right, top]

const bottomLeftPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [2, 2],
      [2, 8],
      [8, 8],
      [8, 2],
      [2, 2],
    ],
  ],
});

const bottomRightPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [12, 2],
      [12, 8],
      [18, 8],
      [18, 2],
      [12, 2],
    ],
  ],
});

const topRightPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [12, 12],
      [12, 18],
      [18, 18],
      [18, 12],
      [12, 12],
    ],
  ],
});

const multiPoly1: Sketch<MultiPolygon> = genSampleSketch({
  type: "MultiPolygon",
  coordinates: [topRightPoly.geometry.coordinates],
});

const multiPoly2: Sketch<MultiPolygon> = genSampleSketch({
  type: "MultiPolygon",
  coordinates: [
    topRightPoly.geometry.coordinates,
    bottomRightPoly.geometry.coordinates,
  ],
});

const mixedCollectionId = "MMMM";
const mixedPolySketchCollection: SketchCollection<Polygon | MultiPolygon> = {
  type: "FeatureCollection",
  properties: {
    id: mixedCollectionId,
    name: "Collection 1",
    updatedAt: "2021-11-20T00:00:34.269Z",
    createdAt: "2021-11-19T23:34:12.889Z",
    sketchClassId: "615b65a2aac8c8285d50d9f3",
    isCollection: true,
    userAttributes: [],
  },
  bbox: bbox(
    featureCollection<Polygon | MultiPolygon>([bottomRightPoly, multiPoly1])
  ),
  features: [bottomRightPoly, multiPoly1],
};

const overlappingPolySketchCollection: SketchCollection<
  Polygon | MultiPolygon
> = {
  type: "FeatureCollection",
  properties: {
    id: mixedCollectionId,
    name: "Collection 1",
    updatedAt: "2021-11-20T00:00:34.269Z",
    createdAt: "2021-11-19T23:34:12.889Z",
    sketchClassId: "615b65a2aac8c8285d50d9f3",
    isCollection: true,
    userAttributes: [],
  },
  bbox: bbox(
    featureCollection<Polygon | MultiPolygon>([topRightPoly, multiPoly1])
  ),
  features: [topRightPoly, multiPoly1],
};

// Multi-class raster (categorical)
const classes: DataClass[] = Array.from({ length: 2 }, (v, i) => ({
  numericClassId: i + 1,
  classId: `${i + 1}`,
  display: `Group ${i + 1}`,
}));

describe("overlapRasterClass test", () => {
  test("overlapRasterClass - undefined sketch should return class sum for whole raster", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await overlapRasterClass(
      "test",
      raster,
      undefined,
      classIdMapping(classes)
    );
    // only cell in polygon should have been nodata in bottom left
    expect(metrics.length).toBe(2);
    expect(metrics[0].sketchId).toBe(null);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(2);

    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].sketchId).toBe(null);
    expect(metrics[1].value).toBe(1);
  });

  test("overlapRasterClass - can assign categories to alternate metric dimension", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await overlapRasterClass(
      "test",
      raster,
      undefined,
      classIdMapping(classes),
      "groupId"
    );
    expect(metrics.length).toBe(2);
    expect(metrics[0].sketchId).toBe(null);
    expect(metrics[0].groupId).toBe("1");
    expect(metrics[0].value).toBe(2);
  });

  test("overlapRasterClass - single polygon sketch bottom left", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await overlapRasterClass(
      "test",
      raster,
      bottomLeftPoly,
      classIdMapping(classes)
    );
    // only cell in polygon should have been nodata in bottom left
    expect(metrics.length).toBe(2);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(0);
    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].value).toBe(0);
  });

  test("overlapRasterClass - single polygon sketch top right", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await overlapRasterClass(
      "test",
      raster,
      topRightPoly,
      classIdMapping(classes)
    );
    expect(metrics.length).toBe(2);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(0);
    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].value).toBe(1);
  });

  test("overlapRasterClass - single polygon sketch bottom right", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await overlapRasterClass(
      "test",
      raster,
      bottomRightPoly,
      classIdMapping(classes)
    );
    expect(metrics.length).toBe(2);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(1);
    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].value).toBe(0);
  });

  // multipoly test
  test("overlapRasterClass - multi polygon top and bottom right", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const metrics = await overlapRasterClass(
      "test",
      raster,
      multiPoly2,
      classIdMapping(classes)
    );
    expect(metrics.length).toBe(2);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(1);
    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].value).toBe(1);
  });

  // multipoly test
  test("overlapRasterClass - poly and multi polygon top and bottom right", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const metrics = await overlapRasterClass(
      "test",
      raster,
      multiPoly2,
      classIdMapping(classes)
    );
    expect(metrics.length).toBe(2);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(1);
    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].value).toBe(1);
  });

  test("overlapRasterClass - mixed collection", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const metrics = await overlapRasterClass(
      "test",
      raster,
      mixedPolySketchCollection,
      classIdMapping(classes)
    );
    expect(metrics.length).toBe(6);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(1);
    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].value).toBe(0);
    expect(metrics[2].classId).toBe("1");
    expect(metrics[2].value).toBe(0);
    expect(metrics[3].classId).toBe("2");
    expect(metrics[3].value).toBe(1);
    expect(metrics[4].classId).toBe("1");
    expect(metrics[4].value).toBe(1);
    expect(metrics[5].classId).toBe("2");
    expect(metrics[5].value).toBe(1);
  });

  // multipoly test
  test("overlapRasterClass - overlapping mixed collect", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const metrics = await overlapRasterClass(
      "test",
      raster,
      overlappingPolySketchCollection,
      classIdMapping(classes)
    );
    expect(metrics.length).toBe(6);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(0);
    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].value).toBe(1);
    expect(metrics[2].classId).toBe("1");
    expect(metrics[2].value).toBe(0);
    expect(metrics[3].classId).toBe("2");
    expect(metrics[3].value).toBe(1);
    expect(metrics[4].classId).toBe("1");
    expect(metrics[4].value).toBe(0);
    expect(metrics[5].classId).toBe("2");
    expect(metrics[5].value).toBe(1); // collection should not double count class 2
  });

  test("overlapRasterClass - should handle multiple holes in collection", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [1, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const metrics = await overlapRasterClass(
      "test",
      raster,
      fix.holeMixedSC,
      classIdMapping(classes)
    );
    // Remember
    expect(metrics.length).toBe(6);
    expect(metrics[0].classId).toBe("1");
    expect(metrics[0].value).toBe(2); // hole covered bottom left 1
    expect(metrics[1].classId).toBe("2");
    expect(metrics[1].value).toBe(1);
    expect(metrics[2].classId).toBe("1");
    expect(metrics[2].value).toBe(3); // hole covered top right 1
    expect(metrics[3].classId).toBe("2");
    expect(metrics[3].value).toBe(0);
    // collection together should cancel holes
    expect(metrics[4].classId).toBe("1");
    expect(metrics[4].value).toBe(3);
    expect(metrics[5].classId).toBe("2");
    expect(metrics[5].value).toBe(1);
  });
});
