import React, { useState } from "react";
import {
  render,
  fireEvent,
  waitForElement,
  act as domAct
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useFunction } from "./useFunction";
import ReportContext, { ReportContextValue } from "../ReportContext";
import { v4 as uuid } from "uuid";
import { GeoprocessingProject, SketchProperties } from "../types";
import { GeoprocessingTaskStatus, GeoprocessingTask } from "../tasks";
import { renderHook, act } from "@testing-library/react-hooks";
// @ts-ignore
import fetchMock from "fetch-mock-jest";

const makeSketchProperties = (id?: string): SketchProperties => {
  id = id || uuid();
  return {
    id,
    name: "sketch name",
    updatedAt: new Date().toISOString(),
    sketchClassId: "abc123"
  } as SketchProperties;
};

const ContextWrapper: React.FunctionComponent<{
  children?: any;
  value?: ReportContextValue;
}> = props => {
  const sketchProperties = makeSketchProperties();
  return (
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/${sketchProperties.id}`,
        sketchProperties,
        projectUrl: "https://example.com/project",
        ...(props.value || {})
      }}
    >
      {props.children}
    </ReportContext.Provider>
  );
};

fetchMock.get("https://example.com/project", {
  geoprocessingServices: [
    {
      title: "calcFoo",
      endpoint: "https://example.com/calcFoo"
    }
  ]
});

const consoleError = console.error;
beforeEach(() => {
  fetchMock.resetHistory();
});

test("useFunction won't accept unrecognizable responses", async () => {
  jest.useFakeTimers();
  fetchMock.getOnce(
    "*",
    {},
    {
      overwriteRoutes: true
    }
  );
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ContextWrapper
  });
  expect(result.current.loading).toBe(true);
  await act(async () => {
    jest.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toContain("response");
});

test("useFunction unsets loading prop and sets task upon completion of job (executionMode=sync)", async () => {
  jest.useFakeTimers();
  const id = uuid();
  fetchMock.getOnce(
    "*",
    JSON.stringify({
      startedAt: new Date().toISOString(),
      duration: 10,
      geometryUri: `https://example.com/calcFoo/${id}/geometry`,
      location: `https://example.com/calcFoo/${id}`,
      id,
      logUriTemplate: `https://example.com/calcFoo/${id}/logs`,
      service: "calcFoo",
      wss: `wss://example.com/calcFoo/${id}`,
      status: "completed",
      data: {
        foo: "plenty"
      }
    } as GeoprocessingTask),
    { overwriteRoutes: true }
  );
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ContextWrapper
  });
  expect(result.current.loading).toBe(true);
  await act(async () => {
    jest.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(result.current.loading).toBe(false);
  const task: GeoprocessingTask = result.current.task!;
  expect(task.data.foo).toBe("plenty");
  expect(task.status).toBe(GeoprocessingTaskStatus.Completed);
  expect(task.error).toBeUndefined();
});

test("useFunction handles errors thrown within geoprocessing function", async () => {
  jest.useFakeTimers();
  const id = uuid();
  fetchMock.getOnce(
    "*",
    {
      startedAt: new Date().toISOString(),
      duration: 10,
      geometryUri: `https://example.com/calcFoo/${id}/geometry`,
      location: `https://example.com/calcFoo/${id}`,
      id,
      logUriTemplate: `https://example.com/calcFoo/${id}/logs`,
      service: "calcFoo",
      wss: `wss://example.com/calcFoo/${id}`,
      status: "failed",
      error: "Task error"
    } as GeoprocessingTask,
    { overwriteRoutes: true }
  );
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ContextWrapper
  });
  expect(result.current.loading).toBe(true);
  await act(async () => {
    jest.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(result.current.loading).toBe(false);
  const task: GeoprocessingTask = result.current.task!;
  expect(task.error).toBe("Task error");
  expect(result.current.error).toBe("Task error");
});

