import { TFunction } from "i18next";
import { createMetrics } from "../metrics/helpers.js";

import {
  isInternalRasterDatasource,
  isImportVectorDatasourceConfig,
  isImportRasterDatasourceConfig,
  getInternalRasterDatasourceById,
  getInternalVectorDatasourceById,
  getExternalVectorDatasourceById,
  getRasterDatasourceById,
  getExternalRasterDatasourceById,
  isExternalVectorDatasource,
  isExternalRasterDatasource,
  isinternalDatasource,
  isExternalDatasource,
  getDatasourceById,
  getVectorDatasourceById,
  isInternalVectorDatasource,
  getFlatGeobufFilename,
  getCogFilename,
} from "../datasources/helpers.js";

import {
  getObjectiveById,
  getMetricGroupObjectiveIds,
} from "../helpers/index.js";

import {
  ExternalRasterDatasource,
  ExternalVectorDatasource,
  InternalVectorDatasource,
  InternalRasterDatasource,
  Project,
  SupportedFormats,
  VectorDatasource,
  RasterDatasource,
  Objective,
  Objectives,
  MetricGroup,
  MetricGroups,
  Geography,
  Datasource,
  GeoprocessingJsonConfig,
  Metric,
  Package,
  ImportRasterDatasourceConfig,
  ImportVectorDatasourceConfig,
  datasourcesSchema,
  geographiesSchema,
  metricsSchema,
  metricGroupsSchema,
  objectivesSchema,
  packageSchema,
  geoprocessingConfigSchema,
  projectSchema,
} from "../types/index.js";

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

interface DataBucketUrlOptions {
  local?: boolean;
  port?: number;
  subPath?: string;
}

