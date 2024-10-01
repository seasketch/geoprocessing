import path from "node:path";
import { buildProjectClients } from "./buildProjectClients.js";

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

await buildProjectClients(
  process.env.PROJECT_PATH,
  path.join(process.env.PROJECT_PATH, ".build-web"),
);
