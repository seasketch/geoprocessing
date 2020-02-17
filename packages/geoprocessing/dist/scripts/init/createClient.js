"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
// @ts-ignore
const pascalcase_1 = __importDefault(require("pascalcase"));
async function createClient() {
    const answers = await inquirer_1.default.prompt([
        {
            type: "input",
            name: "title",
            message: "Name for this client, in PascalCase",
            validate: value => /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
            transformer: value => pascalcase_1.default(value)
        },
        {
            type: "input",
            name: "description",
            message: "Describe what this client is for"
        },
        {
            type: "confirm",
            name: "typescript",
            message: "Use typescript? (Recommended)"
        }
    ]);
    answers.title = pascalcase_1.default(answers.title);
    await makeClient(answers, true, "");
}
exports.createClient = createClient;
if (require.main === module) {
    createClient();
}
async function makeClient(options, interactive = true, basePath = "./") {
    const spinner = interactive
        ? ora_1.default("Creating new client").start()
        : { start: () => false, stop: () => false, succeed: () => false };
    spinner.start(`creating client from templates`);
    // copy client template
    const fpath = basePath + "src/clients";
    // rename metadata in function definition
    const templatePath = /dist/.test(__dirname)
        ? `${__dirname}/../../../templates/clients`
        : `${__dirname}/../../../templates/clients`;
    const clientCode = await fs_extra_1.default.readFile(`${templatePath}/Client.tsx`);
    const testCode = await fs_extra_1.default.readFile(`${templatePath}/Client.stories.tsx`);
    if (!fs_extra_1.default.existsSync(path_1.default.join(basePath, "src"))) {
        fs_extra_1.default.mkdirSync(path_1.default.join(basePath, "src"));
    }
    if (!fs_extra_1.default.existsSync(path_1.default.join(basePath, "src", "clients"))) {
        fs_extra_1.default.mkdirSync(path_1.default.join(basePath, "src", "clients"));
    }
    const geoprocessingJson = JSON.parse(fs_extra_1.default.readFileSync(path_1.default.join(basePath, "geoprocessing.json")).toString());
    geoprocessingJson.clients = geoprocessingJson.clients || [];
    geoprocessingJson.clients.push({
        name: options.title,
        description: options.description,
        source: `${fpath}/${options.title}.tsx`
    });
    fs_extra_1.default.writeFileSync(path_1.default.join(basePath, "geoprocessing.json"), JSON.stringify(geoprocessingJson, null, "  "));
    const functions = geoprocessingJson.functions;
    let functionName = "area";
    if (functions && functions.length) {
        functionName = path_1.default.basename(functions[0]).split(".")[0];
    }
    const resultsType = pascalcase_1.default(`${functionName} results`);
    await fs_extra_1.default.writeFile(`${fpath}/${options.title}.tsx`, clientCode
        .toString()
        .replace(/Client/g, options.title)
        .replace(/AreaResults/g, resultsType)
        .replace(`"area"`, `"${functionName}"`));
    await fs_extra_1.default.writeFile(`${fpath}/${options.title}.stories.tsx`, testCode.toString().replace(/Client/g, options.title));
    // TODO: make typescript optional
    spinner.succeed(`created ${options.title} client in ${fpath}/`);
    if (interactive) {
        console.log(chalk_1.default.blue(`\nGeoprocessing client initialized`));
        console.log(`\nNext Steps:
    * Update your client definition in ${`${fpath}/${options.title}.tsx`}
  `);
    }
}
exports.makeClient = makeClient;
//# sourceMappingURL=createClient.js.map