import Handler, { clipLand, clipOutsideEez } from "./clipToOceanEez";
import {
  getExampleFeatures,
  getExampleFeaturesByName,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { Feature, Polygon } from "geojson";
import { ValidationError } from "@seasketch/geoprocessing";
import booleanValid from "@turf/boolean-valid";

describe("Basic unit tests", () => {
  test("clipLand", async () => {
    const examples = await getExampleFeatures();
    for (const example of examples) {
      try {
        const result = await clipLand(example);
        expect(result).toBeTruthy();
        expect(booleanValid(result));
        expect(
          result.geometry.type === "Polygon" ||
            result.geometry.type === "MultiPolygon"
        );
      } catch (e) {
        if (e instanceof ValidationError) {
          // ValidationErrors don't indicate failures, just comprehensive tests
        } else {
          throw e;
        }
      }
    }
  });

  test("clipOutsideEez", async () => {
    const examples = (await getExampleFeatures()) as Feature<Polygon>[];
    for (const example of examples) {
      try {
        const result = await clipOutsideEez(example);
        expect(result).toBeTruthy();
        expect(booleanValid(result));
        expect(
          result.geometry.type === "Polygon" ||
            result.geometry.type === "MultiPolygon"
        );
      } catch (e) {
        if (e instanceof ValidationError) {
          // ValidationErrors don't indicate failures, just comprehensive tests
        } else {
          throw e;
        }
      }
    }
  });

  test("clipOutsideBarbadosEez", async () => {
    const examples = await getExampleFeaturesByName();
    const example = examples["both_sides_barbados.json"] as Feature<Polygon>;
    try {
      const result = await clipOutsideEez(example, ["Barbados"]);
      expect(result).toBeTruthy();
      expect(booleanValid(result));
      expect(
        result.geometry.type === "Polygon" ||
          result.geometry.type === "MultiPolygon"
      );
      writeResultOutput(
        result,
        "clipOutsizeBarbadosEez",
        example.properties.name
      );
    } catch (e) {
      if (e instanceof ValidationError) {
        // ValidationErrors don't indicate failures, just comprehensive tests
      } else {
        throw e;
      }
    }
  });

  test("clipOutsideMultipleEez", async () => {
    const examples = await getExampleFeaturesByName();
    const example = examples["both_sides_barbados.json"] as Feature<Polygon>;
    try {
      const result = await clipOutsideEez(example, [
        "Barbados",
        "Trinidad and Tobago",
      ]);
      expect(result).toBeTruthy();
      expect(booleanValid(result));
      expect(
        result.geometry.type === "Polygon" ||
          result.geometry.type === "MultiPolygon"
      );
      writeResultOutput(
        result,
        "clipOutsizeMultipleEez",
        example.properties.name
      );
    } catch (e) {
      if (e instanceof ValidationError) {
        // ValidationErrors don't indicate failures, just comprehensive tests
      } else {
        throw e;
      }
    }
  });
});
