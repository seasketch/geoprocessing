// module.exports = {
//   tables: [],
//   port: 8001
// };
module.exports = {
  tables: [
    {
      TableName: `tasks-core`,
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
      AttributeDefinitions: [
        {AttributeName: 'id', AttributeType: 'S'},
        // {AttributeName: 'status', AttributeType: 'S'},
        // {AttributeName: 'startedAt', AttributeType: 'S'},
        // {AttributeName: 'duration', AttributeType: 'N'},
        // {AttributeName: 'data', AttributeType: 'M'},
        // {AttributeName: 'error', AttributeType: 'S'},
      ],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    },
    // etc
  ]
};