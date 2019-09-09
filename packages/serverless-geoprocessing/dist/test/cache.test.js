"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../src/cache");
const exampleSketch = {
    type: "Feature",
    bbox: [0, 1, 2, 3, 4, 5],
    properties: {
        id: "1234abcd",
        updatedAt: new Date().toISOString(),
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
describe("cache key generation", () => {
    test("basic hashing", () => {
        const hash1 = cache_1.makeCacheKey(exampleSketch);
        expect(typeof hash1).toBe("string");
        const hash2 = cache_1.makeCacheKey({ ...exampleSketch });
        expect(hash1).toBe(hash2);
    });
    test("updatedAt change detection", () => {
        const hash1 = cache_1.makeCacheKey(exampleSketch);
        const hash2 = cache_1.makeCacheKey({
            ...exampleSketch,
            properties: {
                ...exampleSketch.properties,
                updatedAt: new Date().toISOString()
            }
        });
        expect(hash1).not.toBe(hash2);
    });
    test("invalidate hash by custom properties", () => {
        const hash1 = cache_1.makeCacheKey(exampleSketch, ["foo"]);
        const hash2 = cache_1.makeCacheKey({
            ...exampleSketch,
            properties: {
                ...exampleSketch.properties,
                updatedAt: new Date().toISOString()
            }
        }, ["foo"]);
        expect(hash1).toBe(hash2);
        const hash3 = cache_1.makeCacheKey({
            ...exampleSketch,
            properties: {
                ...exampleSketch.properties,
                foo: "huh?",
                updatedAt: new Date().toISOString()
            }
        });
        expect(hash1).not.toBe(hash3);
    });
});
