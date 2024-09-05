import inquirer from "inquirer";
import { $ } from "zx";
import {
  importDatasource,
  readDatasources,
} from "../base/datasources/index.js";
import {
  datasourceFormatDescriptions,
  importVectorDatasourceOptionsSchema,
  ImportVectorDatasourceOptions,
  Datasource,
  ImportRasterDatasourceOptions,
  importRasterDatasourceOptionsSchema,
  datasourceConfig,
} from "../../src/index.js";
import path from "path";
import fs from "fs";

import { getProjectClient } from "../base/project/projectClient.js";
import { precalcQuestion } from "./precalcQuestion.js";
import { explodeQuestion } from "./explodeQuestion.js";

$.verbose = false;

// This is a standalone script used as a CLI command with a top-level function

const projectPath = process.argv[2];
const projectClient = getProjectClient(projectPath);

interface ImportVectorDatasourceAnswers
  extends Pick<
    ImportVectorDatasourceOptions,
    | "src"
    | "datasourceId"
    | "layerName"
    | "geo_type"
    | "formats"
    | "precalc"
    | "explodeMulti"
  > {
  classKeys: string[];
  propertiesToKeep: string[];
}

interface ImportRasterDatasourceAnswers
  extends Pick<
    ImportRasterDatasourceOptions,
    | "src"
    | "datasourceId"
    | "band"
    | "geo_type"
    | "formats"
    | "noDataValue"
    | "measurementType"
    | "precalc"
  > {}

// Main function, wrapped in an IIFE to avoid top-level await
void (async function () {
  const datasources = readDatasources();
  const geoTypeAnswer = await geoTypeQuestion();
  const srcAnswer = await srcQuestion();

  const config = await (async () => {
    if (geoTypeAnswer.geo_type === "vector") {
      // Vector datasource
      const layerNameAnswer = await layerNameQuestion(srcAnswer.src);
      const datasourceIdAnswer = await datasourceIdQuestion(
        datasources,
        srcAnswer.src,
      );
      const explodeAnswers = await explodeQuestion();
      const detailedVectorAnswers = await detailedVectorQuestions(
        srcAnswer.src,
        layerNameAnswer.layerName!,
      );
      const precalcAnswers = await precalcQuestion();

      const config = vectorMapper({
        ...geoTypeAnswer,
        ...srcAnswer,
        ...datasourceIdAnswer,
        ...layerNameAnswer,
        ...{
          ...detailedVectorAnswers,
          formats: datasourceConfig.importDefaultVectorFormats.concat(
            detailedVectorAnswers.formats,
          ),
        },
        ...precalcAnswers,
        ...explodeAnswers,
      });
      return config;
    } else {
      // Raster datasource
      const datasourceIdAnswer = await datasourceIdQuestion(
        datasources,
        srcAnswer.src,
      );
      const detailedRasterAnswers = await detailedRasterQuestions(
        srcAnswer.src,
      );
      const precalcAnswers = await precalcQuestion();

      const config = rasterMapper({
        ...geoTypeAnswer,
        ...srcAnswer,
        ...datasourceIdAnswer,
        ...detailedRasterAnswers,
        ...precalcAnswers,
      });
      return config;
    }
  })();

  await importDatasource(projectClient, config, {});
})();

/** Maps answers object to options */
function vectorMapper(
  answers: ImportVectorDatasourceAnswers,
): ImportVectorDatasourceOptions {
  const validOptions = importVectorDatasourceOptionsSchema.parse(answers);
  return validOptions;
}

/** Maps answers object to options */
function rasterMapper(
  answers: ImportRasterDatasourceAnswers,
): ImportRasterDatasourceOptions {
  let options: ImportRasterDatasourceOptions = {
    ...answers,
  };
  // a blank noDataValue will end up as nan, so just remove it as its optional
  if (isNaN(parseFloat(`${answers.noDataValue}`))) {
    delete options.noDataValue;
  }

  const validOptions = importRasterDatasourceOptionsSchema.parse(options);
  return validOptions;
}

/** Get Vector/Raster type */
async function geoTypeQuestion(): Promise<
  Pick<ImportVectorDatasourceAnswers, "geo_type">
> {
  return inquirer.prompt<Pick<ImportVectorDatasourceAnswers, "geo_type">>([
    {
      type: "list",
      name: "geo_type",
      message: "Type of data?",
      choices: [
        {
          value: "vector",
          name: "Vector",
        },
        {
          value: "raster",
          name: "Raster",
        },
      ],
    },
  ]);
}

/** Get src path */
async function srcQuestion(): Promise<
  Pick<ImportVectorDatasourceAnswers, "src">
> {
  return inquirer.prompt<Pick<ImportVectorDatasourceAnswers, "src">>([
    {
      type: "input",
      name: "src",
      message: "Enter path to src file (with filename)",
      validate: (value) => {
        const fullPath = path.resolve(projectPath, value);
        if (!fs.existsSync(fullPath)) return "File does not exist";
        else if (!fs.statSync(fullPath).isFile())
          return "Path does not point to a file";
        else return true;
      },
    },
  ]);
}

