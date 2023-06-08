import fs from "fs-extra";
import path from "path";

export async function setupBuildDirs(projectPath: string) {
  // Stub out code asset sources expected by CDK
  await fs.ensureDir(path.join(projectPath, ".build"));
  await fs.ensureDir(path.join(projectPath, ".build-web"));
}

export async function cleanupBuildDirs(path: string) {
  await fs.remove(path); // Cleanup build dirs
}
