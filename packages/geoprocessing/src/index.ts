// top-level module for geoprocessing library, primarily used for node environmnent
/**
 * `geoprocessing` is the main module used by a geoprocessing project.  It includes everything needing for creating, building, testing, and deploying a geoprocessing project with the exception of UI components which are exported separately in `client-ui`.
 * @module geoprocessing
 * @packageDocumentation
 */

export * from "./aws/index.js";
export * from "./datasources/index.js";
export * from "./dataproviders/index.js";
export * from "./helpers/index.js";
export * from "./iucn/index.js";
export * from "./metrics/index.js";
export * from "./rbcs/index.js";
export * from "./toolbox/index.js";
export * from "./types/index.js";
export * from "./testing/index.js";
export * from "./project/ProjectClientBase.js";
export * from "./util/index.js";
export * from "./context/index.js";

export { default as version } from "../package.json" with { type: "json" };
