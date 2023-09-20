/**
 * @jest-environment node
 * @group unit
 */

import { roundDecimal } from "./number";

describe("number", () => {
  test("number - roundDecimal with 6 digit precision", () => {
    expect(roundDecimal(1, 6)).toBe(1);
    expect(roundDecimal(0.000000858374, 6)).toBe(0);
    expect(roundDecimal(8.58e-7, 6)).toBe(0);
    expect(roundDecimal(1111.1111119, 6)).toBe(1111.111112);
  });

  test("number - roundDecimal with 6 digit precision and keep small values", () => {
    expect(roundDecimal(0.000000858374, 6, true)).toBe(0.000000858374);
    expect(roundDecimal(8.58e-7, 6, true)).toBe(8.58e-7);
  });
});
