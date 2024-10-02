import {
  createPool,
  sql,
  DatabasePoolConnection,
  IdentifierSqlToken,
} from "slonik";
import { raw } from "slonik-sql-tag-raw";
import ora from "ora";
import inspectTable from "./inspectTable.js";
import cliProgress from "cli-progress";
import Pbf from "pbf";
import { FeatureCollection, BBox, Geometry } from "../../src/types/index.js"; // Use geojson to avoid
import { FeatureCollection as geobufFC } from "geojson";
import { lineString, length } from "@turf/turf";
import geobuf from "geobuf";
import humanizeDuration from "humanize-duration";
import prettyBytes from "pretty-bytes";
import expandBBox from "./expand.js";
import z from "zod";

interface BundleOptions {
  /** Name for data source. Will be used to automatically create s3 bucket */
  name: string;
  /** Database table with source features */
  tableName: string;
  /** Bundles will be no greater than this size. Defaults to 5500 */
  pointsLimit?: number;
  /** Limit bundles to this size (in kilometers). Defaults to 55 kilometers. */
  envelopeMaxDistance?: number;
  /** PostgreSQL connection. Defaults to postgres:// */
  connection?: string;
  /** Limit to a bounding box. Useful for testing. (xmin, ymin, xmax, ymax) */
  bbox?: [number, number, number, number];
  /** Skip uploads. For debugging bytesLimit, envelopeMaxDistance */
  dryRun?: boolean;
}

const DEFAULTS = {
  pointsLimit: 5500,
  envelopeMaxDistance: 55,
  dryRun: false,
  connection: "postgres://",
};

/**
 * bundleFeatures bundles records from the target table into
 */
const bundleFeatures = async (
  _options: BundleOptions,
  callback?: (id: number, geobuf: Uint8Array, bbox: BBox) => Promise<any>,
): Promise<string> => {
  const options = { ...DEFAULTS, ..._options };
  const pool = await createPool(options.connection, {});
  const statsTableName = `${options.tableName}_bundles`;
  await pool.connect(async (connection) => {
    const startTime = Date.now();
    const sourceTable = sql.identifier([options.tableName]);
    // Check that source table meets all requirements
    const spinner = ora(`Inspecting input table`).start();
    const { columns, count } = await inspectTable(
      connection,
      options.tableName,
      options.pointsLimit,
    );
    spinner.succeed(`Input table meets requirements. ${count} features found.`);

    // Create table to store output stats (bbox, bytes, feature count, etc)
    spinner.start(`Creating output stats table ${statsTableName}`);
    await connection.query(sql.typeAlias("void")`
      begin;
      drop table if exists ${sql.identifier([statsTableName])};
      create table ${sql.identifier([statsTableName])} ( 
        id serial primary key, 
        bbox Geometry not null, 
        geom Geometry, 
        size text not null, 
        bytes int not null,
        count int not null
      );
      commit;
    `);
    spinner.succeed(`Created output stats table ${statsTableName}`);

    // Save identifiers for easier query writing
    const i = {
      geom: sql.identifier([columns.geometry]),
      pk: sql.identifier([columns.pk]),
      statsTable: sql.identifier([statsTableName]),
    };

    // Fetch the bbox, id, and size (st_npoints) of all features to organizing
    // features into bundles
    const recordObject = z.object({
      id: z.number(),
      npoints: z.number(),
      bbox: z.number().array().length(4).or(z.number().array().length(6)),
    });

    const records = await connection.many(sql.type(recordObject)`
      select 
        ${i.pk} as id, 
        st_npoints(${i.geom}) as npoints, 
        ${st_asbbox(i.geom)} as bbox 
      from ${sourceTable} 
      order by ${i.geom}
    `);
    // Iterate through features, creating bundles that are under the size and
    // envelope size limits
    const progressBar = new cliProgress.SingleBar(
      { etaBuffer: 10_000, clearOnComplete: true },
      cliProgress.Presets.shades_classic,
    );
    let bundles = 0;
    let totalSize = 0;
    progressBar.start(count as number, 0);
    let ids: number[] = [];
    let sumNPoints = 0;
    let extent: BBox | null = null;
    let processedCount = 0;
    for (const feature of records) {
      sumNPoints += feature.npoints;
      extent = expandBBox(extent, feature.bbox as BBox);
      const diagonal = lineString([
        [extent[0], extent[1]],
        [extent[2], extent[3]],
      ]);
      const km = length(diagonal, { units: "kilometers" });
      if (
        km >= options.envelopeMaxDistance ||
        sumNPoints >= options.pointsLimit ||
        records.indexOf(feature) === records.length - 1
      ) {
        const { bundleId, geobuf } = await createGeobuf(
          ids.length === 0 ? [feature.id] : ids,
          connection,
          sourceTable,
          i.geom,
          i.pk,
          i.statsTable,
        );
        bundles++;
        totalSize += geobuf.byteLength;
        if (callback) {
          await callback(bundleId, geobuf, extent);
        }
        sumNPoints = ids.length === 0 ? 0 : feature.npoints;
        ids = ids.length === 0 ? [] : [feature.id];
        extent = ids.length === 0 ? null : (feature.bbox as BBox);
      } else {
        // Haven't yet reached npoints or envelope size limits, so keep adding
        // feature ids to the bundle
        ids.push(feature.id);
      }
      progressBar.update(processedCount++);
    }
    progressBar.stop();
    spinner.succeed(
      `Created ${bundles} geobuf bundles in ${humanizeDuration(
        Date.now() - startTime,
      )}. Total size is ${prettyBytes(totalSize)}`,
    );
  });
  return statsTableName;
};

