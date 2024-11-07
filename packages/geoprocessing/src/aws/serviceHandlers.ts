import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { GeoprocessingProject } from "../types/index.js";
import { Manifest } from "../../scripts/manifest.js";
import fs from "fs-extra";

export const projectMetadata = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  const manifest = (await fs.readJson("./manifest.json")) as Manifest;

  const { preprocessingFunctions, geoprocessingFunctions, ...projectInfo } =
    manifest;
  const uri = `https://${event.headers["Host"]}/prod/`;
  const project: Partial<GeoprocessingProject> = {
    ...projectInfo,
    ...(process.env.clientDistributionUrl
      ? {
          clientSideBundle: `https://${process.env.clientDistributionUrl}?service=${uri}`,
        }
      : {}),
    uri,
    geoprocessingServices: geoprocessingFunctions
      .filter((f) => f.purpose === "geoprocessing")
      .map((func) => ({
        ...func,
        endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
        handler: undefined,
        purpose: undefined,
        requiresProperties: func.requiresProperties || [],
      })),
    preprocessingServices: preprocessingFunctions
      .filter((f) => f.purpose === "preprocessing")
      .map((func) => ({
        title: func.title,
        description: func.description,
        endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
        requiresProperties: func.requiresProperties || [],
      })),
  };
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "max-age=30, stale-while-revalidate=86400",
    },
    body: JSON.stringify(project, null, "  "),
  };
};
