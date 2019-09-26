import fs from "fs";
import path from "path";
import { Sketch } from "@seasketch/serverless-geoprocessing";
import area from "./area";

const cpath = path.join(
  __dirname,
  "../../example-sketches",
  "campusPoint.json"
);
const campusPoint = JSON.parse(fs.readFileSync(cpath).toString()) as Sketch;

test("Area calculation is accurate for single sketch", () => {
  expect(area(campusPoint).areaKm).toBeGreaterThan(25000);
});
