/**
 * Represents parts of project package.json that are manifested and published
 */
export interface Package {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  bugs?: {
    url: string;
  };
  repository?: {
    type: "git";
    url: string;
  };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}
