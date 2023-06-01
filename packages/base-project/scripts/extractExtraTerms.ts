#!/usr/bin/env node
import project from "../project";
import fs from "fs-extra";

(async () => {
  console.log("extracting extra terms from project config");
  const extraTerms = fs.readJSONSync(`src/i18n/extraTerms.json`);

  // basic
  extraTerms[project.basic.planningAreaId] = project.basic.planningAreaId;
  extraTerms[project.basic.planningAreaName] = project.basic.planningAreaName;

  // metrics: add terms for metric display
  project.metricGroups.forEach((metric) => {
    metric.classes.forEach((metricClass) => {
      if (metricClass.display) {
        extraTerms[metricClass.display] = metricClass.display;
      }
    });
  });

  // objectives: update terms for objective display
  project.objectives.forEach((objective) => {
    extraTerms[objective.shortDesc] = objective.shortDesc;
    Object.keys(objective.countsToward).forEach((level) => {
      extraTerms[level] = level;
    });
  });

  fs.writeJSONSync(`src/i18n/extraTerms.json`, extraTerms, { spaces: 2 });
})();
