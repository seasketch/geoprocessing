import inquirer from "inquirer";
// @ts-ignore
import licenses from "spdx-license-ids";
import fuzzy from "fuzzy-tools";
import autocomplete from "inquirer-autocomplete-prompt";
import awsRegions from "aws-regions";
import util from "util";
import { getTemplateQuestion } from "../template/addTemplate";
import { createProject, CreateProjectMetadata } from "./createProject";
const exec = util.promisify(require("child_process").exec);

const regions = awsRegions.list({ public: true }).map((v) => v.code);

inquirer.registerPrompt("autocomplete", autocomplete);
const licenseDefaults = ["MIT", "UNLICENSED", "BSD-3-Clause", "APACHE-2.0"];
const allLicenseOptions = [...licenses, "UNLICENSED"];

async function init(gpVersion?: string) {
  const userMeta = require("user-meta");
  const defaultName = userMeta.name;
  const defaultEmail = userMeta.email;
  const templateQuestion = await getTemplateQuestion();
  const answers = await inquirer.prompt<CreateProjectMetadata>([
    /* Pass your questions in here */
    {
      type: "input",
      name: "name",
      message: "Choose a name for your project",
      validate: (value) => {
        if (/^[a-z\-]+$/.test(value)) {
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
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(
          value
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
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(value)
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
      message: "Choose a license.",
      default: "MIT",
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
      type: "input",
      name: "bbox",
      message: "Project bounding box in form [minX, minY, maxX, maxY]",
    },
    {
      type: "input",
      name: "noun",
      message:
        "What is the name of the country/site/planning area? (e.g. Samoa)",
    },
    {
      type: "input",
      name: "nounPossessive",
      message:
        "Is there a possessive form of this name? (e.g. Samoan) Leave blank if not",
    },
    templateQuestion,
  ]);

  answers.gpVersion = gpVersion;

  await createProject(answers);
}

if (require.main === module) {
  init();
}

export { init };
