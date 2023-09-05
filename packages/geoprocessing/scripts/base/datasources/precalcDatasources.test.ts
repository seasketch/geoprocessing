/**
 * @jest-environment node
 * @group scripts/e2e
 */

import { Metric } from "../../../src";
import { staleMetricsFilterFactory } from "./precalcDatasources";

describe("staleMetricsFilterFactory", () => {
  test("staleMetricsFilterFactory - simple should return true", () => {
    const m: Metric[] = [
      {
        geographyId: "eez",
        classId: "eez-total",
        metricId: "area",
        sketchId: "eez",
        groupId: null,
        value: 123,
      },
    ];
    const matcher = staleMetricsFilterFactory("shelf_class", "eez");
    const filtered = m.filter(matcher);
    expect(filtered.length).toBe(1);
  });
  test("staleMetricsFilterFactory - simple should return false", () => {
    const m: Metric[] = [
      {
        geographyId: "eez",
        classId: "eez-total",
        metricId: "area",
        sketchId: "eez",
        groupId: null,
        value: 123,
      },
    ];
    const matcher = staleMetricsFilterFactory("eez", "eez");
    const filtered = m.filter(matcher);
    expect(filtered.length).toBe(0);
  });
  test("staleMetricsFilterFactory - complex should return 4 metrics", () => {
    const m: Metric[] = [
      {
        geographyId: "eez",
        classId: "basins-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "eez",
        classId: "basins-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 1,
      },
      {
        geographyId: "eez",
        classId: "canyons-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "eez",
        classId: "canyons-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 1,
      },
      {
        geographyId: "nearshore",
        classId: "canyons-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "nearshore",
        classId: "canyons-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 3,
      },
      {
        geographyId: "nearshore",
        classId: "basins-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "nearshore",
        classId: "basins-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 3,
      },
    ];

    // should filter out metrics with eez geography
    const matcherBasinsEEZ = staleMetricsFilterFactory("basins", "eez");
    const filteredBasins = m.filter(matcherBasinsEEZ);
    const matcherCanyonsEEZ = staleMetricsFilterFactory("canyons", "eez");
    const filtered = filteredBasins.filter(matcherCanyonsEEZ);
    expect(filtered.length).toBe(4);
  });
  test("staleMetricsFilterFactory - complex should return 6 metrics", () => {
    const m: Metric[] = [
      {
        geographyId: "eez",
        classId: "basins-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "eez",
        classId: "basins-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 1,
      },
      {
        geographyId: "eez",
        classId: "canyons-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "eez",
        classId: "canyons-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 1,
      },
      {
        geographyId: "nearshore",
        classId: "canyons-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "nearshore",
        classId: "canyons-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 3,
      },
      {
        geographyId: "nearshore",
        classId: "basins-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "nearshore",
        classId: "basins-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 3,
      },
    ];

    // should filter out metrics with eez geography
    const matcher = staleMetricsFilterFactory("basins", "eez");
    const filtered = m.filter(matcher);
    console.log(filtered);
    expect(filtered.length).toBe(6);
  });
});
