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
  const uri = `https://${event.headers["Host"]}/prod/`;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "max-age=60"
    },
    body: JSON.stringify(
      {
        ...projectInfo,
        clientSideBundle: `https://${process.env.clientUrl}?service=${uri}`,
        uri,
        geoprocessingServices: functions.map(func => ({
          endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
          ...func,
          handler: undefined
        }))
      } as GeoprocessingProject,
      null,
      "  "
    )
  };
};
