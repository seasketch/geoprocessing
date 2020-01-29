#!/usr/bin/env node
import { ExecutionMode } from "../src/types";
export declare function makeGeoprocessingHandler(options: GPOptions, interactive?: boolean, basePath?: string): Promise<void>;
interface GPOptions {
    title: string;
    typescript: boolean;
    docker: boolean;
    executionMode: ExecutionMode;
    description: string;
}
export {};
