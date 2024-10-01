import { describe, test, expect } from "vitest";
import { roundDecimal } from "./number.js";

describe("number", () => {
  test("number - roundDecimal with 6 digit precision", () => {
    expect(roundDecimal(1, 6)).toBe(1);
    expect(roundDecimal(0.000_000_858_374, 6)).toBe(0);
    expect(roundDecimal(8.58e-7, 6)).toBe(0);
    expect(roundDecimal(1111.111_111_9, 6)).toBe(1111.111_112);
  });

  test("number - roundDecimal with 6 digit precision - keep small values option", () => {
    expect(roundDecimal(0.000_000_858_374, 6, { keepSmallValues: true })).toBe(
      0.000_000_858_374,
    );
    expect(roundDecimal(8.58e-7, 6, { keepSmallValues: true })).toBe(8.58e-7);
    expect(roundDecimal(8.58e-7, 6, { keepSmallValues: false })).toBe(0);
  });
});