/** Get datasourceId */
async function datasourceIdQuestion(
  datasources: Datasource[],
  srcPath: string,
): Promise<Pick<ImportVectorDatasourceAnswers, "datasourceId">> {
  const datasourceIds = datasources.map((ds) => ds.datasourceId);
  return inquirer.prompt<Pick<ImportVectorDatasourceAnswers, "datasourceId">>([
    {
      type: "input",
      name: "datasourceId",
      message:
        "Choose unique datasource name (a-z, A-Z, 0-9, -, _), defaults to filename",
      default: path.basename(srcPath, path.extname(srcPath)),
      validate: (value) =>
        value === "" ||
        (!datasourceIds.includes(value) &&
          (/^[a-zA-Z0-9-_]+$/.test(value)
            ? true
            : "Invalid or duplicate datasource name")),
    },
  ]);
}

/** Get layer name of vector file */
async function layerNameQuestion(
  srcPath: string,
): Promise<Pick<ImportVectorDatasourceAnswers, "layerName">> {
  const { stdout } = await $`ogrinfo -json ${srcPath}`;
  const layers = JSON.parse(stdout).layers.map((layer) => layer.name);
  if (!layers.length)
    throw new Error(`No layers in vector, check validity of file.`);

  return inquirer.prompt<Pick<ImportVectorDatasourceAnswers, "layerName">>([
    {
      type: "list",
      name: "layerName",
      message: "Select layer to import",
      choices: layers.map((layer) => ({
        value: layer,
        name: layer,
      })),
    },
  ]);
}

/** Get classKeys, propertiesToKeep, and formats */
async function detailedVectorQuestions(
  srcPath: string,
  layerName: string,
): Promise<
  Pick<
    ImportVectorDatasourceAnswers,
    "classKeys" | "propertiesToKeep" | "formats"
  >
> {
  const { stdout } =
    await $`ogrinfo -json -so -nocount -noextent -nogeomtype ${srcPath} ${layerName}`;
  const fields = JSON.parse(stdout)
    .layers.find((layer) => layer.name === layerName)
    .fields.map((field) => field.name);

  return inquirer.prompt<
    Pick<
      ImportVectorDatasourceAnswers,
      "classKeys" | "propertiesToKeep" | "formats"
    >
  >([
    {
      type: "checkbox",
      name: "classKeys",
      message:
        fields.length > 0
          ? "Select feature properties that you want to group metrics by"
          : "No feature properties found in the vector layer. Press enter to continue.",
      choices: fields.map((field) => ({
        value: field,
        name: field,
      })),
    },
    {
      type: "checkbox",
      name: "propertiesToKeep",
      message:
        fields.length > 0
          ? "Select additional feature properties to keep in final datasource"
          : "No feature properties found in the vector layer. Press enter to continue.",
      choices: fields.map((field) => ({
        value: field,
        name: field,
      })),
    },
    {
      type: "checkbox",
      name: "formats",
      message: `These formats are automatically created: ${datasourceConfig.importDefaultVectorFormats.join(
        ", ",
      )}. Select any additional formats you want created`,
      choices: datasourceConfig.importExtraVectorFormats.map((name) => ({
        value: name,
        name: `${name} - ${datasourceFormatDescriptions[name]}`,
        checked: false,
      })),
    },
  ]);
}

/** Get measurementType, export formats, band, and noDataValue */
async function detailedRasterQuestions(
  srcPath: string,
): Promise<
  Pick<
    ImportRasterDatasourceAnswers,
    "measurementType" | "formats" | "band" | "noDataValue"
  >
> {
  const { stdout } = await $`gdalinfo -json ${srcPath}`;
  const bands = JSON.parse(stdout).bands.map((band) => band.band);

  const answers = await inquirer.prompt<
    Pick<
      ImportRasterDatasourceAnswers,
      "measurementType" | "formats" | "band" | "noDataValue"
    >
  >([
    {
      type: "list",
      name: "band",
      message: "Select raster band to import",
      choices: bands.map((band) => ({
        value: band,
        name: band,
      })),
    },
    {
      type: "list",
      name: "measurementType",
      message: "What type of measurement is used for this raster data?",
      choices: [
        {
          value: "quantitative",
          name: "Quantitative - values represent amounts, measurement of single thing",
        },
        {
          value: "categorical",
          name: "Categorical - values represent groups",
        },
      ],
    },
  ]);

  const noDataValue = JSON.parse(stdout).bands.find(
    (b) => b.band === answers.band,
  ).noDataValue;

  return {
    ...answers,
    formats: ["tif"],
    noDataValue: isNaN(noDataValue) ? -9999 : noDataValue,
  };
}
