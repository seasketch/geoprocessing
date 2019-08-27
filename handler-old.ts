import { GeoprocessingRequest } from "./types";
const parseOrFetchGeoJSON = require("./src/parseOrFetchGeoJSON");
const makeCacheKey = require("./src/makeCacheKey");
const respond = require("./src/respond");

/**
 * @param {function} geoprocessor Should accept a GeoJSON Feature Set and return a javascript object representing the results for reporting
 * @param {string} ecrTask ECR Task ID to run in the case of a Docker-based geoprocessing function
 */
export default function(geoprocessor, ecrTask) {
  return async function(event, context) {
    const response = await fetch("/google.com");
    const data = await response.json();
    
    const startTime = new Date().getTime();
    const request: GeoprocessingRequest = JSON.parse(event.body);
    const featureSet = await parseOrFetchGeoJSON(request);
    if (!request.skipCache) {
      let cacheKey = "";
      if (geoprocessor.makeCacheKey) {
        try {
          cacheKey = geoprocessor.makeCacheKey(featureSet);
        } catch (e) {
          return respond(
            new Error("Custom makeCacheKey function threw an exception")
          );
        }
      } else {
        cacheKey = makeCacheKey(featureSet);
      }
      const cachedResult = await fetchCache(cacheKey);
      if (cachedResult) {
        return respond(cachedResult, startTime);
      } else {
        if (ecrTask) {
          return launchTask(ecrTask, featureSet);
        } else {
          try {
            const result = await geoprocessor(featureSet);
            return respond(result, startTime);
          } catch (e) {
            return respond(
              new Error("Geoprocessing function threw an exception")
            );
          }  
        }
      }
    }
  };
}

