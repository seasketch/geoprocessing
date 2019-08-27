interface GeoprocessingProject {
    sourceUri: string;
    services: Array<GeoprocessingService>;
    clients: Array<ReportClient>;
}
declare type ExecutionMode = "async" | "sync";
declare type RateLimitPeriod = "monthly" | "daily";
interface GeoprocessingService {
    id: string;
    executionMode: ExecutionMode;
    medianDuration: number;
    medianCost: number;
    rateLimitPeriod: RateLimitPeriod;
    rateLimit: number;
    rateLimitConsumed: number;
}
interface ReportClient {
    id: string;
    uri: string;
    bundleSize: number;
}
