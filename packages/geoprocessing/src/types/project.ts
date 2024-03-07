import { GeoprocessingServiceMetadata, PreprocessingService } from "./service.js";
import { z } from "zod";

export interface GeoprocessingProject {
  uri: string;
  apiVersion: string; // semver
  geoprocessingServices: GeoprocessingServiceMetadata[];
  preprocessingServices: PreprocessingService[];
  clients: ReportClient[];
  feedbackClients: DigitizingFeedbackClient[];
  // Labelling and attribution information may be displayed
  // in the SeaSketch admin interface
  title: string;
  author: string;
  organization?: string;
  relatedUri?: string; // May link to github or an org uri
  sourceUri?: string; // github repo or similar
  published: string; //  ISO 8601 date
}

/** Represents a geoprocessing client object */
export const clientJsonConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  source: z.string(),
});
/** Represents a geoprocessing client object */
export type ClientJsonConfig = z.infer<typeof clientJsonConfigSchema>;

/** Represents a single JS package */
export const geoprocessingConfigSchema = z.object({
  author: z.string(),
  organization: z.string().optional(),
  region: z.string(),
  geoprocessingFunctions: z.array(z.string()),
  preprocessingFunctions: z.array(z.string()),
  clients: z.array(clientJsonConfigSchema),
});
/** Represents a single JS package */
export type GeoprocessingJsonConfig = z.infer<typeof geoprocessingConfigSchema>;

interface ReportClient {
  title: string;
  uri: string;
  bundleSize: number; //bytes
  apiVersion: string;
  tabs: ReportTab[];
}

interface ReportTab {
  title: string;
}

interface DigitizingFeedbackClient {
  title: string;
  uri: string;
  bundleSize: number; //bytes
  apiVersion: string;
  offlineSupport: boolean;
}
