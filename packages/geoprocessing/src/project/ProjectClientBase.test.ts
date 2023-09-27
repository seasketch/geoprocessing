import ProjectClientBase from "./ProjectClientBase";
import configFixtures from "../../src/testing/fixtures/projectConfig";

describe("ProjectClientBase", () => {
  test("ProjectClientBase should accept and return config", async () => {
    const project = new ProjectClientBase(configFixtures.simple);
    expect(project.basic).toEqual(configFixtures.simple.basic);
    expect(project.datasources).toEqual(configFixtures.simple.datasources);
    expect(project.geoprocessing).toEqual(configFixtures.simple.geoprocessing);
    expect(project.metricGroups).toEqual(configFixtures.simple.metricGroups);
    expect(project.precalc).toEqual(configFixtures.simple.precalc);
    expect(project.objectives).toEqual(configFixtures.simple.objectives);

    const metricGroup = project.getMetricGroup("boundaryAreaOverlap");
    expect(metricGroup.metricId).toEqual("boundaryAreaOverlap");

    const objective = project.getObjectiveById("eez_objective");
    expect(objective.objectiveId).toEqual("eez_objective");

    expect(project.getDatasourceUrl(project.datasources[0])).toEqual(
      "https://d3p1dsef9f0gjr.cloudfront.net/"
    );

    const objectives = project.getMetricGroupObjectives(metricGroup);
    expect(objectives.length).toBe(1);
    expect(objectives[0].objectiveId).toEqual(objective.objectiveId);
  });
});
