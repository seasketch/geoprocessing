import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import {
  PreprocessingHandlerOptions,
  PreprocessingRequest,
  PreprocessingResponse,
  Feature,
  Polygon,
  LineString,
  Point,
  Sketch,
  ValidationError,
} from "../types";

const commonHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "*",
};

/**
 * Lambda handler for a preprocessing function
 * @template G the geometry type of the feature for the geoprocessing function, automatically set from func feature type
 */
export class PreprocessingHandler<G = Polygon | LineString | Point> {
  func: (feature: Feature<G> | Sketch<G>) => Promise<Feature<G> | Sketch<G>>;
  options: PreprocessingHandlerOptions;
  // Store last request id to avoid retries on a failure of the lambda
  // aws runs several retries and there appears to be no setting to avoid this
  lastRequestId?: string;

  /**
   * @param func the preprocessing function, overloaded to allow caller to pass Feature *or* Sketch
   * @param options prerocessing function deployment options
   * @template G the geometry type of features for the preprocessing function, automatically set from func feature type
   */
  constructor(
    func: (feature: Feature<G>) => Promise<Feature<G>>,
    options: PreprocessingHandlerOptions
  );
  constructor(
    func: (feature: Sketch<G>) => Promise<Sketch<G>>,
    options: PreprocessingHandlerOptions
  );
  constructor(
    func: (feature) => Promise<any>,
    options: PreprocessingHandlerOptions
  ) {
    this.func = func;
    this.options = Object.assign({ memory: 1024 }, options);
  }

  async lambdaHandler(
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> {
    // TODO: Rate limiting (probably in api gateway?)
    let request;
    try {
      request = this.parseRequest(event);
    } catch (e: unknown) {
      return {
        statusCode: 500,
        headers: commonHeaders,
        body: JSON.stringify({
          error: e instanceof Error ? e.message : "Internal server error",
          status: "error",
        }),
      };
    }
    // Bail out if replaying previous task
    if (context.awsRequestId && context.awsRequestId === this.lastRequestId) {
      // don't replay
      if (process.env.NODE_ENV !== "test") {
        console.log("cancelling since event is being replayed");
      }
      return {
        statusCode: 200,
        body: "",
      };
    } else {
      this.lastRequestId = context.awsRequestId;
    }
    try {
      const feature = await this.func(request.feature);
      return {
        statusCode: 200,
        headers: commonHeaders,
        body: JSON.stringify({
          data: feature,
          status: "ok",
        } as PreprocessingResponse<Feature<G> | Sketch<G>>),
      };
    } catch (e: unknown) {
      if (e instanceof ValidationError) {
        return {
          statusCode: 200,
          headers: commonHeaders,
          body: JSON.stringify({
            error: e.message,
            status: "validationError",
          } as PreprocessingResponse),
        };
      } else {
        return {
          statusCode: 500,
          headers: commonHeaders,
          body: JSON.stringify({
            error: e instanceof Error ? e.message : "Internal server error",
            status: "error",
          } as PreprocessingResponse),
        };
      }
    }
  }

  parseRequest(event: APIGatewayProxyEvent): PreprocessingRequest {
    if (!event.body) {
      throw new Error("Invalid request. No request body");
    }
    const json = JSON.parse(event.body);
    if (!json.feature || !json.feature.type) {
      throw new Error(
        "Invalid request. body.feature must be specified as valid GeoJSON"
      );
    }
    return {
      feature: json.feature,
      // TODO: support more response types in seasketch/next
      responseFormat: "application/json",
    };
  }
}
