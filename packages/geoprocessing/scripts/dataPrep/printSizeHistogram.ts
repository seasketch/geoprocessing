import Table from "cli-table";
import { DatabasePoolConnectionType, sql } from "slonik";
import bytes from "bytes";
// @ts-ignore
import { raw } from "slonik-sql-tag-raw";

export default async (
  statsTable: string,
  connection: DatabasePoolConnectionType
) => {
  statsTable = raw(statsTable);
  const histogram = await connection.many(sql`
      with byte_stats as (
        select min(bytes) as min,
              max(bytes) as max
          from ${statsTable}
      ),
      histogram as (
        select 
          width_bucket(bytes, min, max, 9) as bucket,
          max(bytes) as max_bytes,
          count(*) as freq
        from ${statsTable}, byte_stats
        group by bucket
        order by bucket
      )
      select bucket, max_bytes, freq,
        repeat('■',
               (   freq::float
                 / max(freq) over()
                 * 30
               )::int
        ) as bar
      from histogram;
    `);
  const summary = new Table({
    head: ["bundle size", "frequency"],
    chars: noTableBorders
  });
  for (const row of histogram) {
    summary.push([
      bytes(row.max_bytes as number, { decimalPlaces: 0 }),
      row.freq,
      row.bar
    ]);
  }
  return console.log(summary.toString());
};

const noTableBorders = {
  top: "",
  "top-mid": "",
  "top-left": "",
  "top-right": "",
  bottom: "",
  "bottom-mid": "",
  "bottom-left": "",
  "bottom-right": "",
  left: "",
  "left-mid": "",
  mid: "",
  "mid-mid": "",
  right: "",
  "right-mid": "",
  middle: ""
};
