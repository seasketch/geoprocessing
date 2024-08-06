import { test, describe } from "vitest";
import { rekeyObject } from "./rekeyObject.js";

describe("rekeyObject", async () => {
  test("simpe reorder", async () => {
    const input = { a: 1, b: 2, c: 3 };
    const output = rekeyObject(input, ["c", "a", "b"]);
    expect(Object.keys(output)).toEqual(["c", "a", "b"]);
  });

  test("extra", async () => {
    const input = { a: 1, b: 2, z: 26, c: 3 };
    const output = rekeyObject(input, ["c", "a", "b"]);
    expect(Object.keys(output)).toEqual(["c", "a", "b", "z"]);
  });
});
