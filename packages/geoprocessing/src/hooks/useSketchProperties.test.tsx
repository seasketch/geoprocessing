import React from "react";
import "@testing-library/jest-dom/extend-expect";
import ReportContext, { ReportContextValue } from "../ReportContext";
import { GeoprocessingProject, SketchProperties } from "../types";
import { renderHook, act } from "@testing-library/react-hooks";
import useSketchProperties from "./useSketchProperties";

const ContextWrapper: React.FunctionComponent<{
  children?: any;
}> = ({ children }) => {
  return (
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
              value: "hi there"
            },
            {
              exportId: "field2",
              label: "Number",
              fieldType: "NumberField",
              value: 1
            }
          ]
        },
        projectUrl: "https://example.com/project"
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

test("useSketchProperties passes sketch properties from context", () => {
  const {
    result: {
      current: [sketchProperties]
    }
  } = renderHook(() => useSketchProperties(), {
    wrapper: ContextWrapper
  });
  expect(sketchProperties.name).toBe("My Sketch");
  expect(sketchProperties.userAttributes[0].exportId).toBe("field1");
});

test("useSketchProperties provides a means of getting values by exportId", () => {
  const {
    result: {
      current: [_, getByExportId]
    }
  } = renderHook(() => useSketchProperties(), {
    wrapper: ContextWrapper
  });
  expect(getByExportId("field1")).toBe("hi there");
  expect(getByExportId("field2")).toBe(1);
});
