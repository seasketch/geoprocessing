import { DatabasePoolConnectionType } from "slonik";

const { sql } = require("slonik");
const { raw } = require("slonik-sql-tag-raw");

const indexInfoQuery = sql`
  SELECT
    U.usename                AS user_name,
    ns.nspname               AS schema_name,
    idx.indrelid :: REGCLASS AS table_name,
    i.relname                AS index_name,
    idx.indisunique          AS is_unique,
    idx.indisprimary         AS is_primary,
    am.amname                AS index_type,
    idx.indkey,
        ARRAY(
            SELECT pg_get_indexdef(idx.indexrelid, k + 1, TRUE)
            FROM
              generate_subscripts(idx.indkey, 1) AS k
            ORDER BY k
        ) AS index_keys,
    (idx.indexprs IS NOT NULL) OR (idx.indkey::int[] @> array[0]) AS is_functional,
    idx.indpred IS NOT NULL AS is_partial
  FROM pg_index AS idx
    JOIN pg_class AS i
      ON i.oid = idx.indexrelid
    JOIN pg_am AS am
      ON i.relam = am.oid
    JOIN pg_namespace AS NS ON i.relnamespace = NS.OID
    JOIN pg_user AS U ON i.relowner = U.usesysid
  WHERE NOT nspname LIKE 'pg%' -- Excluding system tables
`;

const primaryKeyQuery = (tableName: string) => sql`
SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
FROM   pg_index i
JOIN   pg_attribute a ON a.attrelid = i.indrelid
                     AND a.attnum = ANY(i.indkey)
WHERE  i.indrelid = ${tableName}::regclass
AND    i.indisprimary
`;

const geometryColumnsQuery = (tableName: string) => sql`
  SELECT 
    f_geometry_column AS column, 
    srid, 
    type 
  FROM geometry_columns
  WHERE f_table_name = ${tableName}
`;

const inspectTable = async (
  connection: DatabasePoolConnectionType,
  tableName: string,
  pointsLimit: number
) => {
  try {
    const row = await connection.one(
      sql`SELECT count(*) from ${raw(tableName)} limit 1`
    );
  } catch (e) {
    throw new Error(
      `Problem querying input table "${tableName}". Does it exist?`
    );
  }

  let indexes = await connection.query<{
    isPrimary: boolean;
    index_type: string;
    column: string;
  }>(
    sql`
      SELECT 
        is_primary, 
        index_type, 
        index_keys[1] as column 
      from (${indexInfoQuery}) as q 
      where table_name = ${tableName}::regclass 
        and array_length(index_keys, 1) = 1`
  );
  if (!indexes.rows || !indexes.rows.length) {
    throw new Error(
      "Cannot find any indexes. Both primary key and geometry columns should have indexes."
    );
  }
  // Make sure there is an integer pk that is indexed
  let primaryKeyInfo: { data_type: string; attname: string };
  try {
    primaryKeyInfo = await connection.one(primaryKeyQuery(tableName));
  } catch (e) {
    throw new Error(
      "Problem finding primary key column. Table must include a unique primary key for each feature."
    );
  }
  if (primaryKeyInfo.data_type !== "integer") {
    throw new Error(
      `Primary key must be integer type. Found ${primaryKeyInfo["attname"]}=${primaryKeyInfo["data_type"]}`
    );
  }
  const pkColumn = primaryKeyInfo["attname"];
  const pkIndex = indexes.rows.find((i) => i.column === pkColumn);
  if (!pkIndex) {
    throw new Error(`Could not find index for pk "${pkColumn}"`);
  }
  // Verify geometry field with srid = 4326
  const geometryColumns = await connection.query<{
    column: string;
    srid: number;
    type: string;
  }>(geometryColumnsQuery(tableName));
  if (geometryColumns.rows.length === 0) {
    throw new Error("Could not find a geometry column");
  } else if (geometryColumns.rows.length > 1) {
    throw new Error("Found more that one geometry column. Table must have one");
  }
  const gColData = geometryColumns.rows[0];
  const geometryColumn = gColData.column;
  if (gColData.srid !== 4326) {
    throw new Error(
      `SRID must be 4326. Set using SELECT UpdateGeometrySRID('${tableName}','${geometryColumn}',4326)`
    );
  }

  if (gColData.type !== "POLYGON" && gColData.type !== "LINESTRING") {
    throw new Error(
      `Geometry type must be POLYGON. Found ${gColData.type}. Try ST_Dump or if already polygons, ALTER TABLE ${tableName} ALTER COLUMN ${geometryColumn} type geometry(Polygon, 4326);`
    );
  }
  // // verify that there is a gist index on geometry
  // const gIndex = indexes.rows.find(i => i.column === geometryColumn);
  // if (!gIndex || gIndex.index_type !== "gist") {
  //   throw new Error(`Could not find gist index on column ${geometryColumn}`);
  // }

  // Make sure dataset is already subdivided
  const maxPoints = await connection.oneFirst(
    sql`select max(st_npoints(${raw(geometryColumn)})) from ${raw(tableName)}`
  );
  if (maxPoints > pointsLimit) {
    throw new Error(
      `Features in table exceed bytes-limit (${maxPoints} > ${pointsLimit}). Subdivide large features first.`
    );
  }
  // Get a count of features in the table
  const count = await connection.oneFirst(
    sql`select count(*) from ${raw(tableName)}`
  );

  return {
    columns: {
      geometry: geometryColumn,
      pk: pkColumn,
    },
    count,
  };
};

export default inspectTable;
