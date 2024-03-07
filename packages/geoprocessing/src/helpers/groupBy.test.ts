import { groupBy } from "./groupBy.js";

const list = [
  { name: "foo", id: 1 },
  { name: "blue", id: 2 },
  { name: "foo", id: 3 },
];

describe("groupBy", () => {
  test("groupBy", async () => {
    const result = groupBy(list, (item) => item.name);
    expect(Object.keys(result).length).toBe(2);
    expect(result["foo"].length).toBe(2);
    expect(result["blue"].length).toBe(1);
  });
});
