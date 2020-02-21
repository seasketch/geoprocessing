declare const _exports: {
    entry: string;
    output: {
        filename: string;
        path: string;
    };
    devtool: string;
    resolve: {
        extensions: string[];
        modules: string[];
    };
    plugins: any[];
    module: {
        rules: ({
            test: RegExp;
            exclude: RegExp;
            use: {
                loader: string;
                options: {
                    presets: (string | (string | {
                        targets: {
                            node: string;
                        };
                    })[])[];
                };
            };
        } | {
            test: RegExp;
            use: {
                loader: string;
                options: {
                    clients: any;
                };
            }[];
        })[];
    };
};
export = _exports;
