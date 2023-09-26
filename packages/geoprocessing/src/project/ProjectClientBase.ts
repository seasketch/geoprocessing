import { TFunction } from "i18next";
import {
  Datasource,
  datasourcesSchema,
  InternalVectorDatasource,
  Stats,
  InternalRasterDatasource,
  getDatasourceById,
  getInternalRasterDatasourceById,
  getInternalVectorDatasourceById,
  getExternalVectorDatasourceById,
  getObjectiveById,
  getMetricGroupObjectiveIds,
  MetricGroup,
  MetricGroups,
  metricGroupsSchema,
  objectivesSchema,
  GeoprocessingJsonConfig,
  Metric,
  Package,
  packageSchema,
  geoprocessingConfigSchema,
  Project,
  projectSchema,
  Objective,
  Objectives,
  isInternalVectorDatasource,
  getFlatGeobufFilename,
  ExternalVectorDatasource,
  isExternalVectorDatasource,
  isinternalDatasource,
  isExternalDatasource,
  Geography,
  geographiesSchema,
  metricsSchema,
  createMetrics,
} from "..";

export interface ProjectClientConfig {
  basic: any;
  datasources: any;
  metricGroups: any;
  geographies: any;
  objectives: any;
  package: any;
  geoprocessing: any;
  precalc: any;
}

export interface ProjectClientInterface {
  getDatasourceById(datasourceId: string): Datasource;
  dataBucketUrl(local?: boolean, port?: number): string;
  getVectorDatasourceUrl(
    ds: InternalVectorDatasource | ExternalVectorDatasource
  );
}

/**
 * Client for reading project configuration/metadata.
 */
export class ProjectClientBase implements ProjectClientInterface {
  private _project: Project;
  private _datasources: Datasource[];
  private _metricGroups: MetricGroups;
  private _geographies: Geography[];
  private _objectives: Objectives;
  private _package: Package;
  private _geoprocessing: GeoprocessingJsonConfig;
  private _precalc: Metric[];

  constructor(config: ProjectClientConfig) {
    this._project = projectSchema.parse(config.basic);
    this._datasources = datasourcesSchema.parse(config.datasources);
    this._metricGroups = metricGroupsSchema.parse(config.metricGroups);
    this._geographies = geographiesSchema.parse(config.geographies);
    this._objectives = objectivesSchema.parse(config.objectives);
    this._package = packageSchema.parse(config.package);
    this._geoprocessing = geoprocessingConfigSchema.parse(config.geoprocessing);
    this._precalc = metricsSchema.parse(config.precalc);
  }

  // ASSETS //

  /** Returns typed config from project.json */
  public get basic(): Project {
    return this._project;
  }

  /** Returns typed config from datasources.json */
  public get datasources(): Datasource[] {
    return this._datasources;
  }

  /** Returns internal datasources from datasources.json */
  public get internalDatasources(): Datasource[] {
    return this._datasources.filter((ds) => isinternalDatasource(ds));
  }

  /** Return external datasources from datasources.json */
  public get externalDatasources(): Datasource[] {
    return this._datasources.filter((ds) => isExternalDatasource(ds));
  }

  /** Returns typed config from geographies.json */
  public get geographies(): Geography[] {
    return this._geographies;
  }

  /** Returns typed config from metrics.json */
  public get metricGroups(): MetricGroups {
    return this._metricGroups;
  }

  /** Returns precalculated metrics from precalc.json */
  public get precalc(): Metric[] {
    return this._precalc;
  }

  /** Returns typed config from objectives.json */
  public get objectives(): Objectives {
    return this._objectives;
  }

  /** Returns typed config from package.json */
  public get package(): Package {
    return this._package;
  }

  /** Returns typed config from geoprocessing.json */
  public get geoprocessing(): GeoprocessingJsonConfig {
    return this._geoprocessing;
  }

  /**
   * Returns URL to dataset bucket for project.  In test environment or if local parameter is true, will
   * return local URL expected to serve up dist data folder
   */
  public dataBucketUrl(local: boolean = false, port: number = 8080) {
    return process.env.NODE_ENV === "test" || local
      ? `http://127.0.0.1:${port}/`
      : `https://gp-${this._package.name}-datasets.s3.${this._geoprocessing.region}.amazonaws.com/`;
  }

  public getVectorDatasourceUrl(
    ds: InternalVectorDatasource | ExternalVectorDatasource
  ) {
    if (isInternalVectorDatasource(ds) && ds.formats.includes("fgb")) {
      return `${this.dataBucketUrl()}${getFlatGeobufFilename(ds)}`;
    } else if (isExternalVectorDatasource(ds)) {
      return ds.url;
    }
    throw new Error(
      `getVectorDatasourceUrl: cannot generate url for datasource ${ds.datasourceId}`
    );
  }

