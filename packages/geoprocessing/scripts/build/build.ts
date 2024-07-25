import path from "path";
import { buildProjectFunctions } from "./buildProjectFunctions.js";

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

await buildProjectFunctions(
  process.env.PROJECT_PATH,
  path.join(process.env.PROJECT_PATH, ".build")
);
