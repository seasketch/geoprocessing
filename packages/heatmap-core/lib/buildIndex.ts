import fs from "fs";
import geojson2h3 from "geojson2h3";
import h3 from "h3-js";
import * as turf from "@turf/turf";
import { calcSap } from "./sap";
import {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  Geometry,
  Feature,
} from "geojson";
import * as d3 from "d3";

export type H3Index = string;
export type H3Resolution = string;

/** Metadata for heatmap method */
export interface MethodMeta {
  name: string;
  min: number;
  max: number;
  quantileBreaks?: number[];
}

/** Metadata for H3 resolution */
export interface ResolutionMeta {
  resolution: number;
  methods: Record<string, MethodMeta>;
}

/** Metadata for all H3 resolutions */
export interface Meta {
  resolutions: Record<H3Resolution, ResolutionMeta>;
}

// Heatmap values for a single H3 cell
export interface HeatCell {
  h3Index: string;
  sap: number;
  sapWeighted: number | null;
  shapeCount: number;
}

export type HeatMap = Record<string, HeatCell>;

export interface BuildOptions {
  resolutions: number[];
  numClasses: number;
}

/** Given FeatureCollection */
export function buildIndex(
  featureColl: FeatureCollection<Polygon | MultiPolygon>,
  buildOptions: BuildOptions
) {
  const result: Meta["resolutions"] = Array.from(
    { length: buildOptions.resolutions.length },
    (x, resIndex) => ({
      resolution: buildOptions.resolutions[resIndex],
      methods: {},
    })
  ).reduce((soFar, resResult) => {
    return { ...soFar, [resResult.resolution]: resResult };
  }, {});

  const index = buildOptions.resolutions.map((res, resIndex) =>
    genRes(res, resIndex)
  );

  const meta = {
    resolutions: result,
    numClasses: buildOptions.numClasses,
  };

  return {
    meta,
    index,
  };

  /**
   * Generates heatmap for given resolution and returns in multiple forms
   */
  function genRes(res: number, resIndex: number) {
    const heatMap: Record<string, HeatCell> = {};

    const weightField = "importance";

    featureColl.features.forEach((feat) => {
      // Calculate heatmap value for feature
      const area = turf.area(feat);
      const sap = calcSap(area);
      const sapWeighted = (() => {
        if (feat.properties![weightField] >= 0) {
          return calcSap(area, { importance: feat.properties![weightField] });
        } else {
          console.log(`Missing weight property: ${feat.properties?.resp_id}`);
          return null;
        }
      })();

      // Get h3 region cell IDs intersecting with feature
      const region = geojson2h3.featureToH3Set(feat, res, {
        ensureOutput: true,
      });

      // Add heatmap values for current feature for each cell ID
      region.forEach((reg) => {
        if (heatMap[reg]) {
          // update
          heatMap[reg].sap += sap;
          heatMap[reg].shapeCount += 1;
          if (sapWeighted && sapWeighted > 0) {
            heatMap[reg].sapWeighted =
              heatMap[reg].sapWeighted || 0 + sapWeighted;
          }
        } else {
          // initialize
          heatMap[reg] = {
            h3Index: reg,
            sap,
            sapWeighted,
            shapeCount: 1,
          };
        }
      });
    });

    // Get min/max stats
    const heatObjects = Object.values(heatMap);

    // Normalize heatMap
    // const min = d3.min(heatObjects, o => o.sap)
    // const max = d3.max(heatObjects, o => o.sap)
    // const scale = d3.scaleLinear().domain([min, max]).range([0, 1])
    // Object.keys(heatMap).forEach(cellId => heatMap[cellId] = scale(heatMap[cellId]))

    // initialize quantile classes and bins
    const heatClasses = Array.from(
      { length: buildOptions.numClasses },
      (x, i) => i
    );

    let sapByClassCompact: H3Index[][] = heatClasses.map(() => []);

    // Assign h3 cells to quantile class - using sap value
    const quantileScale = d3
      .scaleQuantile()
      .domain(Object.values(heatMap).map((heatObject) => heatObject.sap))
      .range(heatClasses);

    // group cellIds by quantile class  string[quantileClass#][]
    Object.keys(heatMap).map((cellId) => {
      const quantClassNum = quantileScale(heatMap[cellId].sap);
      sapByClassCompact[quantClassNum].push(cellId);
    });

    // Compact
    sapByClassCompact = sapByClassCompact.map((classHexagons) =>
      h3.compact(classHexagons)
    );

    // Geo
    // const sapByClassGeo = geojsonFromH3Classes(sapByClassCompact);
    // const heatMapGeo = geojsonFromH3HeatMap(heatMap);

    result[res].methods.sap = {
      name: "sap",
      min: d3.min(heatObjects, (o) => o.sap) || 0,
      max: d3.max(heatObjects, (o) => o.sap) || 0,
      quantileBreaks: quantileScale.quantiles(),
    };

    // return { heatMap, heatMapGeo, sapByClassCompact, sapByClassGeo };
    return { heatMap, sapByClassCompact };
  }
}

function geojsonFromH3HeatMap(heatMap: HeatMap) {
  // Transform the current hexagon map into a GeoJSON object
  const polys = Object.keys(heatMap).map((curHex) => {
    return geojson2h3.h3ToFeature(curHex, heatMap[curHex]);
  });
  return turf.featureCollection(polys);
}

function geojsonFromH3Classes(hexByClass: H3Index[][]) {
  // Transform the current hexagon map into a GeoJSON object
  let polys: Feature<Geometry>[] = [];
  const geojsonByClass = hexByClass.forEach((curHexes, curClass) => {
    const classHexPolys = geojson2h3.h3SetToFeatureCollection(
      curHexes,
      (hex) => ({ classId: curClass })
    );
    const feat = classHexPolys.features;
    polys = polys.concat(classHexPolys.features);
  });
  return turf.featureCollection(polys);
}
