// @ts-ignore
import manifestRaw from "manifest";
const manifest = manifestRaw;
export const projectMetadata = async (event) => {
    const { functions, region, ...projectInfo } = manifest;
    const uri = `https://${event.headers["Host"]}/prod/`;
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
            clientSideBundle: `https://${process.env.clientUrl}?service=${uri}`,
            uri,
            geoprocessingServices: functions.map(func => ({
                endpoint: `https://${event.headers["Host"]}/prod/${func.title}`,
                ...func,
                handler: undefined
            }))
        }, null, "  ")
    };
};
//# sourceMappingURL=serviceHandlers.js.map