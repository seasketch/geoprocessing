"use strict";
const fs = require("fs");
const path = require("path");
const PROJECT_PATH = process.env.PROJECT_PATH;
const config = JSON.parse(fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString());
const pkgGeo = JSON.parse(fs.readFileSync("./package.json").toString());
const projectPkg = JSON.parse(fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString());
const projectMetadata = {
    title: projectPkg.name,
    apiVersion: pkgGeo.version,
    version: projectPkg.version,
    relatedUri: projectPkg.homepage,
    sourceUri: projectPkg.repository ? projectPkg.repository.url : null,
    published: new Date().toISOString(),
    preprocessingServices: [],
    clients: [],
    feebackClients: []
};
if (config.functions.length < 1) {
    throw new Error("No functions specified in geoprocessing.json");
}
// console.log(config.functions);
for (const func of config.functions) {
    const name = path.basename(func);
}
fs.writeFileSync(path.join(PROJECT_PATH, ".build", "manifest.json"), JSON.stringify(projectMetadata));
//# sourceMappingURL=extractMetadata.js.map