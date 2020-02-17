declare function createClient(): Promise<void>;
export declare function makeClient(options: ClientOptions, interactive?: boolean, basePath?: string): Promise<void>;
export { createClient };
interface ClientOptions {
    title: string;
    typescript: boolean;
    description: string;
}
