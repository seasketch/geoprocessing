import { clipLand, clipOutsideEez } from "./clipToOceanEez";
import {
  getExampleFeatures,
  getExampleFeaturesByName,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import {
  ValidationError,
  Feature,
  Polygon,
  MultiPolygon,
} from "@seasketch/geoprocessing";
import booleanValid from "@turf/boolean-valid";

describe("Basic unit tests", () => {
  test("clipLand", async () => {
    const examples = (await getExampleFeatures("gp-clip-ocean")) as Feature<
      Polygon | MultiPolygon
    >[];
    for (const example of examples) {
      try {
        const result = await clipLand(example);
        if (!result) fail("result should not be null");
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
  }, 10000);

  test("clipOutsideEez", async () => {
    const examples = (await getExampleFeatures(
      "gp-clip-ocean"
    )) as Feature<Polygon>[];
    for (const example of examples) {
      try {
        const result = await clipOutsideEez(example);
        if (!result) fail("result should not be null");
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
  }, 10000);

  test("clipOutsideBarbadosEez", async () => {
    const examples = await getExampleFeaturesByName("gp-clip-ocean");
    const example = examples[
      "gp-clip-ocean-both-sides-barbados.json"
    ] as Feature<Polygon>;
    try {
      const result = await clipOutsideEez(example, ["Barbados"]);
      if (!result) fail("result should not be null");
      expect(result).toBeTruthy();
      expect(booleanValid(result));
      expect(
        result.geometry.type === "Polygon" ||
          result.geometry.type === "MultiPolygon"
      );
      writeResultOutput(
        result,
        "clipOutsideBarbadosEez",
        example.properties?.name
      );
    } catch (e) {
      if (e instanceof ValidationError) {
        // ValidationErrors don't indicate failures, just comprehensive tests
      } else {
        throw e;
      }
    }
  }, 10000);

  test("clipOutsideMultipleEez", async () => {
    const examples = await getExampleFeaturesByName("gp-clip-ocean");
    const example = examples[
      "gp-clip-ocean-both-sides-barbados.json"
    ] as Feature<Polygon>;
    try {
      const result = await clipOutsideEez(example, [
        "Barbados",
        "Trinidad and Tobago",
      ]);
      if (!result) fail("result should not be null");
      expect(result).toBeTruthy();
      expect(booleanValid(result));
      expect(
        result.geometry.type === "Polygon" ||
          result.geometry.type === "MultiPolygon"
      );
      writeResultOutput(
        result,
        "clipOutsideMultipleEez",
        example.properties?.name
      );
    } catch (e) {
      if (e instanceof ValidationError) {
        // ValidationErrors don't indicate failures, just comprehensive tests
      } else {
        throw e;
      }
    }
  }, 10000);
});
