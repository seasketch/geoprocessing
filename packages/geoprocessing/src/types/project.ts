import { GeoprocessingServiceMetadata, PreprocessingService } from "./service";

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

interface ClientJsonConfig {
  name: string;
  description: string;
  source: string;
}

export interface GeoprocessingJsonConfig {
  author: string;
  organization?: string;
  region: string;
  geoprocessingFunctions: string[];
  preprocessingFunctions: string[];
  clients: ClientJsonConfig[];
}

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
