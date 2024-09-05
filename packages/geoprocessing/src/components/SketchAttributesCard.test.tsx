import { test, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import SketchAttributesCard from "./SketchAttributesCard.js";
import { ReportContext } from "../context/index.js";

test("SketchAttributesCard renders all userAttributes", () => {
  const { getByRole, getByText, getAllByText } = render(
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/geom/abc123`,
        sketchProperties: {
          id: "abc123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sketchClassId: "123abc",
          name: "My Sketch",
          isCollection: false,
          userAttributes: [
            {
              exportId: "field1",
              label: "Field 1",
              fieldType: "TextField",
              value: "hi there",
            },
            {
              exportId: "field2",
              label: "Number",
              fieldType: "NumberField",
              value: 1,
            },
          ],
        },
        projectUrl: "https://example.com/project",
        visibleLayers: [],
        language: "en",
      }}
    >
      <SketchAttributesCard />
    </ReportContext.Provider>,
  );
  expect(getAllByText("Field 1").length).toBe(1);
  expect(getAllByText("Number").length).toBe(1);
});

test("Can deal with null values", () => {
  const { getByRole, getByText, getAllByText } = render(
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/geom/abc123`,
        sketchProperties: {
          id: "abc123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sketchClassId: "123abc",
          name: "My Sketch",
          isCollection: false,
          userAttributes: [
            {
              exportId: "field1",
              label: "Field 1",
              fieldType: "TextField",
              value: "hi there",
            },
            {
              exportId: "field2",
              label: "Number",
              fieldType: "NumberField",
              value: null,
            },
          ],
        },
        projectUrl: "https://example.com/project",
        visibleLayers: [],
        language: "en",
      }}
    >
      <SketchAttributesCard />
    </ReportContext.Provider>,
  );
  expect(getAllByText("Field 1").length).toBe(1);
  expect(getAllByText("Number").length).toBe(1);
});

test("SketchAttributesCard autoHide option hides card if there are no attributes", () => {
  const { getByRole, getByText, getAllByText } = render(
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/geom/abc123`,
        sketchProperties: {
          id: "abc123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sketchClassId: "123abc",
          name: "My Sketch",
          userAttributes: [],
          isCollection: false,
        },
        projectUrl: "https://example.com/project",
        visibleLayers: [],
        language: "en",
      }}
    >
      <SketchAttributesCard autoHide={true} />
    </ReportContext.Provider>,
  );
  expect(() => getAllByText("Attributes")).toThrow(/Unable to find/);
  render(
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/geom/abc123`,
        sketchProperties: {
          id: "abc123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sketchClassId: "123abc",
          name: "My Sketch",
          userAttributes: [],
          isCollection: false,
        },
        projectUrl: "https://example.com/project",
        visibleLayers: [],
        language: "en",
      }}
    >
      <SketchAttributesCard autoHide={false} />
    </ReportContext.Provider>,
  );
  expect(getAllByText("Attributes").length).toBe(1);
  render(
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/geom/abc123`,
        sketchProperties: {
          id: "abc123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sketchClassId: "123abc",
          name: "My Sketch",
          isCollection: false,
          userAttributes: [
            {
              exportId: "field1",
              label: "Field 1",
              fieldType: "TextField",
              value: "hi there",
            },
            {
              exportId: "field2",
              label: "Number",
              fieldType: "NumberField",
              value: 1,
            },
          ],
        },
        projectUrl: "https://example.com/project",
        visibleLayers: [],
        language: "en",
      }}
    >
      <SketchAttributesCard autoHide={true} />
    </ReportContext.Provider>,
  );
  expect(getAllByText("Attributes").length).toBe(2);
});
