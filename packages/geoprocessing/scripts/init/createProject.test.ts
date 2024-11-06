import path from "node:path";
import fs from "fs-extra";
import { createProject } from "./createProject.js";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";

import { describe, it, expect, afterAll } from "vitest";

const rootPath = `${import.meta.dirname}/../__test__`;

describe("createProject", () => {
  afterAll(async () => {
    await fs.emptyDirSync(rootPath); // Cleanup
  });

  it("createProject - should create empty project", async () => {
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
        languages: ["EN"],
        templates: [],
        bboxMaxLat: 0,
        bboxMinLat: 0,
        bboxMaxLng: 0,
        bboxMinLng: 0,
      },
      false,
      rootPath,
    );

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectPath, "package.json")).toString(),
    );

    expect(packageJson.name).toBe(projectName);
    expect(packageJson.description).toBe("Test project");
    expect(packageJson.license).toBe("UNLICENSED");
    expect(packageJson.author).toBe("Test");

    const gpConfig = JSON.parse(
      fs.readFileSync(projectPath + "/project/geoprocessing.json").toString(),
    ) as GeoprocessingJsonConfig;

    expect(gpConfig.author).toBe("Test <test@test.com>");
    expect(gpConfig.organization).toBe("Test Org");
    expect(gpConfig.region).toBe("us-west-1");
    expect(gpConfig.preprocessingFunctions.length).toBe(0);
    expect(gpConfig.geoprocessingFunctions.length).toBe(0);
    expect(gpConfig.clients.length).toBe(0);
  }, 120_000);

  it("createProject - should create project using eez selection", async () => {
    const projectName = "test-project-empty";
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
        languages: ["EN"],
        templates: [],
      },
      false,
      rootPath,
    );
  }, 120_000);

  it("createProject - should create project with template", async () => {
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
        languages: ["EN"],
        templates: ["template-ocean-eez"],
      },
      false,
      rootPath,
    );

    const gpConfig = JSON.parse(
      fs.readFileSync(projectPath + "/project/geoprocessing.json").toString(),
    ) as GeoprocessingJsonConfig;

    expect(gpConfig.preprocessingFunctions.length).toBeGreaterThanOrEqual(1);
    expect(gpConfig.geoprocessingFunctions.length).toBeGreaterThan(0);
    expect(gpConfig.clients.length).toBeGreaterThan(0);
  }, 120_000);

  it("createProject - should create empty project with all defaults", async () => {
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
        languages: ["EN"],
        templates: [],
      },
      false,
      rootPath,
    );

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectPath, "package.json")).toString(),
    );

    expect(packageJson.name).toBe(projectName);
    expect(packageJson.description).toBe("");
    expect(packageJson.license).toBe("UNLICENSED");
    expect(packageJson.author).toBe("");

    const gpConfig = JSON.parse(
      fs.readFileSync(projectPath + "/project/geoprocessing.json").toString(),
    ) as GeoprocessingJsonConfig;

    expect(gpConfig.author).toBe("");
    expect(gpConfig.organization).toBe("");
    expect(gpConfig.region).toBe("us-west-1");
    expect(gpConfig.preprocessingFunctions.length).toBe(0);
    expect(gpConfig.geoprocessingFunctions.length).toBe(0);
    expect(gpConfig.clients.length).toBe(0);
  }, 120_000);
});
