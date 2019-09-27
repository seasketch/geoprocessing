import { Feature, BBox, GeoJsonProperties } from "geojson";
import { GeoprocessingRequest } from "./handlers";
import 'isomorphic-fetch';
export interface SeaSketchFeature extends Feature {
    properties: GeoJsonProperties;
    bbox: BBox;
}
export interface SeaSketchFeatureCollection {
    type: "FeatureCollection";
    properties: GeoJsonProperties;
    features: Array<SeaSketchFeature | SeaSketchFeatureCollection>;
    bbox: BBox;
}
export declare type Sketch = SeaSketchFeature | SeaSketchFeatureCollection;
export declare function isSeaSketchFeatureCollection(obj: any): obj is SeaSketchFeatureCollection;
export declare function isSeaSketchFeature(obj: any): obj is SeaSketchFeature;
export declare const fetchGeoJSON: (request: GeoprocessingRequest) => Promise<SeaSketchFeature | SeaSketchFeatureCollection>;