export interface ProjectClientInterface {
  getDatasourceById(datasourceId: string): Datasource;
  getVectorDatasourceById(datasourceId: string): VectorDatasource;
  getRasterDatasourceById(datasourceId: string): RasterDatasource;
  dataBucketUrl(options: DataBucketUrlOptions): string;
  getDatasourceUrl(
    ds:
      | Datasource
      | VectorDatasource
      | InternalVectorDatasource
      | ExternalVectorDatasource
      | RasterDatasource
      | ExternalRasterDatasource
      | InternalRasterDatasource
      | ImportRasterDatasourceConfig
      | ImportVectorDatasourceConfig,
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
  public dataBucketUrl(options: DataBucketUrlOptions = {}) {
    const { local = false, port = 8080, subPath = "" } = options;
    return process.env.NODE_ENV === "test" || local
      ? `http://127.0.0.1:${port}/${subPath ? subPath + "/" : ""}`
      : `https://gp-${this._package.name}-datasets.s3.${this._geoprocessing.region}.amazonaws.com/`;
  }

  public getFgbPath(
    ds:
      | Datasource
      | VectorDatasource
      | InternalVectorDatasource
      | ExternalVectorDatasource
      | RasterDatasource
      | ExternalRasterDatasource
      | InternalRasterDatasource
      | ImportRasterDatasourceConfig
      | ImportVectorDatasourceConfig,
  ) {
    return `data/dist/${ds.datasourceId}.fgb`;
  }

  public getDatasourceUrl(
    ds:
      | Datasource
      | VectorDatasource
      | InternalVectorDatasource
      | ExternalVectorDatasource
      | RasterDatasource
      | ExternalRasterDatasource
      | InternalRasterDatasource
      | ImportRasterDatasourceConfig
      | ImportVectorDatasourceConfig,
    options: {
      format?: SupportedFormats;
      local?: boolean;
      port?: number;
      subPath?: string;
    } = {},
  ) {
    const { format, local, port, subPath } = options;
    if (isInternalVectorDatasource(ds) || isImportVectorDatasourceConfig(ds)) {
      // default to fgb format if not specified
      if (!format) {
        if (ds.formats.includes("fgb"))
          return `${this.dataBucketUrl({
            local,
            port,
            subPath,
          })}${getFlatGeobufFilename(ds)}`;
      } else if (ds.formats.includes(format))
        return `${this.dataBucketUrl({ local, port, subPath })}${
          ds.datasourceId
        }.${format}`;
      else
        throw new Error(
          `getDatasourceUrl: format not found for datasource ${ds.datasourceId}`,
        );
    } else if (
      isInternalRasterDatasource(ds) ||
      isImportRasterDatasourceConfig(ds)
    ) {
      // default to cog tif format if not specificed
      if (!format) {
        if (ds.formats.includes("tif"))
          return `${this.dataBucketUrl({
            local,
            port,
            subPath,
          })}${getCogFilename(ds)}`;
      } else if (ds.formats.includes(format))
        return `${this.dataBucketUrl({ local, port, subPath })}${
          ds.datasourceId
        }.${format}`;
      else
        throw new Error(
          `getDatasourceUrl: format not found for datasource ${ds.datasourceId}`,
        );
    } else if (
      isExternalVectorDatasource(ds) ||
      isExternalRasterDatasource(ds)
    ) {
      if (ds.url) return ds.url;
      else
        throw new Error(
          `getDatasourceUrl: url undefined for external datasource ${ds.datasourceId}`,
        );
    }
    throw new Error(
      `getDatasourceUrl: cannot generate url for datasource ${ds.datasourceId}`,
    );
  }

  // DATASOURCES //

  /** Returns Datasource given datasourceId */
  public getDatasourceById(datasourceId: string): Datasource {
    return getDatasourceById(datasourceId, this._datasources);
  }

  /** Returns VectorDatasource given datasourceId, throws if not found */
  public getVectorDatasourceById(datasourceId: string): VectorDatasource {
    return getVectorDatasourceById(datasourceId, this._datasources);
  }

  /** Returns InternalVectorDatasource given datasourceId, throws if not found */
  public getInternalVectorDatasourceById(
    datasourceId: string,
  ): InternalVectorDatasource {
    return getInternalVectorDatasourceById(datasourceId, this._datasources);
  }

  /** Returns ExternalVectorDatasource given datasourceId, throws if not found */
  public getExternalVectorDatasourceById(
    datasourceId: string,
  ): ExternalVectorDatasource {
    return getExternalVectorDatasourceById(datasourceId, this._datasources);
  }

  /** Returns RasterDatasource given datasourceId, throws if not found */
  public getRasterDatasourceById(datasourceId: string): RasterDatasource {
    return getRasterDatasourceById(datasourceId, this._datasources);
  }

  /** Returns InternalRasterDatasource given datasourceId, throws if not found */
  public getInternalRasterDatasourceById(
    datasourceId: string,
  ): InternalRasterDatasource {
    return getInternalRasterDatasourceById(datasourceId, this._datasources);
  }

  /** Returns ExternalRasterDatasource given datasourceId, throws if not found */
  public getExternalRasterDatasourceById(
    datasourceId: string,
  ): ExternalRasterDatasource {
    return getExternalRasterDatasourceById(datasourceId, this._datasources);
  }

  // GEOGRAPHIES //

  /**
   * Returns project geography matching the provided ID, with optional fallback geography using fallbackGroup parameter
   * @param geographyId The geography ID to search for
   * @param options
   * @param options.fallbackGroup The default group name to lookup if no geographyId is provided. expects there is only one geography with that group name
   * @returns
   * @throws if geography does not exist
   */
  public getGeographyById(
    geographyId?: string,
    options: { fallbackGroup?: string } = {},
  ): Geography {
    const { fallbackGroup } = options;
    if (geographyId && geographyId.length > 0) {
      const curGeog = this._geographies.find(
        (g) => g.geographyId === geographyId,
      );
      // verify matching geography exists
      if (curGeog) {
        return curGeog;
      }
    } else if (fallbackGroup) {
      // fallback to user-specified geography group
      const planGeogs = this._geographies.filter((g) =>
        g.groups?.includes(fallbackGroup),
      );
      if (planGeogs.length === 0) {
        throw new Error(
          `Could not find geography with fallback group ${fallbackGroup}`,
        );
      } else if (planGeogs.length > 1) {
        throw new Error(
          `Found more than one geography with fallback group ${fallbackGroup}, there should be only one`,
        );
      } else {
        return planGeogs[0];
      }
    }

    throw new Error(
      `getGeographyById - did not receive geographyID or fallbackGroup`,
    );
  }

  /**
   * @param group the name of the geography group
   * @returns geographies with group name assigned
   */
  public getGeographyByGroup(group: string): Geography[] {
    return this._geographies.filter((g) => g.groups?.includes(group));
  }

  // OBJECTIVES //

  /** Returns Objective given objectiveId */
  public getObjectiveById(objectiveId: string): Objective {
    return getObjectiveById(objectiveId, this._objectives);
  }

  // METRIC GROUPS //

  /** Returns MetricGroup given metricId, optional translating display name, given i18n t function */
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

  /**
   * Simple helper that given MetricGroup, returns a consistent ID string for a percent metric, defaults to metricId + 'Perc' added to the end
   * @param mg - the MetricGroup
   * @returns - ID string
   */
  public getMetricGroupPercId(mg: MetricGroup): string {
    return `${mg.metricId}Perc`;
  }

  /**
   * Returns Objectives for MetricGroup
   * If at least one class has an objective assigned, then it returns those, missing classes with no objective get the top-level objective
   * If no class-level objectives are found, then it returns the top-level objective
   * If no objectives are found, returns an empty array
   * Given i18n t function it will also translate the short description
   * @param metricGroup
   * @param t
   * @returns
   */
  public getMetricGroupObjectives(
    metricGroup: MetricGroup,
    t?: TFunction,
  ): Objective[] {
    const objectives = getMetricGroupObjectiveIds(metricGroup).map(
      (objectiveId) => this.getObjectiveById(objectiveId),
    );
    if (!t) return objectives;
    return objectives.map((objective) => ({
      ...objective,
      shortDesc: t(objective.shortDesc) /* i18next-extract-disable-line */,
    }));
  }

  /**
   * Returns datasource for given MetricGroup.
   * If classId is provided, returns class-level datasource if assigned, otherwise falls back to top-level metricGroup datasource
   * @param metricGroup - metricGroup to get datasource for
   * @param options.classId - metricGroup class to get datasource for
   * @returns the datasource object
   * @throws if class does not exist in metric group with given classId
   * @throws if datasourceId is missing for metricGroup and class
   */
  public getMetricGroupDatasource(
    metricGroup: MetricGroup,
    options: { classId?: string } = {},
  ): Datasource {
    const { classId } = options;
    if (classId) {
      const dataClass = metricGroup.classes.find((c) => c.classId === classId);
      if (dataClass && dataClass.datasourceId)
        return this.getDatasourceById(dataClass.datasourceId);
    }

    if (!metricGroup.datasourceId)
      throw new Error(
        `Could not find datasourceId for metric group ${metricGroup.metricId} or its class ${classId}, please add one`,
      );
    return this.getDatasourceById(metricGroup.datasourceId);
  }

  /**
   * Returns classKey for given metric group, class-level if available, otherwise metricGroup level if not
   * @param metricGroup - metricGroup to search for class and classKey
   * @param options.classId - optional data class ID to specifically get classKey for
   * @returns the classKey name or undefined
   * @throws if class does not exist in metric group with given classId
   */
  public getMetricGroupClassKey(
    metricGroup: MetricGroup,
    options: { classId?: string } = {},
  ) {
    const { classId } = options;
    if (classId) {
      const dataClass = metricGroup.classes.find((c) => c.classId === classId);
      if (!dataClass)
        throw new Error(
          `Class not found in metricGroup ${metricGroup.metricId} with classId ${classId}`,
        );
      if (dataClass.classKey) return dataClass.classKey;
    }
    return metricGroup.classKey;
  }

  /**
   * Returns precalc metrics from precalc.json.  Optionally filters down to specific metricGroup and geographyId
   * @param mg MetricGroup to get precalculated metrics for
   * @param metricId string, "area", "count", or "sum"
   * @param geographyId string, geographyId to get precalculated metrics for
   * @returns Metric[] of precalculated metrics
   */
  public getPrecalcMetrics(
    mg?: MetricGroup,
    metricId?: string,
    geographyId?: string,
  ): Metric[] {
    if (!mg && !metricId && !geographyId) {
      // default to return everything
      return this._precalc;
    } else if (mg && metricId && geographyId) {
      // or for specific metricGroup and geography
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
          if (!metric || metric.length === 0) {
            throw new Error(
              `No matching total metric for ${datasourceId}-${curClass.classId}, ${metricId}, ${geographyId}`,
            );
          }
          if (metric.length > 1) {
            console.log(JSON.stringify(metric));
            throw new Error(
              `Unexpectedly found more than one precalc metric for datasource-classId: ${datasourceId}-${curClass.classId}, metric: ${metricId}, geography: ${geographyId}`,
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
            `Can't find precalc metric for datasource ${datasourceId}, geography ${geographyId}, metric ${metricId}.  Do you need to run the precalc:data command?`,
          );
        if (metric.length > 1)
          throw new Error(
            `Returned multiple precalc metrics for datasource ${datasourceId}, geography ${geographyId}, metric ${metricId}`,
          );

        // Returns metric, overwriting classId for easy match in report
        return { ...metric[0], classId: curClass.classId };
      });
      return createMetrics(metrics);
    }

    throw new Error(
      "getPrecalcMetrics must be called with no parameters, or all 3 of mg, metricId, and geographyId",
    );
  }
}

export default ProjectClientBase;
