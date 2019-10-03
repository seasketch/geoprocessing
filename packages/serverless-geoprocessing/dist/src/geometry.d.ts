import { Feature, BBox } from "geojson";
import { GeoprocessingRequest } from "./handlers";
import "isomorphic-fetch";
export interface SketchProperties {
    /** string id of parent collection, if any */
    parent?: string;
    sketchClassId: string;
    name: string;
    /** ISO 8601 date string */
    updatedAt: string;
    [name: string]: any;
}
export interface SeaSketchFeature extends Feature {
    properties: SketchProperties;
    bbox: BBox;
}
export interface SeaSketchFeatureCollection {
    type: "FeatureCollection";
    properties: SketchProperties;
    features: Array<SeaSketchFeature | SeaSketchFeatureCollection>;
    bbox: BBox;
}
export declare type Sketch = SeaSketchFeature | SeaSketchFeatureCollection;
export declare function isSeaSketchFeatureCollection(obj: any): obj is SeaSketchFeatureCollection;
export declare function isSeaSketchFeature(obj: any): obj is SeaSketchFeature;
export declare const fetchGeoJSON: (request: GeoprocessingRequest) => Promise<SeaSketchFeature | SeaSketchFeatureCollection>;
