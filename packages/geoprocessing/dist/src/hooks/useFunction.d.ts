import { GeoprocessingTask } from "../tasks";
interface FunctionState<ResultType> {
    /** Populated as soon as the function request returns */
    task?: GeoprocessingTask<ResultType>;
    loading: boolean;
    error?: string;
}
export declare const useFunction: <ResultType>(functionTitle: string) => FunctionState<ResultType>;
export {};
