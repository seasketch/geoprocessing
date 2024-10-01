import fs from "fs-extra";
import path from "node:path";

export async function setupProjectDirs(projectPath: string) {
  // Stub out code asset sources expected by CDK
  await fs.ensureDir(`${projectPath}`);
  await fs.ensureDir(`${projectPath}/src`);
  await fs.ensureDir(`${projectPath}/src/functions`);
  await fs.ensureDir(`${projectPath}/src/clients`);
}

export async function setupBuildDirs(projectPath: string) {
  // Stub out code asset sources expected by CDK
  await fs.ensureDir(path.join(projectPath, ".build"));
  await fs.ensureDir(path.join(projectPath, ".build-web"));
}

export async function cleanupBuildDirs(path: string) {
  await fs.remove(path); // Cleanup build dirs
}
