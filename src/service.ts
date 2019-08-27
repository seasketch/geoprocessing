// response
export interface GeoprocessingProject {
  serviceUri: string;
  sourceUri?: string; //github repo
  published: string; //ISO 8601
  apiVersion: string;
  services: Array<GeoprocessingService>;
  clients: Array<ReportClient>;
}

export interface GeoprocessingService {
  id: string;
  endpoint: string;
  executionMode: ExecutionMode;
  medianDuration: number; //ms
  medianCost: number; //usd
  rateLimited: boolean;
  rateLimitPeriod: RateLimitPeriod;
  rateLimit: number;
  rateLimitConsumed: number;
  restrictedAccess: boolean;
}

export interface ReportClient {
  id: string;
  uri: string;
  bundleSize: number; //bytes
  apiVersion: string;
}

export type ExecutionMode = "async" | "sync";
export type RateLimitPeriod = "monthly" | "daily";
