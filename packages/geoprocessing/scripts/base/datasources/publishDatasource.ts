import { $ } from "zx";

/** Publish datasource files, all formats, to datasets bucket */
export async function publishDatasource(
  dstPath: string,
  format: string,
  datasourceId: string,
  bucketName: string,
) {
  return $`aws s3 sync ${dstPath} s3://${bucketName}  --exclude='*' --include='${datasourceId}.${format}'`;
}
