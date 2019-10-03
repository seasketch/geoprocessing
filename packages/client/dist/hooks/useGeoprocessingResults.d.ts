import { ReportClient, SketchProperties } from "@seasketch/serverless-geoprocessing";
import { GeoprocessingClientOptions } from "../components/ReportSidebar";
import { TaskState } from "../taskRunner";
interface ResultsState {
    results: {
        [key: string]: any;
    };
    failed: boolean;
    loading: boolean;
    tasks: Array<TaskState>;
    eta: number;
}
declare const useGeoprocessingResults: (sketchProperties: SketchProperties, geometryUri: string, client: ReportClient, tabId: string, clientOptions?: GeoprocessingClientOptions | undefined) => ResultsState;
export default useGeoprocessingResults;
