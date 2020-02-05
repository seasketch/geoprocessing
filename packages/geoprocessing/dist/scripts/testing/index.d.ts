import { Sketch, SketchCollection } from "../../src/types";
/** Reads sketches from examples/sketches for testing. Run from project root */
export declare function getExampleSketches(): Promise<Array<Sketch | SketchCollection>>;
export declare function writeResultOutput(results: any, functionName: string, sketchName: string): Promise<void>;
