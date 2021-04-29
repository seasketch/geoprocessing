import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { GeoprocessingProject, GeoprocessingServiceMetadata } from "./types";
import { Manifest } from "../scripts/manifest";
// @ts-ignore
import manifestRaw from "./manifest.json";
// @ts-ignore
const manifest = manifestRaw as Manifest;

export const projectMetadata = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const { functions, region, ...projectInfo } = manifest;
  const uri = `https://${event.headers["Host"]}/prod/`;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "max-age=30, stale-while-revalidate=86400",
    },
    body: JSON.stringify(
      {
        ...projectInfo,
        ...(process.env.clientUrl
          ? {
              clientSideBundle: `https://${process.env.clientUrl}?service=${uri}`,
            }
          : {}),
        uri,
        geoprocessingServices: functions
          .filter((f) => f.purpose === "geoprocessing")
          .map((func) => ({
            ...func,
            endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
            handler: undefined,
            purpose: undefined,
          })),
        preprocessingServices: functions
          .filter((f) => f.purpose === "preprocessing")
          .map((func) => ({
            title: func.title,
            description: func.description,
            endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
            requiresProperties: func.requiresProperties,
          })),
      } as GeoprocessingProject,
      null,
      "  "
    ),
  };
};
