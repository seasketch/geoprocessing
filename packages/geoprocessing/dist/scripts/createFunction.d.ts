import { ExecutionMode } from "../src/types";
declare function createFunction(): Promise<void>;
export declare function makeGeoprocessingHandler(options: GPOptions, interactive?: boolean, basePath?: string): Promise<void>;
export { createFunction };
interface GPOptions {
    title: string;
    typescript: boolean;
    docker: boolean;
    executionMode: ExecutionMode;
    description: string;
}
