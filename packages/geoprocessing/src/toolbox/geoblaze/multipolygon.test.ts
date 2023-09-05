/**
 * @jest-environment node
 * @group e2e
 */

// @ts-ignore
import geoblaze from "geoblaze";
import parseGeoraster from "georaster";

describe("geoblaze multipolygon tests", () => {
  test("simple in-memory raster unit test", async () => {
    //  Raster   whole   2polygon & multipolygon
    //           _____            _____
    //  [1,1]   |     |          |  |  |
    //  [1,1]   |_____|          |__|__|
    //

    const raster = await parseGeoraster(
      [
        [
          [1, 1],
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

    const whole = {
      type: "Polygon",
      coordinates: [
        [
          [1, 1],
          [1, 19],
          [19, 19],
          [19, 1],
          [1, 1],
        ],
      ],
    };

    const collection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [1, 19],
                [11, 19],
                [11, 1],
                [1, 1],
                [1, 19],
              ],
            ],
            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [11, 19],
                [19, 19],
                [19, 1],
                [11, 1],
                [11, 19],
              ],
            ],
            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [1, 19],
              [11, 19],
              [11, 1],
              [1, 1],
              [1, 19],
            ],
          ],
          [
            [
              [11, 19],
              [19, 19],
              [19, 1],
              [11, 1],
              [11, 19],
            ],
          ],
        ],
      },
    };

    const wholeSum = geoblaze.sum(raster, whole);
    const singlepart = geoblaze.sum(raster, collection);
    const multipart = geoblaze.sum(raster, multipolygon);

    expect(
      wholeSum[0] === 4 && singlepart[0] === 4 && multipart[0] === 4
    ).toBeTruthy();
  });

  test("geoblaze - compares multipolygon sum with polygon collection sum (joined edge)", async () => {
    // Theoretically, multipolygons shouldn't share edges, but if they're made manually it might be possible
    const url = "http://127.0.0.1:8080/in/feature_abyssopelagic_cog.tif";
    const raster = await geoblaze.parse(url);

    const whole = {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [-67.86548213174478, 33.770041401853305],
            [-66.59556949691553, 31.222453169005036],
            [-65.98033231979333, 33.210904649209],
            [-65.39664576713909, 35.80391270692117],
            [-67.86548213174478, 33.770041401853305],
          ],
        ],
        type: "Polygon",
      },
    };

    const featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-67.86548213174478, 33.770041401853305],
                [-65.98033231979333, 33.210904649209],
                [-65.39664576713909, 35.80391270692117],
                [-67.86548213174478, 33.770041401853305],
              ],
            ],
            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-67.86548213174478, 33.770041401853305],
                [-66.59556949691553, 31.222453169005036],
                [-65.98033231979333, 33.210904649209],
                [-67.86548213174478, 33.770041401853305],
              ],
            ],
            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-67.86548213174478, 33.770041401853305],
              [-65.98033231979333, 33.210904649209],
              [-66.59556949691553, 31.222453169005036],
              [-67.86548213174478, 33.770041401853305],
            ],
          ],
          [
            [
              [-67.86548213174478, 33.770041401853305],
              [-65.39664576713909, 35.80391270692117],
              [-65.98033231979333, 33.210904649209],
              [-67.86548213174478, 33.770041401853305],
            ],
          ],
        ],
      },
    };

    const wholeSum = await geoblaze.sum(raster, whole);
    const singlepart = await geoblaze.sum(raster, featureCollection);
    const multipart = await geoblaze.sum(raster, multipolygon);

    // Expect the whole feature's sum to be equal to the sum of the 2 polygons
    // and the sume of the multipolygon
    expect(
      wholeSum[0] === multipart[0] && multipart[0] === singlepart[0]
    ).toBeTruthy();
  });

  test("geoblaze - compares multipolygon sum with polygon collection sum (no joined edge)", async () => {
    const url = "http://127.0.0.1:8080/in/feature_abyssopelagic_cog.tif";
    const raster = await geoblaze.parse(url);

    const featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-63.90176969402023, 34.92136482552985],
                [-63.447775851182215, 34.391324267381975],
                [-64.06031498843957, 33.9948800218461],
                [-64.35703941419384, 34.56398728233894],
                [-63.90176969402023, 34.92136482552985],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.21155520840662, 34.88568983762421],
                [-67.66171977631797, 34.08188318255097],
                [-66.64655816276613, 33.029451874561474],
                [-65.31360888370416, 34.10146532497224],
                [-66.21155520840662, 34.88568983762421],
              ],
            ],

            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-63.90176969402023, 34.92136482552985],
              [-63.447775851182215, 34.391324267381975],
              [-64.06031498843957, 33.9948800218461],
              [-64.35703941419384, 34.56398728233894],
              [-63.90176969402023, 34.92136482552985],
            ],
          ],
          [
            [
              [-66.21155520840662, 34.88568983762421],
              [-67.66171977631797, 34.08188318255097],
              [-66.64655816276613, 33.029451874561474],
              [-65.31360888370416, 34.10146532497224],
              [-66.21155520840662, 34.88568983762421],
            ],
          ],
        ],
      },
    };

    const singlepart = await geoblaze.sum(raster, featureCollection);
    const multipart = await geoblaze.sum(raster, multipolygon);

    // Expect the sum of the 2 polygons to be the same as the sum of the multipolygon
    expect(singlepart[0] === multipart[0]).toBeTruthy();
  });

  test("geoblaze - compares multipolygon sum with polygon collection sum (full overlap)", async () => {
    // Theoretically, multipolygons shouldn't overlap, but if they're made manually it might be possible
    const url = "http://127.0.0.1:8080/in/feature_abyssopelagic_cog.tif";
    const raster = await geoblaze.parse(url);

    const whole = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-66.40706491136844, 34.283527126524476],
            [-66.40706491136844, 33.573959204981506],
            [-64.00596222328186, 33.58309357612872],
            [-64.038854040927, 34.34691666832026],
            [-66.40706491136844, 34.283527126524476],
          ],
        ],
      },
    };

    const featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.40706491136844, 34.283527126524476],
                [-66.40706491136844, 33.573959204981506],
                [-64.00596222328186, 33.58309357612872],
                [-64.038854040927, 34.34691666832026],
                [-66.40706491136844, 34.283527126524476],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.40706491136844, 34.283527126524476],
                [-66.40706491136844, 33.573959204981506],
                [-64.00596222328186, 33.58309357612872],
                [-64.038854040927, 34.34691666832026],
                [-66.40706491136844, 34.283527126524476],
              ],
            ],

            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-66.40706491136844, 34.283527126524476],
              [-66.40706491136844, 33.573959204981506],
              [-64.00596222328186, 33.58309357612872],
              [-64.038854040927, 34.34691666832026],
              [-66.40706491136844, 34.283527126524476],
            ],
          ],
          [
            [
              [-66.40706491136844, 34.283527126524476],
              [-66.40706491136844, 33.573959204981506],
              [-64.00596222328186, 33.58309357612872],
              [-64.038854040927, 34.34691666832026],
              [-66.40706491136844, 34.283527126524476],
            ],
          ],
        ],
      },
    };

    const mixedColl = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.40706491136844, 34.283527126524476],
                [-66.40706491136844, 33.573959204981506],
                [-64.00596222328186, 33.58309357612872],
                [-64.038854040927, 34.34691666832026],
                [-66.40706491136844, 34.283527126524476],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [
                  [-66.40706491136844, 34.283527126524476],
                  [-66.40706491136844, 33.573959204981506],
                  [-64.00596222328186, 33.58309357612872],
                  [-64.038854040927, 34.34691666832026],
                  [-66.40706491136844, 34.283527126524476],
                ],
              ],
            ],

            type: "MultiPolygon",
          },
        },
      ],
    };

    const wholeSum = await geoblaze.sum(raster, whole);
    const singleColl = await geoblaze.sum(raster, featureCollection);
    const multipart = await geoblaze.sum(raster, multipolygon);
    const mixedCollSum = await geoblaze.sum(raster, mixedColl);

    // Expect the sum of the whole feature to be the same as the sum of
    // two fully overlapping polygons (the overlap should not be counted twice)
    // and the sum of a multipolygon with two parts which fully overlap
    // (the overlap should not be counted twice)
    expect(
      wholeSum[0] === singleColl[0] &&
        singleColl[0] === multipart[0] &&
        multipart[0] === mixedCollSum[0]
    ).toBeTruthy();
  });

  test("geoblaze - compares multipolygon sum with polygon collection sum (partial overlap)", async () => {
    // Theoretically, multipolygons shouldn't overlap, but if they're made manually it might be possible
    const url = "http://127.0.0.1:8080/in/feature_abyssopelagic_cog.tif";
    const raster = await geoblaze.parse(url);

    const whole = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-66.40706491136844, 34.283527126524476],
            [-66.40706491136844, 33.573959204981506],
            [-64.00596222328186, 33.58309357612872],
            [-64.038854040927, 34.34691666832026],
            [-66.40706491136844, 34.283527126524476],
          ],
        ],
      },
    };

    const featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-65.81501219375808, 34.299374511973426],
                [-65.20651356732515, 33.57852639055511],
                [-64.00596222328186, 33.58309357612872],
                [-64.038854040927, 34.34691666832026],
                [-65.22295947614772, 34.31522189742237],
                [-65.81501219375808, 34.299374511973426],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.40706491136844, 34.283527126524476],
                [-66.40706491136844, 33.573959204981506],
                [-65.20651356732515, 33.57852639055511],
                [-64.60623789530351, 33.580809983341915],
                [-65.22295947614772, 34.31522189742237],
                [-65.81501219375808, 34.299374511973426],
                [-66.40706491136844, 34.283527126524476],
              ],
            ],

            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-65.81501219375808, 34.299374511973426],
              [-65.20651356732515, 33.57852639055511],
              [-64.00596222328186, 33.58309357612872],
              [-64.038854040927, 34.34691666832026],
              [-65.22295947614772, 34.31522189742237],
              [-65.81501219375808, 34.299374511973426],
            ],
          ],
          [
            [
              [-66.40706491136844, 34.283527126524476],
              [-66.40706491136844, 33.573959204981506],
              [-65.20651356732515, 33.57852639055511],
              [-64.60623789530351, 33.580809983341915],
              [-65.22295947614772, 34.31522189742237],
              [-65.81501219375808, 34.299374511973426],
              [-66.40706491136844, 34.283527126524476],
            ],
          ],
        ],
      },
    };

    const wholeSum = await geoblaze.sum(raster, whole);
    const singlepart = await geoblaze.sum(raster, featureCollection);
    const multipart = await geoblaze.sum(raster, multipolygon);

    // Expect the sum of the whole feature to be the same as the sum of
    // two partially overlapping polygons (the overlap should not be counted twice)
    // and the sum of a multipolygon with two parts which partially overlap
    // (the overlap should not be counted twice)
    expect(
      wholeSum[0] === singlepart[0] && singlepart[0] === multipart[0]
    ).toBeTruthy();
  });

  test("unit test across dateline and equator", async () => {
    //  Raster   whole   2polygon & multipolygon
    //           _____            _____
    //  [1,1]   |     |          |_____|
    //  [1,1]   |_____|          |_____|
    //

    const raster = await parseGeoraster(
      [
        [
          [1, 1],
          [1, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: -10, // left
        ymax: 10, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const whole = {
      type: "Polygon",
      coordinates: [
        [
          [-9, 9],
          [9, 9],
          [9, -9],
          [-9, -9],
          [-9, 9],
        ],
      ],
    };

    const collection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-9, 9],
                [9, 9],
                [9, -1],
                [-9, -1],
                [-9, 9],
              ],
            ],
            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-9, 1],
                [9, 1],
                [9, -9],
                [-9, -9],
                [-9, 1],
              ],
            ],
            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-9, 9],
              [9, 9],
              [9, -1],
              [-9, -1],
              [-9, 9],
            ],
          ],
          [
            [
              [-9, 1],
              [9, 1],
              [9, -9],
              [-9, -9],
              [-9, 1],
            ],
          ],
        ],
      },
    };

    const wholeSum = geoblaze.sum(raster, whole);
    const singlepart = geoblaze.sum(raster, collection);
    const multipart = geoblaze.sum(raster, multipolygon);

    expect(
      wholeSum[0] === 4 && singlepart[0] === 4 && multipart[0] === 4
    ).toBeTruthy();
  });

  test("simple in-memory raster unit overlap test", async () => {
    //  Raster   whole   2polygon & multipolygon
    //           _____            ____
    //  [1,1]   |     |          |    | (two overlapping)
    //  [1,1]   |_____|          |____|
    //

    const raster = await parseGeoraster(
      [
        [
          [1, 1],
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

    const whole = {
      type: "Polygon",
      coordinates: [
        [
          [1, 1],
          [1, 19],
          [19, 19],
          [19, 1],
          [1, 1],
        ],
      ],
    };

    const collection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [1, 1],
                [1, 19],
                [19, 19],
                [19, 1],
                [1, 1],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [1, 1],
                [1, 19],
                [19, 19],
                [19, 1],
                [1, 1],
              ],
            ],

            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [1, 1],
              [1, 19],
              [19, 19],
              [19, 1],
              [1, 1],
            ],
          ],
          [
            [
              [1, 1],
              [1, 19],
              [19, 19],
              [19, 1],
              [1, 1],
            ],
          ],
        ],
      },
    };

    const wholeSum = geoblaze.sum(raster, whole);
    const singlepart = geoblaze.sum(raster, collection);
    const multipart = geoblaze.sum(raster, multipolygon);

    expect(
      wholeSum[0] === 4 && singlepart[0] === 4 && multipart[0] === 4
    ).toBeTruthy();
  });
});
