import { GeoprocessingTask } from "./tasks";
import { SeaSketchFeature, SeaSketchFeatureCollection } from "./geometry";
import crypto from "crypto";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export default function CacheModel(TableName: string, db: DocumentClient) {
  return {
    get: async (cacheKey: string): Promise<GeoprocessingTask | void> => {
      return;
    }
  }  
};

export const hash = (
  geojson: SeaSketchFeature | SeaSketchFeatureCollection
): string => {
  return crypto
    .createHash("md5")
    .update(JSON.stringify(geojson))
    .digest("hex");
};

export const makeCacheKey = (
  geojson: SeaSketchFeature | SeaSketchFeatureCollection,
  propNames: Array<string>=["updatedAt"]
): string => {
  const filteredProperties = {};
  for (const key in geojson.properties || {}) {
    if (propNames.indexOf(key) !== -1) {
      filteredProperties[key] = geojson.properties[key];
    }
  }
  return hash({
    ...geojson,
    properties: filteredProperties
  });
};
