import inquirer from "inquirer";
import licenses from "spdx-license-ids/index.json" with { type: "json" };
import languages from "../../src/i18n/languages.json" with { type: "json" };

import fuzzy from "fuzzy-tools";
import autocomplete from "inquirer-autocomplete-prompt";
import awsRegions from "aws-regions";
import { createProject, CreateProjectMetadata } from "./createProject.js";
import { pathToFileURL } from "node:url";
import userMeta from "user-meta";

const regions = awsRegions.list({ public: true }).map((v) => v.code);

inquirer.registerPrompt("autocomplete", autocomplete);
const licenseDefaults = ["MIT", "UNLICENSED", "BSD-3-Clause", "APACHE-2.0"];
const allLicenseOptions = [...licenses, "UNLICENSED"];

async function init(gpVersion?: string) {
  const defaultName = userMeta.name;
  const defaultEmail = userMeta.email;

  const answers = await inquirer.prompt<CreateProjectMetadata>([
    /* Pass your questions in here */
    {
      type: "input",
      name: "name",
      message: "Choose a name for your project",
      validate: (value) => {
        if (/^[a-z-]+$/.test(value)) {
          return true;
        } else {
          return "Input must be lowercase letters or hyphens and contain no spaces";
        }
      },
    },
    {
      type: "input",
      name: "description",
      message: "Please provide a short description of this project",
    },
    {
      type: "input",
      name: "repositoryUrl",
      message: "Source code repository location",
      validate: (value) =>
        value === "" ||
        value === null ||
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w!#$&'()*+,./:;=?@[\]~-]+$/gm.test(
          value,
        )
          ? true
          : "Must be a valid url",
    },
    {
      type: "input",
      name: "author",
      message: "Your name",
      default: defaultName,
      validate: (value) =>
        /\w+/.test(value)
          ? true
          : "Please provide a name for use in your package.json file",
    },
    {
      type: "input",
      name: "email",
      message: "Your email",
      default: defaultEmail,
      validate: (value) =>
        /[\d%+._a-z-]+@[\d.a-z-]+\.[a-z]{2,3}/g.test(value)
          ? true
          : "Please provide a valid email for use in your package.json file",
    },
    {
      type: "input",
      name: "organization",
      message: "Organization name (optional)",
    },
    {
      type: "autocomplete",
      name: "license",
      message: "What software license would you like to use?",
      default: "BSD-3-Clause",
      source: async (answersSoFar: any, value: string) => {
        if (value) {
          return fuzzy.filter(value, allLicenseOptions).map((v) => v.original);
        } else {
          return licenseDefaults;
        }
      },
    },
    {
      type: "autocomplete",
      name: "region",
      message: "What AWS region would you like to deploy functions in?",
      default: "us-west-1",
      source: async (answersSoFar: any, value: string) => {
        if (value) {
          return fuzzy.filter(value, regions).map((v) => v);
        } else {
          return regions;
        }
      },
    },
    {
      type: "checkbox",
      name: "languages",
      message:
        "What languages will your reports be published in, other than English? (leave blank for none)",
      choices: languages
        .filter((lan) => lan.code !== "EN")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((lan) => ({
          value: lan.code,
          name: lan.name,
        })),
    },
  ]);

  answers.templates = ["template-blank-project"];
  answers.planningAreaType = "other";
  answers.gpVersion = gpVersion;
  answers.bboxMinLng = -180;
  answers.bboxMinLat = -90;
  answers.bboxMaxLng = 180;
  answers.bboxMaxLat = 90;

  await createProject(answers);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // module was not imported but called directly
  await init(process.argv[2]);
}

export { init };
