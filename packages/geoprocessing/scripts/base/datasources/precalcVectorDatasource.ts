import area from "@turf/area";
import {
  ImportVectorDatasourceConfig,
  InternalVectorDatasource,
  Metric,
  Polygon,
  Geography,
} from "../../../src/types";
import {
  Feature,
  MultiPolygon,
  ProjectClientBase,
  clipMultiMerge,
  createMetric,
} from "../../../src";
import { genVectorConfig } from "./genVectorConfig";
import { readDatasourceGeojsonById } from "./datasources";

/**
 * Creates precalc metrics for a datasource and geography
 * @param datasource InternalVectorDatasource that's been imported
 * @param geography Geography to be calculated for
 * @returns Metric[] to be added to precalc.json
 */
export async function precalcVectorDatasource<C extends ProjectClientBase>(
  projectClient: C,
  datasource: InternalVectorDatasource,
  geography: Geography,
  extraOptions: {
    /** Alternative path to store precalc data. useful for testing */
    newDstPath?: string;
  } = {}
): Promise<Metric[]> {
  // Creates vector config from datasources.json
  const vectorConfig = genVectorConfig(
    projectClient,
    datasource,
    extraOptions.newDstPath
  );

  // Create metrics and return to precalc.ts
  return genVectorMetrics(vectorConfig, geography);
}

/**
 * Returns Metric array for vector datasource and geography
 * @param vectorConfig ImportVectorDatasourceConfig datasource to calculate metrics for
 * @param geography Geography to calculate metrics for
 * @returns Metric[]
 */
export function genVectorMetrics(
  vectorConfig: ImportVectorDatasourceConfig,
  geography: Geography
): Metric[] {
  // Read in vector datasource (geojson) as FeatureCollection
  const featureCollection = readDatasourceGeojsonById(
    vectorConfig.datasourceId,
    vectorConfig.dstPath
  );

  // Read in vector geography datasource (geojson) as FeatureCollection
  const geographyFeatureColl = readDatasourceGeojsonById(
    geography.datasourceId,
    vectorConfig.dstPath
  );

  // Creates record of all class keys present in OG features
  // to avoid missing a class after cropping
  // key - class name e.g. geomorphology, reef type
  // values - array of all class values e.g. [hard, soft, mixed]
  let featureCollClasses: Record<string, string[]> = {};
  vectorConfig.classKeys.forEach((classProperty) => {
    featureCollection.features.forEach((feat) => {
      if (!feat.properties) throw new Error("Missing properties");
      if (!featureCollClasses[classProperty]) {
        featureCollClasses[classProperty] = [];
      }
      if (
        !featureCollClasses[classProperty].includes(
          feat.properties[classProperty]
        )
      ) {
        featureCollClasses[classProperty].push(feat.properties[classProperty]);
      }
    });
  });

  // Clip vector data to geography boundaries
  const clippedFeatures = featureCollection.features
    .map(
      (feat) =>
        clipMultiMerge(feat, geographyFeatureColl, "intersection", {
          properties: feat.properties,
        }) as Feature<Polygon | MultiPolygon>
    )
    .filter((e) => e);

  // Keeps metadata intact but overwrites geometry with clipped features
  const clippedFeatureColl = {
    ...featureCollection,
    features: clippedFeatures,
  };

  // If a simple vector datasource with no classes, return total metrics
  if (!vectorConfig.classKeys || vectorConfig.classKeys.length === 0)
    return [
      createMetric({
        geographyId: geography.geographyId,
        classId: vectorConfig.datasourceId + "-total",
        metricId: "count",
        value: clippedFeatureColl.features.length,
      }),
      createMetric({
        geographyId: geography.geographyId,
        classId: vectorConfig.datasourceId + "-total",
        metricId: "area",
        value: area(clippedFeatureColl),
      }),
    ];

  const totals = clippedFeatureColl.features.reduce(
    (stats, feat) => {
      const featArea = area(feat);
      return { ...stats, count: stats.count + 1, area: stats.area + featArea };
    },
    { count: 0, area: 0 }
  );

  // Create total metrics
  const totalMetrics: Metric[] = [
    createMetric({
      geographyId: geography.geographyId,
      classId: vectorConfig.datasourceId + "-total",
      metricId: "count",
      value: totals.count,
    }),
    createMetric({
      geographyId: geography.geographyId,
      classId: vectorConfig.datasourceId + "-total",
      metricId: "area",
      value: totals.area,
    }),
  ];

  // Create class metrics
  let classMetrics: Metric[] = [];
  vectorConfig.classKeys.forEach((classProperty) => {
    const classes = clippedFeatureColl.features.reduce<
      Record<string, { count: number; area: number }>
    >((classesSoFar, feat) => {
      if (!feat.properties) throw new Error("Missing properties");
      if (!vectorConfig.classKeys) throw new Error("Missing classProperty");
      const curClass = feat.properties[classProperty];
      const curCount = classesSoFar[curClass]?.count || 0;
      const curArea = classesSoFar[curClass]?.area || 0;
      const featArea = area(feat);
      return {
        ...classesSoFar,
        [curClass]: {
          count: curCount + 1,
          area: curArea + featArea,
        },
      };
    }, {});

    Object.keys(classes).forEach((curClass: string) => {
      classMetrics.push(
        createMetric({
          geographyId: geography.geographyId,
          classId: vectorConfig.datasourceId + "-" + curClass,
          metricId: "count",
          value: classes[curClass].count,
        })
      );
      classMetrics.push(
        createMetric({
          geographyId: geography.geographyId,
          classId: vectorConfig.datasourceId + "-" + curClass,
          metricId: "area",
          value: classes[curClass].area,
        })
      );
    });

    // Creates zero metrics for features classes lost during clipping
    featureCollClasses[classProperty].forEach((curClass) => {
      if (!Object.keys(classes).includes(curClass)) {
        classMetrics.push(
          createMetric({
            geographyId: geography.geographyId,
            classId: vectorConfig.datasourceId + "-" + curClass,
            metricId: "count",
            value: 0,
          })
        );
        classMetrics.push(
          createMetric({
            geographyId: geography.geographyId,
            classId: vectorConfig.datasourceId + "-" + curClass,
            metricId: "area",
            value: 0,
          })
        );
      }
    });
  });

  return totalMetrics.concat(classMetrics);
}
