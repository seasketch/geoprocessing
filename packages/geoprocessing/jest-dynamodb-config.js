module.exports = {
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
