import ProjectClientBase from "./ProjectClientBase";
import configFixtures from "../../src/testing/fixtures/projectConfig";

describe("ProjectClientBase", () => {
  test("ProjectClientBase should accept and return config", async () => {
    const client = new ProjectClientBase(configFixtures.simple);
    expect(client.basic).toEqual(configFixtures.simple.basic);
    expect(client.datasources).toEqual(configFixtures.simple.datasources);
    expect(client.geoprocessing).toEqual(configFixtures.simple.geoprocessing);
    expect(client.metricGroups).toEqual(configFixtures.simple.metricGroups);
    expect(client.objectives).toEqual(configFixtures.simple.objectives);
  });
});
