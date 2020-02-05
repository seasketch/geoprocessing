declare namespace _default {
    export const input: any[];
    export const plugins: any[];
    export namespace output {
        export const format: string;
        export const dir: string;
        export const sourcemap: boolean;
        const plugins_1: never[];
        export { plugins_1 as plugins };
    }
    export namespace treeshake {
        export const moduleSideEffects: boolean;
    }
    export function external(id: any): boolean;
}
export default _default;
