# Project Client

The ProjectClient is the bridge that connects project configuration with code. It makes it easier to bring together your projects datasources, geographies, objectives, metric group definitions, and precalculated metrics and use them in geoprocessing functions and report clients.

Every geoprocessing project has a ProjectClient in `project/projectClients.ts`. It doesn't do much beside imports your projects configuration files and instantiate an instance of [ProjectClientBase](https://seasketch.github.io/geoprocessing/api/classes/geoprocessing.ProjectClientBase.html). This base class is what provides all of the methods for conveniently accessing your projects configuration. It is worthwhile to review the available methods, and look at [other examples](https://github.com/search?q=org%3Aseasketch+%22project.%22&type=code) of how the project client is used. Here are some snippets.

Report client examples ([link](https://github.com/seasketch/cadiz-reports/blob/e83cc1c54132bd06a4bf048ea8a9fc5449c815b1/src/components/CommunitiesCard.tsx)):

```typescript
const projectBounds = project.basic.bbox;
const metricGroup = project.getMetricGroup("marineCommunities");
const totalMetrics = project.getPrecalcMetrics(
  metricGroup,
  "area",
  metricGroup.classKey
);

const ds = project.getVectorDatasourceById(geography.datasourceId)
const url = project.getDatasourceUrl(ds)
const geogFeatures = await getFeatures<Feature<Polygon | MultiPolygon>>(
  ds, url, { bbox: projectBounds }
);

return (
  <>
    <ResultsCard
      title={t("Marine Communities")}
      functionName="communitiesOverlap"
      useChildCard={true}
    >
      {(data: ReportResult) => {
        let singleMetrics = data.metrics.filter(
          (m) => m.sketchId === data.sketch.properties.id
        );

        const finalMetrics = [
          ...singleMetrics,
          ...toPercentMetric(
            singleMetrics,
            precalcMetrics,
            project.getMetricGroupPercId(metricGroup)
          ),
        ];
...
```

Geoprocessing function examples ([link](https://github.com/seasketch/gdansk-bay-reports/blob/e1143a069d13ba3a9cfbebae312fa250abea715c/src/functions/evAreaOverlap.ts)):

```typescript
export async function evAreaOverlap(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  extraParams: DefaultExtraParams = {}
): Promise<ReportResult> {
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  const clippedSketch = await clipToGeography(sketch, curGeography);
  const box = clippedSketch.bbox || bbox(clippedSketch);

  const metricGroup = project.getMetricGroup("evAreaOverlap");

  let cachedFeatures: Record<string, Feature<Polygon>[]> = {};

  const polysByBoundary = (
    await Promise.all(
      metricGroup.classes.map(async (curClass) => {
        if (!curClass.datasourceId) {
          throw new Error(`Missing datasourceId ${curClass.classId}`);
        }
        const ds = project.getDatasourceById(curClass.datasourceId);
        if (isInternalVectorDatasource(ds)) {
          const url = `${project.dataBucketUrl()}${getFlatGeobufFilename(ds)}`;

          // Fetch features overlapping with sketch, pull from cache if already fetched
          const dsFeatures =
            cachedFeatures[curClass.datasourceId] ||
            (await loadFgb<Feature<Polygon>>(url, box));
          cachedFeatures[curClass.datasourceId] = dsFeatures;

          // If this is a sub-class, filter by class name, exclude null geometry too
          const finalFeatures =
            ds.classKeys.length > 0
              ? dsFeatures.filter((feat) => {
                  const classId = Number(curClass.classId)
                    ? Number(curClass.classId)
                    : curClass.classId;
                  return (
                    feat.geometry &&
                    feat.properties![ds.classKeys[0]] === classId
                  );
                }, [])
              : dsFeatures;

          console.log(finalFeatures);
          return finalFeatures;
        }

        return [];
      })
    )
  ).reduce<Record<string, Feature<Polygon>[]>>((acc, polys, classIndex) => {
    return {
      ...acc,
      [metricGroup.classes[classIndex].classId]: polys,
    };
  }, {});
```
