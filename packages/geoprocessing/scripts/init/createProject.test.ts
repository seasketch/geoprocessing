/**
 * @group scripts/project
 */

import path from "path";
import fs from "fs-extra";
import { createProject } from "./createProject";
import { GeoprocessingJsonConfig } from "../../src/types";

const rootPath = `${__dirname}/../__test__`;

describe("createProject", () => {
  afterAll(async () => {
    await fs.emptyDirSync(rootPath); // Cleanup
  });

  it("should create empty project", async () => {
    const projectName = "test-project-empty";
    const projectPath = path.join(rootPath, projectName);
    await createProject(
      {
        name: projectName,
        description: "Test project",
        author: "Test",
        email: "test@test.com",
        license: "UNLICENSED",
        organization: "Test Org",
        repositoryUrl: "https://github.com/test/test-project",
        region: "us-west-1",
        templates: [],
        planningAreaType: "other",
        bboxMaxLat: 0,
        bboxMinLat: 0,
        bboxMaxLng: 0,
        bboxMinLng: 0,
        planningAreaId: "American Samoa",
        planningAreaName: "Samoa",
        planningAreaNameQuestion: "yes",
      },
      false,
      rootPath
    );

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectPath, "package.json")).toString()
    );

    expect(packageJson.name).toBe(projectName);
    expect(packageJson.description).toBe("Test project");
    expect(packageJson.license).toBe("UNLICENSED");
    expect(packageJson.author).toBe("Test");

    const gpConfig = JSON.parse(
      fs.readFileSync(projectPath + "/geoprocessing.json").toString()
    ) as GeoprocessingJsonConfig;

    expect(gpConfig.author).toBe("Test <test@test.com>");
    expect(gpConfig.organization).toBe("Test Org");
    expect(gpConfig.region).toBe("us-west-1");
    expect(gpConfig.preprocessingFunctions.length).toBe(0);
    expect(gpConfig.geoprocessingFunctions.length).toBe(0);
    expect(gpConfig.clients.length).toBe(0);
  }, 120000);

  it("should create project using eez selection", async () => {
    const projectName = "test-project-empty";
    const projectPath = path.join(rootPath, projectName);
    await createProject(
      {
        name: projectName,
        description: "Test project",
        author: "Test",
        email: "test@test.com",
        license: "UNLICENSED",
        organization: "Test Org",
        repositoryUrl: "https://github.com/test/test-project",
        region: "us-west-1",
        templates: [],
        planningAreaType: "eez",
        planningAreaId: "Micronesian Exclusive Economic Zone",
        planningAreaName: "Micronesian Exclusive Economic Zone",
        planningAreaNameQuestion: "yes",
      },
      false,
      rootPath
    );

    const basicJson = JSON.parse(
      fs
        .readFileSync(path.join(projectPath, "project", "basic.json"))
        .toString()
    );

    expect(basicJson.bbox).toEqual([
      135.31244183762126, -1.173110965298591, 165.67652822599732,
      13.445432925389298,
    ]);
  }, 120000);

  it("should create project with template", async () => {
    const projectName = "test-project-template";
    const projectPath = path.join(rootPath, projectName);
    await createProject(
      {
        name: projectName,
        description: "Test project",
        author: "Test",
        email: "test@test.com",
        license: "UNLICENSED",
        organization: "Test Org",
        repositoryUrl: "https://github.com/test/test-project",
        region: "us-west-1",
        templates: ["template-ocean-eez"],
        planningAreaType: "other",
        bboxMaxLat: 0,
        bboxMinLat: 0,
        bboxMaxLng: 0,
        bboxMinLng: 0,
        planningAreaId: "American Samoa",
        planningAreaNameQuestion: "yes",
        planningAreaName: "Samoa",
      },
      false,
      rootPath
    );

    const gpConfig = JSON.parse(
      fs.readFileSync(projectPath + "/geoprocessing.json").toString()
    ) as GeoprocessingJsonConfig;

    expect(gpConfig.preprocessingFunctions.length).toBeGreaterThanOrEqual(1);
    expect(gpConfig.geoprocessingFunctions.length).toBeGreaterThan(0);
    expect(gpConfig.clients.length).toBeGreaterThan(0);
  }, 120000);

  it("should create empty project with all defaults", async () => {
    const projectName = "test-project-empty-defaults";
    const projectPath = path.join(rootPath, projectName);
    await createProject(
      {
        name: projectName,
        description: "",
        author: "",
        email: "",
        license: "UNLICENSED",
        organization: "",
        repositoryUrl: "",
        region: "us-west-1",
        templates: [],
        planningAreaType: "other",
        bboxMaxLat: 90,
        bboxMinLat: -90,
        bboxMaxLng: 180,
        bboxMinLng: -180,
        planningAreaId: "Test Area",
        planningAreaName: "",
        planningAreaNameQuestion: "no",
      },
      false,
      rootPath
    );

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectPath, "package.json")).toString()
    );

    expect(packageJson.name).toBe(projectName);
    expect(packageJson.description).toBe("");
    expect(packageJson.license).toBe("UNLICENSED");
    expect(packageJson.author).toBe("");

    const basicJson = JSON.parse(
      fs
        .readFileSync(path.join(projectPath, "project", "basic.json"))
        .toString()
    );

    expect(basicJson.bbox).toEqual([-180, -90, 180, 90]);
    expect(basicJson.planningAreaName).toEqual("Test Area");

    const gpConfig = JSON.parse(
      fs.readFileSync(projectPath + "/geoprocessing.json").toString()
    ) as GeoprocessingJsonConfig;

    expect(gpConfig.author).toBe("");
    expect(gpConfig.organization).toBe("");
    expect(gpConfig.region).toBe("us-west-1");
    expect(gpConfig.preprocessingFunctions.length).toBe(0);
    expect(gpConfig.geoprocessingFunctions.length).toBe(0);
    expect(gpConfig.clients.length).toBe(0);
  }, 120000);
});
