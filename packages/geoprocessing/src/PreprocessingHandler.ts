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
} from "./types";

export class ValidationError extends Error {}

const commonHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "*",
};

export class PreprocessingHandler {
  func: (feature: Feature) => Promise<Feature>;
  options: PreprocessingHandlerOptions;
  // Store last request id to avoid retries on a failure of the lambda
  // aws runs several retries and there appears to be no setting to avoid this
  lastRequestId?: string;

  constructor(
    func: (feature: Feature) => Promise<Feature>,
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
    } catch (e) {
      return {
        statusCode: 500,
        headers: commonHeaders,
        body: JSON.stringify({
          error: e.message,
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
        } as PreprocessingResponse),
      };
    } catch (e) {
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
            error: e.message,
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
