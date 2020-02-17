export declare const tables: {
    TableName: string;
    KeySchema: {
        AttributeName: string;
        KeyType: string;
    }[];
    AttributeDefinitions: {
        AttributeName: string;
        AttributeType: string;
    }[];
    ProvisionedThroughput: {
        ReadCapacityUnits: number;
        WriteCapacityUnits: number;
    };
}[];
export declare const port: number;
