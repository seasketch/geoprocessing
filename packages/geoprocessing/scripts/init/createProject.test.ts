/**
 * @group scripts/project
 */

import path from "path";
import fs from "fs-extra";
import { createProject } from "./createProject";
import { GeoprocessingJsonConfig } from "../../src/types";

const rootPath = `${__dirname}/__test__`;

afterAll(async () => {
  await fs.remove(rootPath); // Cleanup
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
      noun: "Samoa",
      nounPossessive: "Samoan",
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
});

it("should create project using eez selection", async () => {
  const projectName = "test-project-empty";
  const projectPath = path.join(rootPath, projectName);
  console.log("EEZ_PROJECT_PATH", projectPath, projectName);
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
      noun: "Micronesia",
      nounPossessive: "Micronesian",
    },
    false,
    rootPath
  );

  console.log("GOT HERE 1");

  const basicJson = JSON.parse(
    fs.readFileSync(path.join(projectPath, "project", "basic.json")).toString()
  );

  expect(basicJson.bbox).toEqual([
    135.31244183762126, -1.173110965298591, 165.67652822599732,
    13.445432925389298,
  ]);
}, 60000);

it("should create project with template with preprocessor", async () => {
  const projectName = "test-project-preprocessor";
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
      templates: ["gp-clip-ocean"],
      planningAreaType: "other",
      bboxMaxLat: 0,
      bboxMinLat: 0,
      bboxMaxLng: 0,
      bboxMinLng: 0,
      noun: "Samoa",
      nounPossessive: "Samoan",
    },
    false,
    rootPath
  );

  const gpConfig = JSON.parse(
    fs.readFileSync(projectPath + "/geoprocessing.json").toString()
  ) as GeoprocessingJsonConfig;

  expect(gpConfig.preprocessingFunctions.length).toBe(1);
  expect(gpConfig.geoprocessingFunctions.length).toBe(0);
  expect(gpConfig.clients.length).toBe(0);
});

it("should create project with template with 1 of each", async () => {
  const projectName = "test-project-all";
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
      templates: ["gp-clip-ocean", "gp-raster-stats"],
      planningAreaType: "other",
      bboxMaxLat: 0,
      bboxMinLat: 0,
      bboxMaxLng: 0,
      bboxMinLng: 0,
      noun: "Samoa",
      nounPossessive: "Samoan",
    },
    false,
    rootPath
  );

  const gpConfig = JSON.parse(
    fs.readFileSync(projectPath + "/geoprocessing.json").toString()
  ) as GeoprocessingJsonConfig;

  expect(gpConfig.preprocessingFunctions.length).toBe(1);
  expect(gpConfig.geoprocessingFunctions.length).toBe(1);
  expect(gpConfig.clients.length).toBe(1);
});
