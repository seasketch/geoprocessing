import { calcSap } from "./sap";

test("sap - no importance", () => {
  // Calculation without importance (will use value of 1)
  // 1 importance / 20,000m^2 = .00005
  const area = 20_000; // Assume square meters
  const value = calcSap(area);
  expect(value).toEqual(1 / area);
});

test("sap - importance", () => {
  const area = 20_000; // Assume square meters
  const importance = 20;
  const value = calcSap(area, { importance });
  expect(value).toEqual((1 * importance) / area);
});

test("sap - areaFactor 1km planning unit", () => {
  // Use areaFactor to match 1km planning unit size. 1000m x 10000m = area of 1,000,000m^2.
  // Geometry now has area 1/50th of the size of a planning unit
  // 20 importance / (20,000 / 1,000,000) = 1000 SAP
  // Now we can say that the shape, with a SAP of 1000 per km^2 represents 1/1000 of a respondent
  const area = 20_000;
  const importance = 20;
  const areaFactor = 1_000_000;
  const value = calcSap(area, { importance, areaFactor });
  expect(value).toEqual(1_000);
});

test("sap - areaFactor 100m planning unit", () => {
  // Use areaFactor to match 100m planning unit size. 100m x 100m = area of 10,000m^2.
  // Geometry now has area the size of 2 planning units
  // 20 importance / (20,000 / 10,000) = 10 SAP
  // Now we can say that the shape, with a SAP of 10 per 100 km^2 represents 1/1000 of a respondent
  const area = 20_000;
  const importance = 20;
  const areaFactor = 10_000;
  const value = calcSap(area, { importance, areaFactor });
  expect(value).toEqual(10);
});

test("sap - importanceFactor", () => {
  // Assume the geometry represents the value for a group of 3000 people.
  // Use the importanceFactor to scale the SAP up, so that each of those people get
  // their 20 importance applied to the area of the shape
  // 3000 people * 20 importance / 20,000 m^2
  const area = 20_000;
  const importance = 20;
  const importanceFactor = 3_000;
  const value = calcSap(area, { importance, importanceFactor });
  expect(value).toEqual(3);
});
