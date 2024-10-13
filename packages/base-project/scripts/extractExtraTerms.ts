#!/usr/bin/env node
import project from "../project/projectClient.js";
import fs from "fs-extra";

console.log("extracting extra terms from project config");
const extraTerms = fs.readJSONSync(`src/i18n/extraTerms.json`);

// basic
extraTerms[project.basic.planningAreaId] = project.basic.planningAreaId;
extraTerms[project.basic.planningAreaName] = project.basic.planningAreaName;

// metrics: add terms for metric display
for (const metric of project.metricGroups) {
  for (const metricClass of metric.classes) {
    if (metricClass.display) {
      extraTerms[metricClass.display] = metricClass.display;
    }
  }
}

// objectives: update terms for objective display
for (const objective of project.objectives) {
  extraTerms[objective.shortDesc] = objective.shortDesc;
  for (const level of Object.keys(objective.countsToward)) {
    extraTerms[level] = level;
  }
}

if (!project.geographies || !Array.isArray(project.geographies)) {
  console.log(
    `Unable to load default geography, run extract:translation again after init`,
  );
} else {
  for (const geography of project.geographies) {
    extraTerms[geography.display] = geography.display;
  }
}

fs.writeJSONSync(`src/i18n/extraTerms.json`, extraTerms, { spaces: 2 });
