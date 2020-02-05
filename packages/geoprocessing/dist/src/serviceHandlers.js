// @ts-ignore
import manifestRaw from "manifest";
const manifest = manifestRaw;
export const projectMetadata = async (event) => {
    const { functions, region, ...projectInfo } = manifest;
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Cache-Control": "max-age=60"
        },
        body: JSON.stringify({
            ...projectInfo,
            uri: `https://${event.headers["Host"]}/prod/`,
            geoprocessingServices: functions.map(func => ({
                endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
                ...func,
                handler: undefined
            }))
        })
    };
};
//# sourceMappingURL=serviceHandlers.js.map