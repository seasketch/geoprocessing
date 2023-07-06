module.exports = {
  // https://github.com/shelfio/jest-dynamodb/issues/212
  installerConfig: {
    downloadUrl:
      "https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_2023-06-09.tar.gz",
  },
  tables: [
    {
      TableName: `tasks-core`,
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
        {
          AttributeName: "service",
          KeyType: "RANGE",
        },
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "service", AttributeType: "S" },
        // {AttributeName: 'status', AttributeType: 'S'},
        // {AttributeName: 'startedAt', AttributeType: 'S'},
        // {AttributeName: 'duration', AttributeType: 'N'},
        // {AttributeName: 'data', AttributeType: 'M'},
        // {AttributeName: 'error', AttributeType: 'S'},
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    {
      TableName: `test-websockets`,
      KeySchema: [
        {
          AttributeName: "connectionId",
          KeyType: "HASH",
        },
      ],
      AttributeDefinitions: [
        { AttributeName: "connectionId", AttributeType: "S" },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    // etc
  ],
  port: 8000,
};
