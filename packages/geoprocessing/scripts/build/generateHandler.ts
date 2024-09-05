import path from "path";
import fs from "fs-extra";

/**
 * Generates a root function for each Lambda that manages request and response, invoking the underlying Handler.
 * This wrapper is necessary because otherwise the GeoprocessingHandler class methods can't properly reference `this`
 * @param funcPath - path to gp handler function to wrap
 * @param handlerDest - directory to write wrap handler function to
 */
export function generateHandler(funcPath, handlerDest) {
  const handlerFilename = path.basename(funcPath);
  const handlerPath = path.join(
    handlerDest,
    `${handlerFilename.split(".").slice(0, -1).join(".")}Handler.ts`,
  );
  fs.writeFileSync(
    handlerPath,
    `
    import { VectorDataSource } from "@seasketch/geoprocessing";
    import Handler from "${funcPath.replace(/\.ts$/, "")}";
    import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
    export const handler = async (event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
      return await Handler.lambdaHandler(event, context);
    }
    // Exports for manifest
    export const handlerFilename = '${handlerFilename}';
    export const options = Handler.options;
    export const sources = VectorDataSource.getRegisteredSources();
    VectorDataSource.clearRegisteredSources();
  `,
  );
  return handlerPath;
}
