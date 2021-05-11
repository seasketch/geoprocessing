import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { GeoprocessingProject, GeoprocessingServiceMetadata } from "./types";
import { Manifest } from "../scripts/manifest";
// @ts-ignore
import manifestRaw from "./manifest.json";
const manifest = manifestRaw as Manifest;

export const projectMetadata = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const {
    preprocessingFunctions,
    geoprocessingFunctions,
    region,
    ...projectInfo
  } = manifest;
  const uri = `https://${event.headers["Host"]}/prod/`;
  const project: GeoprocessingProject = {
    ...projectInfo,
    ...(process.env.clientUrl
      ? {
          clientSideBundle: `https://${process.env.clientUrl}?service=${uri}`,
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
      })),
    preprocessingServices: preprocessingFunctions
      .filter((f) => f.purpose === "preprocessing")
      .map((func) => ({
        title: func.title,
        description: func.description,
        endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
        requiresProperties: func.requiresProperties,
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