  // HELPERS //

  /** Returns Datasource given datasourceId */
  public getDatasourceById(datasourceId: string): Datasource {
    return getDatasourceById(datasourceId, this._datasources);
  }

  /** Returns InternalVectorDatasource given datasourceId, throws if not found */
  public getInternalVectorDatasourceById(
    datasourceId: string
  ): InternalVectorDatasource {
    return getInternalVectorDatasourceById(datasourceId, this._datasources);
  }

  /** Returns ExternalVectorDatasource given datasourceId, throws if not found */
  public getExternalVectorDatasourceById(
    datasourceId: string
  ): ExternalVectorDatasource {
    return getExternalVectorDatasourceById(datasourceId, this._datasources);
  }

  /** Returns InternalRasterDatasource given datasourceId, throws if not found */
  public getInternalRasterDatasourceById(
    datasourceId: string
  ): InternalRasterDatasource {
    return getInternalRasterDatasourceById(datasourceId, this._datasources);
  }

  // OBJECTIVES //

  /** Returns Objective given objectiveId */
  public getObjectiveById(objectiveId: string): Objective {
    return getObjectiveById(objectiveId, this._objectives);
  }

  // METRICS //

  public getMetricGroup(metricId: string, t?: TFunction): MetricGroup {
    const mg = this._metricGroups.find((m) => m.metricId === metricId);
    if (!mg) throw new Error(`Missing MetricGroup ${metricId} in metrics.json`);

    if (!t) return mg;
    return {
      ...mg,
      classes: mg.classes.map((curClass) => ({
        ...curClass,
        display: t(curClass.display) /* i18next-extract-disable-line */,
      })),
    };
  }

  public getMetricGroupPercId(mg: MetricGroup): string {
    return `${mg.metricId}Perc`;
  }

  /** Returns all Objectives for MetricGroup, optionally translating display strings using t function */
  public getMetricGroupObjectives(
    metricGroup: MetricGroup,
    t?: TFunction
  ): Objective[] {
    const objectives = getMetricGroupObjectiveIds(metricGroup).map(
      (objectiveId) => this.getObjectiveById(objectiveId)
    );
    if (!t) return objectives;
    return objectives.map((objective) => ({
      ...objective,
      shortDesc: t(objective.shortDesc) /* i18next-extract-disable-line */,
    }));
  }

  /**
   * Extracts precalc metrics from precalc.json for a MetricGroup
   * @param mg MetricGroup to get precalculated metrics for
   * @param metricId string, "area", "count", or "sum"
   * @param geographyId string, geographyId to get precalculated metrics for
   * @returns Metric[] of precalculated metrics
   */
  public getPrecalcMetrics(
    mg: MetricGroup,
    metricId: string,
    geographyId: string
  ): Metric[] {
    // For each class in the metric group
    const metrics = mg.classes.map((curClass) => {
      // use top-level datasourceId if available, otherwise fallback to class datasourceId
      const datasourceId = mg.datasourceId || curClass.datasourceId;
      if (!datasourceId)
        throw new Error(`Missing datasourceId for ${mg.metricId}`);

      // If class key (multiclass datasource), find that metric and return
      const classKey = mg.classKey! || curClass.classKey!;
      if (classKey) {
        // Expect precalc metric classId to be in form `${datasourceId}-${classId}`
        const metric = this._precalc.filter(function (pMetric) {
          return (
            pMetric.metricId === metricId &&
            pMetric.classId === datasourceId + "-" + curClass.classId &&
            pMetric.geographyId === geographyId
          );
        });

        // Throw error if metric is unable to be found
        if (!metric || metric.length !== 1) {
          throw new Error(
            `No matching total metric for ${datasourceId}-${curClass.classId}, ${metricId}, ${geographyId}`
          );
        }

        // Return metric, overwriting classId in its simple form
        return { ...metric[0], classId: curClass.classId };
      }

      // Otherwise find metric for general, aka classId total, and add classId
      const metric = this._precalc.filter(function (pMetric) {
        return (
          pMetric.metricId === metricId &&
          pMetric.classId === datasourceId + "-total" &&
          pMetric.geographyId === geographyId
        );
      });

      if (!metric || !metric.length)
        throw new Error(
          `Can't find metric for datasource ${datasourceId}, geography ${geographyId}, metric ${metricId}`
        );
      if (metric.length > 1)
        throw new Error(
          `Returned multiple precalc metrics for datasource ${datasourceId}, geography ${geographyId}, metric ${metricId}`
        );

      // Returns metric, overwriting classId for easy match in report
      return { ...metric[0], classId: curClass.classId };
    });
    return createMetrics(metrics);
  }
}

export default ProjectClientBase;
