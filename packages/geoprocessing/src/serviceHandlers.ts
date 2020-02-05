import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { GeoprocessingProject, GeoprocessingServiceMetadata } from "./types";
import { Manifest } from "../scripts/manifest";
// @ts-ignore
import manifestRaw from "manifest";

const manifest = manifestRaw as Manifest;

export const projectMetadata = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const { functions, region, ...projectInfo } = manifest;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "max-age=60"
    },
    body: JSON.stringify({
      ...projectInfo,
      uri: `https://${event.headers["Host"]}/prod/`,
      geoprocessingServices: functions.map(func => ({
        endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
        ...func,
        handler: undefined
      }))
    } as GeoprocessingProject)
  };
};
