import {
  ScanCommandInput,
  paginateScan,
  DynamoDBDocumentPaginationConfiguration,
  DynamoDBDocument,
} from "@aws-sdk/lib-dynamodb";

export function scanTasks(
  /** DynamoDB Document client */
  docClient: DynamoDBDocument,
  /** Task table name */
  tableName: string,
  /** Optional serviceName to filter by */
  serviceName?: string,
) {
  // Get all task keys.
  const paginatorConfig: DynamoDBDocumentPaginationConfiguration = {
    client: docClient,
    pageSize: 25,
  };

  let query: ScanCommandInput = {
    TableName: tableName,
    ProjectionExpression: "id, service",
  };
  if (serviceName && serviceName !== "all") {
    query = {
      TableName: tableName,
      ProjectionExpression: "id, service",
      FilterExpression: "service = :pk",
      ExpressionAttributeValues: {
        ":pk": serviceName,
      },
    };
  }

  // Pager will return a variable number of items, up to 1MB of data
  const pager = paginateScan(paginatorConfig, query);
  return pager;
}
