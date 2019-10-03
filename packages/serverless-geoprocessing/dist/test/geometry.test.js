"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geometry_1 = require("../src/geometry");
// @ts-ignore
global.fetch = require("jest-fetch-mock");
const exampleSketch = {
    type: "Feature",
    bbox: [0, 1, 2, 3, 4, 5],
    properties: {
        id: "1234abcd",
        updatedAt: new Date().toISOString(),
        name: "Sketch A",
        sketchClassId: "123abc",
        foo: "bar"
    },
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [-125.46386718749999, 33.578014746143985],
                [-125.8154296875, 32.65787573695528],
                [-124.365234375, 32.0639555946604],
                [-123.662109375, 33.211116472416855],
                [-125.46386718749999, 33.578014746143985]
            ]
        ]
    }
};
test("Basic extraction from request", async () => {
    const sketch = await geometry_1.fetchGeoJSON({
        geometry: exampleSketch
    });
    expect(sketch.properties && sketch.properties["id"]).toBe("1234abcd");
});
test("Fetch sketch from a server", async () => {
    // @ts-ignore
    global.fetch.mockResponseOnce(JSON.stringify(exampleSketch));
    const sketch = await geometry_1.fetchGeoJSON({
        geometryUri: "https://seasketch.org/p/1/sketch/1234abcd?token=paralabrax"
    });
    expect(sketch.properties && sketch.properties["id"]).toBe("1234abcd");
});
