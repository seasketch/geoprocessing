import { keyBy } from "./keyBy";

const list = [
  { name: "foo", id: 1 },
  { name: "blue", id: 2 },
  { name: "foo", id: 3 },
];

describe("keyBy", () => {
  test("keyBy", async () => {
    const result = keyBy(list, (item) => item.name);
    expect(Object.keys(result).length).toBe(2);
    expect(result.blue.id).toBe(2);
    expect(result.foo.id).toBe(3);
  });
});