async function createGeobuf(
  ids: number[],
  connection: DatabasePoolConnection,
  table: IdentifierSqlToken,
  geom: IdentifierSqlToken,
  pk: IdentifierSqlToken,
  statsTable: IdentifierSqlToken,
) {
  if (ids.length === 0) {
    throw new Error("createGeobuf called without any ids");
  }
  // Get all features with matching ids as a single feature collection, as well
  // as the combined bbox of those features
  const collectionObject = z.object({
    collection: z.any(),
    extent: z.string(),
  });
  const { collection, extent } = await connection.one(sql.type(
    collectionObject,
  )`
    select json_build_object(
      'type', 'FeatureCollection',
      'features', json_agg(ST_AsGeoJSON(t.*, 'ccw', 6)::json)
    ) as collection, 
    st_extent(t.${geom}) as extent
    from (
      select 
        *, 
        ST_ForcePolygonCCW(${geom}) as ccw,
        ${st_asbbox(geom)} as b_box 
      from ${table} 
      where ${pk} in (${sql.join(ids, sql.unsafe`, `)})
    ) as t
  `);
  const fc = collection as FeatureCollection<Geometry>;
  if (fc.features.length === 0) {
    throw new Error("Empty bundle with no features.");
  }
  fc.bbox = parseBBox(extent);
  // Query added a bbox parameter to feature properties, promote it from
  // feature.properties.b_box to feature.bbox
  for (const feature of fc.features) {
    feature.bbox = feature.properties!.b_box.map((f: number) =>
      Number.parseFloat(f.toFixed(6)),
    );
    delete feature.properties!.b_box;
    // remove geometries from geojson properties
    for (const key in feature.properties) {
      if (
        typeof feature.properties[key] === "object" &&
        "type" in feature.properties[key] &&
        "coordinates" in feature.properties[key]
      ) {
        delete feature.properties[key];
      }
    }
  }

  const sizeObject = z.object({
    id: z.number(),
    bytes: z.number(),
    count: z.number(),
  });

  // geobuf types are incompatible so cast to geojson fc it expects
  const buffer = geobuf.encode(fc as geobufFC, new Pbf());
  const { id, bytes, count } = await connection.one(sql.type(sizeObject)`
    insert into ${statsTable} (
      size, 
      bytes,
      bbox, 
      count
    ) values (
      ${prettyBytes(buffer.byteLength)}, 
      ${buffer.byteLength},
      st_makeenvelope(${raw([...fc.bbox, "4326"].join(", "))}), 
      ${ids.length}
    )
    returning 
      id, 
      bytes, 
      count
  `);
  return {
    bundleId: id,
    geobuf: buffer,
    bytes: bytes,
    count: count,
  };
}

function st_asbbox(geom: IdentifierSqlToken) {
  return sql.unsafe`array[
    st_xmin(${geom}),
    st_ymin(${geom}),
    st_xmax(${geom}),
    st_ymax(${geom})
  ]`;
}

function parseBBox(box: string): BBox {
  return box
    .match(/\((.+)\)/)![1]
    .split(/\s|,/)
    .map(Number.parseFloat) as BBox;
}

export default bundleFeatures;
