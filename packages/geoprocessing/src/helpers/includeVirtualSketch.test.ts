/**
 * @jest-environment node
 * @group unit
 */

import { SketchCollection, NullSketchCollection } from "../types";
import {
  includeVirtualSketch,
  isTruthyAttributeValue,
} from "./includeVirtualSketch";
import {
  getUserAttribute,
  isSketchCollection,
  genSketch,
  genSketchCollection,
} from "./sketch";
import { polygon } from "@turf/helpers";

describe("isTrueAttributeValue", () => {
  test("should return proper boolean", async () => {
    expect(isTruthyAttributeValue(undefined)).toBe(false);
    expect(isTruthyAttributeValue("No")).toBe(false);
    expect(isTruthyAttributeValue(false)).toBe(false);
    expect(isTruthyAttributeValue(true)).toBe(true);
    expect(isTruthyAttributeValue("Yes")).toBe(true);
    expect(isTruthyAttributeValue("yes")).toBe(true);
  });
});

/**
 * Returns true if contiguous zone should be included in the given sketch collection
 */
export const sketchTest = (
  collection: SketchCollection | NullSketchCollection
) => {
  const val = getUserAttribute(collection.properties, "test");
  return isTruthyAttributeValue(val);
};

const mergeColl = genSketchCollection([
  genSketch({
    name: "test2",
    feature: polygon([
      [
        [1, 1],
        [1, 2],
        [2, 2],
        [2, 1],
        [1, 1],
      ],
    ]),
  }),
]);

describe("includeVirtualSketch", () => {
  test.only("should be included if valid yes attribute", async () => {
    const sketch = genSketch({ name: "test1" });
    const coll = genSketchCollection([sketch], { name: "testColl" });
    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include test?",
        value: "Yes",
        exportId: "test",
      },
    ];

    const mergedColl = includeVirtualSketch(coll, mergeColl, sketchTest);
    expect(isSketchCollection(mergedColl));
    expect(mergedColl.features.length).toBe(2);
    expect(mergedColl.properties.name).toBe("testColl");
    expect(mergedColl.features[0].properties.name).toBe("test1");
    expect(mergedColl.features[1].properties.name).toBe("test2");
    expect(mergedColl.bbox).toEqual([0, 0, 2, 2]); // verify expanded bbox
  });

  test.only("should not be included if invalid yes attribute", async () => {
    const sketch = genSketch({ name: "test1" });
    const coll = genSketchCollection([sketch], { name: "testColl" });
    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include test?",
        value: "foo",
        exportId: "test",
      },
    ];

    const mergedColl = includeVirtualSketch(coll, mergeColl, sketchTest);
    expect(isSketchCollection(mergedColl));
    expect(mergedColl.features.length).toBe(1);
    expect(mergedColl.properties.name).toBe("testColl");
    expect(mergedColl.features[0].properties.name).toBe("test1");
  });

  test.only("should not be included if missing attribute", async () => {
    const sketch = genSketch({ name: "test1" });
    const coll = genSketchCollection([sketch], { name: "testColl" });
    coll.properties.userAttributes = [];

    const mergedColl = includeVirtualSketch(coll, mergeColl, sketchTest);
    expect(isSketchCollection(mergedColl));
    expect(mergedColl.features.length).toBe(1);
    expect(mergedColl.properties.name).toBe("testColl");
    expect(mergedColl.features[0].properties.name).toBe("test1");
  });
});
