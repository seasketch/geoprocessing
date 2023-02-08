// top-level module for geoprocessing library, primarily used for node environmnent
/**
 * `geoprocessing` is the main module used by a geoprocessing project.  It includes everything needing for creating, building, testing, and deploying a geoprocessing project with the exception of UI components which are exported separately in `client-ui`.
 * @module geoprocessing
 * @packageDocumentation
 */

export * from "./aws";
export * from "./datasources";
export * from "./helpers";
export * from "./iucn";
export * from "./metrics";
export * from "./rbcs";
export * from "./toolbox";
export * from "./types";
export * from "./testing";
export * from "./project";
export * from "./util";

export { default as version } from "../package.json";