test("throws error if ReportContext is not set", async () => {
  const { result } = renderHook(() => useFunction("calcFoo"));
  expect(result.error.message).toContain("ReportContext");
});

const TestReport = () => {
  const { loading, error, task } = useFunction("calcFoo");
  return (
    <div>
      {loading && (
        <span role="alert" aria-busy="true">
          loading...
        </span>
      )}
      {error && <span role="alert">Errors: {error}</span>}
      {task?.status === GeoprocessingTaskStatus.Completed && (
        <span role="alert" data-results={(task.data as { foo: string }).foo}>
          Task Complete!
        </span>
      )}
    </div>
  );
};

const TestContainer: React.FunctionComponent = props => {
  const [sketchId, setSketchId] = useState(1);
  return (
    <ReportContext.Provider
      value={{
        sketchProperties:
          // @ts-ignore
          props.sketchProperties || makeSketchProperties(sketchId.toString()),
        geometryUri: `https://example.com/geometry/${sketchId}`,
        projectUrl: "https://example.com/project"
      }}
    >
      <button onClick={() => setSketchId(sketchId + 1)}>
        change sketch id
      </button>
      {props.children}
    </ReportContext.Provider>
  );
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test("changing ReportContext.geometryUri fetches new results", async () => {
  jest.useFakeTimers();
  const id = uuid();
  fetchMock.getOnce(
    "*",
    JSON.stringify({
      startedAt: new Date().toISOString(),
      duration: 10,
      geometryUri: `https://example.com/calcFoo/${id}/geometry`,
      location: `https://example.com/calcFoo/${id}`,
      id,
      logUriTemplate: `https://example.com/calcFoo/${id}/logs`,
      service: "calcFoo",
      wss: `wss://example.com/calcFoo/${id}`,
      status: "completed",
      data: {
        foo: "plenty"
      }
    } as GeoprocessingTask),
    { overwriteRoutes: true }
  );
  const { getByRole, getByText, getAllByText } = render(
    <TestContainer>
      <TestReport />
    </TestContainer>
  );
  expect(getByRole("alert")).toHaveTextContent("loading...");
  await domAct(async () => {
    jest.runAllTimers();
  });
  // expect(fetchMock.calls("https://example.com/project").length).toBe(1);
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(getAllByText(/Task Complete/i).length).toBe(1);
  expect(getByText(/Task Complete/)).toHaveAttribute("data-results", "plenty");
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);

  // now setup another mock because clicking the button will change the geometryUri
  const id2 = uuid();
  fetchMock.getOnce(
    "*",
    JSON.stringify({
      startedAt: new Date().toISOString(),
      duration: 10,
      geometryUri: `https://example.com/calcFoo/${id2}/geometry`,
      location: `https://example.com/calcFoo/${id2}`,
      id,
      logUriTemplate: `https://example.com/calcFoo/${id2}/logs`,
      service: "calcFoo",
      wss: `wss://example.com/calcFoo/${id2}`,
      status: "completed",
      data: {
        foo: "lots!"
      }
    } as GeoprocessingTask),
    { overwriteRoutes: true }
  );
  await domAct(async () => {
    getByRole("button").click();
  });
  expect(getAllByText(/Task Complete/i).length).toBe(1);
  expect(getByText(/Task Complete/)).toHaveAttribute("data-results", "lots!");
  expect(fetchMock.calls(/calcFoo/).length).toBe(2);
});

const MultiCardTestReport = () => {
  const { loading, error, task } = useFunction("calcFoo");
  const task2 = useFunction("calcFoo");
  return (
    <>
      <div>
        {loading && (
          <span role="alert" aria-busy="true">
            loading...
          </span>
        )}
        {error && <span role="alert">Errors: {error}</span>}
        {task?.status === GeoprocessingTaskStatus.Completed && (
          <span role="alert" data-results={(task?.data as { foo: string }).foo}>
            Task Complete!
          </span>
        )}
      </div>
      <div id="task2">
        {task2.loading && (
          <span role="alert" aria-busy="true">
            loading...
          </span>
        )}
        {task2.error && <span role="alert">Errors: {task2.error}</span>}
        {task2.task?.status === GeoprocessingTaskStatus.Completed && (
          <span
            role="alert"
            data-results={(task2.task?.data as { foo: string }).foo}
          >
            Task Complete!
          </span>
        )}
      </div>
    </>
  );
};

