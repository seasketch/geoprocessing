import area from "@turf/area";
import {
  Metric,
  Polygon,
  Geography,
  featuresSchema,
  VectorDatasource,
} from "../../../src/types";
import {
  Feature,
  FeatureCollection,
  MultiPolygon,
  ProjectClientBase,
  clipMultiMerge,
  createMetric,
  datasourceConfig,
} from "../../../src";
import { getFeatures } from "../../../src/dataproviders";
import { featureCollection } from "@turf/helpers";
import truncate from "@turf/truncate";
import { getGeographyFeatures } from "../geographies/helpers";

/**
 * Creates precalc metrics for a datasource and geography
 * @param datasource InternalVectorDatasource that's been imported
 * @param geography Geography to be calculated for
 * @returns Metric[] to be added to precalc.json
 */
export async function precalcVectorDatasource<C extends ProjectClientBase>(
  projectClient: C,
  /** Input datasource */
  datasource: VectorDatasource,
  /** Input geography */
  geography: Geography,
  /** Geography datasource to get geography from */
  geogDs: VectorDatasource,
  extraOptions: {
    /** Alternative path to store precalc data. useful for testing */
    newDstPath?: string;
    /** Alternative port to fetch data from */
    port?: number;
  } = {}
): Promise<Metric[]> {
  // need 8001 for unit tests
  const url = projectClient.getDatasourceUrl(datasource, {
    local: true,
    subPath: extraOptions.newDstPath,
    port: extraOptions.port || 8001, // use default project port, override such as for tests
  });

  // Create metrics and return to precalc.ts
  console.log("precalcing vector datasource", url);
  return genVectorMetrics(datasource, url, geography, geogDs, extraOptions);
}

/**
 * Returns Metric array for vector datasource and geography
 * @param datasource ImportVectorDatasourceConfig datasource to calculate metrics for
 * @param geography Geography to calculate metrics for
 * @returns Metric[]
 */
export async function genVectorMetrics(
  /** Input datasource */
  datasource: VectorDatasource,
  /** Input datasource url */
  url: string,
  /** Input geography */
  geography: Geography,
  /** Geography datasource to get geography from */
  geogDs: VectorDatasource,
  extraOptions: {
    /** Alternative path to store precalc data. useful for testing */
    newDstPath?: string;
  }
): Promise<Metric[]> {
  const dstPath = extraOptions.newDstPath || datasourceConfig.defaultDstPath;

  // console.log(
  //   `DATASOURCE: ${datasource.datasourceId}}, GEOGRAPHY: ${geography.geographyId}}\n`
  // );

  const dsFeatureColl: FeatureCollection<Polygon | MultiPolygon> =
    await (async () => {
      const feats = await getFeatures(datasource, url);
      // Make sure only contains polygon or multipolygon in array
      const validFeats = featuresSchema.parse(feats); // was erroring on missing properties property
      return truncate(featureCollection(validFeats), { mutate: true });
    })();

  const geographyFeatureColl = await getGeographyFeatures(
    geography,
    geogDs,
    dstPath
  );
  // console.log("geographyFeatureColl", JSON.stringify(geographyFeatureColl));

  // Creates record of all class keys present in OG features
  // to avoid missing a class after cropping
  // key - class name e.g. geomorphology, reef type
  // values - array of all class values e.g. [hard, soft, mixed]
  let featureCollClasses: Record<string, string[]> = {};
  datasource.classKeys.forEach((classProperty) => {
    dsFeatureColl.features.forEach((feat) => {
      if (!feat.properties) throw new Error("Missing properties");
      if (!featureCollClasses[classProperty]) {
        featureCollClasses[classProperty] = [];
      }
      if (
        !featureCollClasses[classProperty].includes(
          feat.properties[classProperty]
        )
      ) {
        featureCollClasses[classProperty].push(
          feat.properties[classProperty].toString() // force string-based index
        );
      }
    });
  });

  // Clip vector data to geography boundaries
  const dsClippedFeatures = dsFeatureColl.features
    .map(
      (feat) =>
        clipMultiMerge(feat, geographyFeatureColl, "intersection", {
          properties: feat.properties,
        }) as Feature<Polygon | MultiPolygon>
    )
    .filter((e) => e);

  // Keeps metadata intact but overwrites geometry with clipped features
  const clippedFeatureColl = {
    ...dsFeatureColl,
    features: dsClippedFeatures,
  };

  // If a simple vector datasource with no classes, return total metrics
  if (!datasource.classKeys || datasource.classKeys.length === 0)
    return [
      createMetric({
        geographyId: geography.geographyId,
        classId: datasource.datasourceId + "-total",
        metricId: "count",
        value: clippedFeatureColl.features.length,
      }),
      createMetric({
        geographyId: geography.geographyId,
        classId: datasource.datasourceId + "-total",
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
      classId: datasource.datasourceId + "-total",
      metricId: "count",
      value: totals.count,
    }),
    createMetric({
      geographyId: geography.geographyId,
      classId: datasource.datasourceId + "-total",
      metricId: "area",
      value: totals.area,
    }),
  ];

  // Create class metrics
  let classMetrics: Metric[] = [];
  datasource.classKeys.forEach((classProperty) => {
    const classes = clippedFeatureColl.features.reduce<
      Record<string, { count: number; area: number }>
    >((classesSoFar, feat) => {
      if (!feat.properties) throw new Error("Missing properties");
      if (!datasource.classKeys) throw new Error("Missing classProperty");
      const curClass = feat.properties[classProperty].toString(); // force string-based index
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
          classId: datasource.datasourceId + "-" + curClass,
          metricId: "count",
          value: classes[curClass].count,
        })
      );
      classMetrics.push(
        createMetric({
          geographyId: geography.geographyId,
          classId: datasource.datasourceId + "-" + curClass,
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
            classId: datasource.datasourceId + "-" + curClass,
            metricId: "count",
            value: 0,
          })
        );
        classMetrics.push(
          createMetric({
            geographyId: geography.geographyId,
            classId: datasource.datasourceId + "-" + curClass,
            metricId: "area",
            value: 0,
          })
        );
      }
    });
  });

  return totalMetrics.concat(classMetrics);
}
