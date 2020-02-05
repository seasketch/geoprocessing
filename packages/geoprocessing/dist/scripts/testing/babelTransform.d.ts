declare const _exports: {
    canInstrument?: boolean | undefined;
    createTransformer?: ((options?: any) => import("@jest/transform").Transformer) | undefined;
    getCacheKey?: ((fileData: string, filePath: string, configStr: string, options: import("@jest/transform/build/types").CacheKeyOptions) => string) | undefined;
    process: (sourceText: string, sourcePath: string, config: import("@jest/types/build/Config").ProjectConfig, options?: import("@jest/transform/build/types").TransformOptions | undefined) => string | import("@jest/transform/build/types").TransformedSource;
};
export = _exports;
