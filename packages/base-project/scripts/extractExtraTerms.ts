#!/usr/bin/env node
import project from "../project";
import fs from "fs-extra";

(async () => {
  console.log("extracting extra terms from project config");
  const extraTerms = fs.readJSONSync(`src/i18n/extraTerms.json`);

  // Add terms for metric display
  project.metricGroups.forEach((metric) => {
    metric.classes.forEach((metricClass) => {
      if (metricClass.display) {
        extraTerms[metricClass.display] = metricClass.display;
      }
    });
  });

  // Update terms for objective display
  project.objectives.forEach((objective) => {
    extraTerms[objective.shortDesc] = objective.shortDesc;
    Object.keys(objective.countsToward).forEach((level) => {
      extraTerms[level] = level;
    });
  });

  fs.writeJSONSync(`src/i18n/extraTerms.json`, extraTerms, { spaces: 2 });
})();
