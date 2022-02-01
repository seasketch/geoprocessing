/**
 * @group unit
 */

import { getIucnCategoryForActivities } from "./helpers";

describe("IUCN protection level", () => {
  test("no allowed activity returns None category", async () => {
    const category = getIucnCategoryForActivities([]);
    expect(category.category).toBe("1a");
  });

  test("single activity - 1a", async () => {
    const category = getIucnCategoryForActivities(["RESEARCH_NE"]);
    expect(category.category).toBe("1a");
  });

  test("single activity - 1b", async () => {
    const category = getIucnCategoryForActivities(["TRAD_FISH_COLLECT"]);
    expect(category.category).toBe("1b");
  });

  test("single activity - 2/3", async () => {
    const category = getIucnCategoryForActivities(["TOURISM"]);
    expect(category.category).toBe("2/3");
  });

  // Category 3 is unreachable because 2 will always match

  test("single activity - 4/6", async () => {
    const category = getIucnCategoryForActivities(["SHIPPING"]);
    expect(category.category).toBe("4/6");
  });

  test("single activity - 5", async () => {
    const category = getIucnCategoryForActivities(["HABITATION"]);
    expect(category.category).toBe("5");
  });

  // Category 6 is unreachable because 4 will always match

  test("single - industrial should match None", async () => {
    const category = getIucnCategoryForActivities(["FISH_AQUA_INDUSTRIAL"]);
    expect(category.category).toBe("None");
  });

  test("single - works should match None", async () => {
    const category = getIucnCategoryForActivities(["UNTREATED_WATER"]);
    expect(category.category).toBe("None");
  });

  test("single - mining should match None", async () => {
    const category = getIucnCategoryForActivities(["MINING_OIL_GAS"]);
    expect(category.category).toBe("None");
  });

  test("multiple - research + mining should match None", async () => {
    const category = getIucnCategoryForActivities([
      "RESEARCH_NE",
      "MINING_OIL_GAS",
    ]);
    expect(category.category).toBe("None");
  });
});
