"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
//@ts-ignore
const user_meta_1 = require("user-meta");
//@ts-ignore
const spdx_license_ids_1 = __importDefault(require("spdx-license-ids"));
const fuzzy_1 = __importDefault(require("fuzzy"));
//@ts-ignore
const inquirer_autocomplete_prompt_1 = __importDefault(require("inquirer-autocomplete-prompt"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
//@ts-ignore
const aws_regions_1 = __importDefault(require("aws-regions"));
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(require("child_process").exec);
//@ts-ignore
const regions = aws_regions_1.default.list({ public: true }).map(v => v.code);
inquirer_1.default.registerPrompt("autocomplete", inquirer_autocomplete_prompt_1.default);
const licenseDefaults = ["MIT", "UNLICENSED", "BSD-3-Clause", "APACHE-2.0"];
const allLicenseOptions = [...spdx_license_ids_1.default, "UNLICENSED"];
async function init() {
    const packageAnswers = await inquirer_1.default.prompt([
        /* Pass your questions in here */
        {
            type: "input",
            name: "name",
            message: "Choose a name for your project",
            validate: value => {
                if (/^[a-z\-]+$/.test(value)) {
                    return true;
                }
                else {
                    return "Input must be lowercase and contain no spaces";
                }
            }
        },
        {
            type: "input",
            name: "description",
            message: "Please provide a short description of this project"
        },
        {
            type: "input",
            name: "repositoryUrl",
            message: "Source code repository location",
            validate: value => value === "" ||
                value === null ||
                /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(value)
                ? true
                : "Must be a valid url"
        },
        {
            type: "input",
            name: "author",
            message: "Your name",
            default: user_meta_1.name,
            validate: value => /\w+/.test(value)
                ? true
                : "Please provide a name for use in your package.json file"
        },
        {
            type: "input",
            name: "email",
            message: "Your email",
            default: user_meta_1.email,
            validate: value => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(value)
                ? true
                : "Please provide a valid email for use in your package.json file"
        },
        {
            type: "input",
            name: "organization",
            message: "Organization name (optional)"
        },
        {
            type: "autocomplete",
            name: "license",
            message: "Choose a license.",
            default: "MIT",
            source: async (answersSoFar, value) => {
                if (value) {
                    return fuzzy_1.default.filter(value, allLicenseOptions).map(v => v.original);
                }
                else {
                    return licenseDefaults;
                }
            }
        },
        {
            type: "autocomplete",
            name: "region",
            message: "What AWS region would you like to deploy functions in?",
            default: "us-west-1",
            source: async (answersSoFar, value) => {
                if (value) {
                    return fuzzy_1.default.filter(value, regions).map(v => v);
                }
                else {
                    return regions;
                }
            }
        }
    ]);
    await makeProject(packageAnswers);
}
exports.init = init;
if (require.main === module) {
    init();
}
async function makeProject(metadata, interactive = true, basePath = "") {
    const { organization, region, email, ...packageJSONOptions } = metadata;
    const spinner = interactive
        ? ora_1.default("Creating new project").start()
        : { start: () => false, stop: () => false, succeed: () => false };
    const path = `${basePath ? basePath + "/" : ""}${metadata.name}`;
    spinner.start(`creating ${path}`);
    await fs_extra_1.default.mkdir(path);
    spinner.succeed(`created ${path}/`);
    spinner.start("copying template");
    const templatePath = /dist/.test(__dirname)
        ? `${__dirname}/../../../templates/project`
        : `${__dirname}/../templates/project`;
    await fs_extra_1.default.copy(templatePath, path);
    spinner.succeed("copied template");
    spinner.start("updating package.json with provided details");
    const packageJSON = {
        ...JSON.parse(fs_extra_1.default.readFileSync(`${templatePath}/package.json`).toString()),
        ...packageJSONOptions,
        // TODO: other repo types
        ...(/github/.test(metadata.repositoryUrl)
            ? {
                repository: {
                    type: "git",
                    url: "git+" + metadata.repositoryUrl + ".git"
                },
                homepage: metadata.repositoryUrl + "#readme",
                bugs: {
                    url: metadata.repositoryUrl + "/issues"
                }
            }
            : {})
    };
    await fs_extra_1.default.writeFile(`${path}/package.json`, JSON.stringify(packageJSON, null, "  "));
    spinner.succeed("updated package.json");
    spinner.start("creating geoprocessing.json");
    const author = email ? `${metadata.author} <${email}>` : metadata.author;
    await fs_extra_1.default.writeFile(`${path}/geoprocessing.json`, JSON.stringify({
        author,
        organization: organization || "",
        region
    }, null, "  "));
    spinner.succeed("created geoprocessing.json");
    spinner.start("updating Dockerfile");
    const dockerfilePath = `${path}/data/Dockerfile`;
    const dockerfileContents = await fs_extra_1.default.readFile(dockerfilePath);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await fs_extra_1.default.writeFile(dockerfilePath, dockerfileContents
        .toString()
        .replace("Chad Burt <chad@underbluewaters.net>", author)
        .replace("America/Los_Angeles", tz));
    spinner.succeed("updated Dockerfile");
    await fs_extra_1.default.copyFile(`${__dirname}/../../../templates/exampleSketch.json`, path + "/examples/sketches/sketch.json");
    if (interactive) {
        spinner.start("installing dependencies with npm");
        const { stderr, stdout, error } = await exec("npm install --save-dev @seasketch/geoprocessing@latest", {
            cwd: metadata.name
        });
        if (error) {
            console.log(error);
            process.exit();
        }
        spinner.succeed("installed dependencies!");
    }
    if (interactive) {
        console.log(chalk_1.default.blue(`\nYour geoprocessing project has been initialized!`));
        console.log(`\nNext Steps:
  * Look at README.md for some tips on working with this project
  * ${chalk_1.default.yellow(`npm run create:function`)} to create your first geoprocessing function
  * ${chalk_1.default.yellow(`npm run create:client`)} to add a new report client
`);
        console.log(`Tips:
  * Create examples in SeaSketch, then export them as GeoJSON to ./examples/sketches for use in test cases and when designing reports
  * The data/ directory is where you can store scripts for generating data products you'll use in geoprocessing functions. It's already setup with some useful Docker containers.
`);
    }
}
exports.default = makeProject;
//# sourceMappingURL=init.js.map