test("useFunction called multiple times with the same arguments will only fetch once", async () => {
  jest.useFakeTimers();
  const id = uuid();
  fetchMock.getOnce(
    "*",
    JSON.stringify({
      startedAt: new Date().toISOString(),
      duration: 10,
      geometryUri: `https://example.com/calcFoo/${id}/geometry`,
      location: `https://example.com/calcFoo/${id}`,
      id,
      logUriTemplate: `https://example.com/calcFoo/${id}/logs`,
      service: "calcFoo",
      wss: `wss://example.com/calcFoo/${id}`,
      status: "completed",
      data: {
        foo: "plenty"
      }
    } as GeoprocessingTask),
    { overwriteRoutes: true }
  );
  const { getAllByRole, getByText, getAllByText } = render(
    <TestContainer>
      <MultiCardTestReport />
    </TestContainer>
  );
  for (const el of getAllByRole("alert")) {
    expect(el).toHaveTextContent("loading...");
  }
  await domAct(async () => {
    jest.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(getAllByText(/Task Complete/i).length).toBe(2);
  const completeEls = getAllByText(/Task Complete/i);
  for (const el of completeEls) {
    expect(el).toHaveAttribute("data-results", "plenty");
  }
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
});

test("useFunction uses a local cache for repeat requests", async () => {
  jest.useFakeTimers();
  const id = uuid();
  const sketchProperties = makeSketchProperties(id);
  fetchMock.getOnce(
    "*",
    JSON.stringify({
      startedAt: new Date().toISOString(),
      duration: 10,
      geometryUri: `https://example.com/calcFoo/${id}/geometry`,
      location: `https://example.com/calcFoo/${id}`,
      id,
      logUriTemplate: `https://example.com/calcFoo/${id}/logs`,
      service: "calcFoo",
      wss: `wss://example.com/calcFoo/${id}`,
      status: "completed",
      data: {
        foo: "plenty"
      }
    } as GeoprocessingTask),
    { overwriteRoutes: true }
  );
  const { getByRole, getByText, getAllByText } = render(
    // @ts-ignore
    <TestContainer sketchProperties={sketchProperties}>
      <TestReport />
    </TestContainer>
  );
  expect(getByRole("alert")).toHaveTextContent("loading...");
  await domAct(async () => {
    jest.runAllTimers();
  });
  expect(getAllByText(/Task Complete/i).length).toBe(1);
  expect(getByText(/Task Complete/)).toHaveAttribute("data-results", "plenty");
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);

  const queries = render(
    // @ts-ignore
    <TestContainer sketchProperties={sketchProperties}>
      <TestReport />
    </TestContainer>
  );
  await domAct(async () => {
    jest.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
});

test("Returns error if ReportContext does not include required values", () => {
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ({ children }) => (
      <ContextWrapper
        children={children}
        value={({ projectUrl: null } as unknown) as ReportContextValue}
      />
    )
  });
  expect(result.current.error).toContain("Client Error");
});

test("Exposes error to client if project metadata can't be fetched", async () => {
  jest.useFakeTimers();
  fetchMock.get("https://example.com/project", 500, { overwriteRoutes: true });
  useFunction.reset();
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ({ children }) => (
      <ContextWrapper
        children={children}
        value={
          ({
            projectUrl: "https://example.com/project",
            geometryUri: "https://example.com/geometry/123",
            sketchProperties: {}
          } as unknown) as ReportContextValue
        }
      />
    )
  });
  await act(async () => {
    jest.runAllTimers();
  });
  expect(result.current.error).toContain("metadata");
});
