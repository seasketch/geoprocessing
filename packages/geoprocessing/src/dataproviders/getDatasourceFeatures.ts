import {
  isExternalVectorDatasource,
  isInternalVectorDatasource,
  VectorDataSource,
} from "../datasources/index.js";
import { loadFgb } from "./flatgeobuf.js";
import {
  ExternalVectorDatasource,
  InternalVectorDatasource,
  Feature,
  VectorDatasource,
  BBox,
  SketchCollection,
  Sketch,
} from "../types/index.js";
import { getFeaturesForSketchBBoxes } from "./getFeaturesForSketchBBoxes.js";
import {
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

/** Specify one or more literal values for one or more vector Feature properties */
export interface VectorPropertyFilter {
  property: string;
  values: (string | number)[];
}
export interface GetDatasourceFeaturesOptions {
  /** Fetches features overlapping with bounding box */
  bbox?: BBox;
  /** Filter features by property having one or more specific values */
  propertyFilter?: VectorPropertyFilter;
  /** Provide if you have subdivided dataset and want to rebuild (union) subdivided polygons based on having same value for this property name */
  unionProperty?: string;
  /** Fetches features overlapping with sketch bounding box, can be more precise than passing single bounding box  */
  sketch?: Sketch | SketchCollection;
}

/**
 * Returns features for a variety of vector datasources and formats, with additional filter options
 */

/**
 * Fetches and returns features for a given datasource supporting a variety of formats/clients
 * @param datasource the datasource to fetch features from
 * @param url the url of the datasource
 * @param options.bbox fetch features overlapping with bounding box
 * @param options.propertyFilter filter features by property having one or more specific values
 * @param options.unionProperty provide if you have subdivided dataset and want to rebuild (union) subdivided polygons based on having same value for this property name
 * @param options.sketch fetch features overlapping with sketch bounding box, can be more precise than passing single bounding box
 * @returns feature array
 */
export async function getDatasourceFeatures<
  G extends
    | Point
    | MultiPoint
    | LineString
    | MultiLineString
    | Polygon
    | MultiPolygon,
>(
  datasource:
    | InternalVectorDatasource
    | ExternalVectorDatasource
    | VectorDatasource,
  /** url of datasource */
  url: string,
  options: GetDatasourceFeaturesOptions = {},
): Promise<Feature<G>[]> {
  const propertyFilter = datasource.propertyFilter || options.propertyFilter;
  const bboxFilter = datasource.bboxFilter || options.bbox;

  let features: Feature<G>[] = [];
  if (isInternalVectorDatasource(datasource)) {
    if (options.sketch) {
      features = await getFeaturesForSketchBBoxes(options.sketch, url);
    } else {
      features = await loadFgb<Feature<G>>(url, bboxFilter);
    }
  } else if (
    isExternalVectorDatasource(datasource) &&
    datasource.formats &&
    datasource.formats.includes("subdivided")
  ) {
    // prefer subdivided if external
    if (!bboxFilter) {
      throw new Error(
        `bbox option expected for ExternalVectorDatasource ${datasource.datasourceId}`,
      );
    }
    const vectorDs = new VectorDataSource(url);
    if (options.unionProperty) {
      const fc = await vectorDs.fetchUnion(bboxFilter, options.unionProperty);
      features = fc.features as Feature<G>[];
    } else {
      features = (await vectorDs.fetch(bboxFilter)) as Feature<G>[];
    }
  } else if (
    isExternalVectorDatasource(datasource) &&
    datasource.formats &&
    datasource.formats.includes("fgb")
  ) {
    // fallback to flatgeobuf
    features = await loadFgb<Feature<G>>(url, bboxFilter);
  }

  // filter by property value
  if (propertyFilter) {
    features = features.filter((curFeat) => {
      if (!curFeat.properties) return false;
      return propertyFilter?.values.includes(
        curFeat.properties[propertyFilter.property],
      );
    });
  }

  return features;
}

/**
 * Fetches and returns features for a given datasource supporting a variety of formats/clients
 * @param datasource the datasource to fetch features from
 * @param url the url of the datasource
 * @param options.bbox fetch features overlapping with bounding box
 * @param options.propertyFilter filter features by property having one or more specific values
 * @param options.unionProperty provide if you have subdivided dataset and want to rebuild (union) subdivided polygons based on having same value for this property name
 * @param options.sketch fetch features overlapping with sketch bounding box, can be more precise than passing single bounding box
 * @returns feature array
 * @deprecated use getDatasourceFeatures instead
 */
export async function getFeatures<
  G extends
    | Point
    | MultiPoint
    | LineString
    | MultiLineString
    | Polygon
    | MultiPolygon,
>(
  datasource:
    | InternalVectorDatasource
    | ExternalVectorDatasource
    | VectorDatasource,
  /** url of datasource */
  url: string,
  options: GetDatasourceFeaturesOptions = {},
): Promise<Feature<G>[]> {
  return getDatasourceFeatures(datasource, url, options);
}
