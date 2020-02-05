'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var manifestRaw = {
    "title": "example-project",
    "version": "1.0.0",
    "relatedUri": "https://github.com/seasketch/example-project#readme",
    "sourceUri": "git+https://github.com/seasketch/example-project.git",
    "published": "2020-02-04T00:56:19.558Z",
    "preprocessingServices": [],
    "clients": [],
    "feebackClients": [],
    "apiVersion": "1.0.0",
    "author": "Chad Burt <support@seasketch.org>",
    "organization": "SeaSketch",
    "region": "us-west-1",
    "functions": [
        {
            "title": "area",
            "description": "Produces the area of the given sketch",
            "timeout": 2,
            "memory": 256,
            "executionMode": "sync",
            "requiresProperties": [],
            "handler": "src/functions/area.ts",
            "rateLimited": false,
            "rateLimit": 0,
            "rateLimitPeriod": "daily",
            "rateLimitConsumed": 0,
            "medianDuration": 0,
            "medianCost": 0,
            "type": "javascript",
            "issAllowList": [
                "*"
            ]
        },
        {
            "title": "new",
            "description": "test function",
            "timeout": 2,
            "memory": 256,
            "executionMode": "sync",
            "requiresProperties": [],
            "handler": "src/functions/newTest.ts",
            "rateLimited": false,
            "rateLimit": 0,
            "rateLimitPeriod": "daily",
            "rateLimitConsumed": 0,
            "medianDuration": 0,
            "medianCost": 0,
            "type": "javascript",
            "issAllowList": [
                "*"
            ]
        }
    ]
};
// @ts-ignore
const manifest = manifestRaw;
const projectMetadata = async (event) => {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...manifest,
            uri: `https://${event.headers["Host"]}/prod/`,
            geoprocessingServices: manifest.functions.map(func => ({
                endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
                ...func
            }))
        })
    };
};
exports.projectMetadata = projectMetadata;
//# sourceMappingURL=serviceHandlers.js.map