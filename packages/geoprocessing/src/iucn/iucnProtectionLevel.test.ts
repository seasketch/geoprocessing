/**
 * @group unit
 */

import { Sketch } from "../types";
import { getCategoryForActivities } from "./iucnProtectionLevel";

const genSketchWithActivities = (activities: string[]): Sketch => {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
    properties: {
      id: "615bbbe9aac8c8285d50db2d",
      name: "mpa-test",
      updatedAt: "2021-10-05T02:43:53.326Z",
      createdAt: "2021-10-05T02:43:53.326Z",
      sketchClassId: "615b59e1aac8c8285d50d9b8",
      isCollection: false,
      userAttributes: [
        {
          label: "Allowed Activities",
          fieldType: "ChoiceField",
          exportId: "ACTIVITIES",
          value: activities,
        },
      ],
    },
  };
};

describe("IUCN protection level", () => {
  test("no allowed activity returns None category", async () => {
    const category = getCategoryForActivities([]);
    expect(category.category).toBe("1a");
  });

  test("single activity - 1a", async () => {
    const category = getCategoryForActivities(["RESEARCH_NE"]);
    expect(category.category).toBe("1a");
  });

  test("single activity - 1b", async () => {
    const category = getCategoryForActivities(["TRAD_FISH_COLLECT"]);
    expect(category.category).toBe("1b");
  });

  test("single activity - 2/3", async () => {
    const category = getCategoryForActivities(["TOURISM"]);
    expect(category.category).toBe("2/3");
  });

  // Category 3 is unreachable because 2 will always match

  test("single activity - 4/6", async () => {
    const category = getCategoryForActivities(["SHIPPING"]);
    expect(category.category).toBe("4/6");
  });

  test("single activity - 5", async () => {
    const category = getCategoryForActivities(["HABITATION"]);
    expect(category.category).toBe("5");
  });

  // Category 6 is unreachable because 4 will always match

  test("single - industrial should match None", async () => {
    const category = getCategoryForActivities(["FISH_AQUA_INDUSTRIAL"]);
    expect(category.category).toBe("None");
  });

  test("single - works should match None", async () => {
    const category = getCategoryForActivities(["UNTREATED_WATER"]);
    expect(category.category).toBe("None");
  });

  test("single - mining should match None", async () => {
    const category = getCategoryForActivities(["MINING_OIL_GAS"]);
    expect(category.category).toBe("None");
  });

  test("multiple - research + mining should match None", async () => {
    const category = getCategoryForActivities([
      "RESEARCH_NE",
      "MINING_OIL_GAS",
    ]);
    expect(category.category).toBe("None");
  });
});
