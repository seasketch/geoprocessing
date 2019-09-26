import { ExecutionMode } from "./handlers";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export interface GeoprocessingProject {
  location: string;
  // sourceUri?: string; // github repo or similar
  published: string; //  ISO 8601 date
  apiVersion: string; // semver
  services: Array<GeoprocessingService>;
  clients: Array<ReportClient>;
  clientUri: string;
  // clientBundleSize: number; //bytes
  // Labelling and attribution information may be displayed
  // in the SeaSketch admin interface
  title: string;
  description?: string;
  author: string;
  organization?: string;
  relatedUrl?: string; // May link to github or an org url
}

export interface GeoprocessingService {
  id: string;
  location: string;
  executionMode: ExecutionMode;
  requiresAttributes: Array<string>;
  timeout: number;
  // medianDuration: number; //ms
  // medianCost: number; //usd
  // rateLimited: boolean;
  // rateLimitPeriod: RateLimitPeriod;
  // rateLimit: number;
  // rateLimitConsumed: number;
  // if set, requests must include a token with an allowed issuer (iss)
  // restrictedAccess: boolean;
  // e.g. [sensitive-project.seasketch.org]
  // issAllowList?: Array<string>;
}

export interface ReportClient {
  title: string;
  description?: string;
  tabs: Array<ReportTab>;
}

export interface ReportTab {
  id: string;
  title: string;
  // List of geoprocessing service uris depended on by the tab
  requiredServices: Array<GeoprocessingService>; // array of locations
}

// type RateLimitPeriod = "monthly" | "daily";

export interface GeoprocessingConfig {
  description?: string;
  author?: string;
  publishedDate: string;
  relatedUri: string;
  clientUri: string;
  apiVersion: string;
  title: string;
  services: {
    [key: string]: ServiceDefinition;
  };
  clients: {
    [key: string]: ClientDefinition;
  };
}

interface ServiceDefinition {
  memorySize?: number;
  timeout?: number;
  executionMode?: ExecutionMode;
  requiresAttributes?: Array<string>;
}

interface ClientDefinition {
  description?: string;
  tabs: {
    [key: string]: TabDefinition;
  };
}

interface TabDefinition {
  id: string;
  title: string;
  requiredServices: Array<string>;
}

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const config = JSON.parse(process.env
    .GEOPROCESSING_CONFIG as string) as GeoprocessingConfig;
  const services = Object.keys(config.services).map(
    title =>
      ({
        id: title,
        location: `${process.env.SERVICE_URL}/${title}`,
        executionMode: config.services[title].executionMode || "sync",
        timeout: config.services[title].timeout,
        requiresAttributes: config.services[title].requiresAttributes || []
      } as GeoprocessingService)
  );
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      location: process.env.SERVICE_URL,
      published: config.publishedDate,
      apiVersion: config.apiVersion,
      clientUri: config.clientUri,
      title: config.title,
      description: config.description,
      author: config.author,
      relatedUrl: config.relatedUri,
      services,
      clients: Object.keys(config.clients).map(
        title =>
          ({
            title,
            description: config.clients[title].description,
            tabs: Object.keys(config.clients[title].tabs).map(
              tabTitle =>
                ({
                  id: tabTitle,
                  title: config.clients[title].tabs[tabTitle].title || tabTitle,
                  requiredServices: (
                    config.clients[title].tabs[tabTitle].requiredServices || []
                  ).map(title => services.find(s => s.id === title))
                } as ReportTab)
            )
          } as ReportClient)
      )
    } as GeoprocessingProject)
  };
};
