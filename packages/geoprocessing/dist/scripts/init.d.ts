declare function init(): Promise<void>;
interface ProjectMetadataOptions {
    name: string;
    description: string;
    author: string;
    email?: string;
    organization?: string;
    license: string;
    repositoryUrl: string;
    region: string;
}
declare function makeProject(metadata: ProjectMetadataOptions, interactive?: boolean, basePath?: string): Promise<void>;
export default makeProject;
export { init };
