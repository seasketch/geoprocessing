import { describe, test, expect, vi, beforeEach } from "vitest";
import React, { useState } from "react";
import { render, act as domAct } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useFunction } from "./useFunction.js";
import { ReportContext, ReportContextValue } from "../context/index.js";
import { v4 as uuid } from "uuid";
import { SketchProperties } from "../types/index.js";
import { GeoprocessingTaskStatus, GeoprocessingTask } from "../aws/tasks.js";
import { renderHook, act } from "@testing-library/react";

// @ts-ignore
// switch to manual fetch mocking or vitest-fetch-mock
// import fetchMock from "fetch-mock-jest";

// import createFetchMock from "vitest-fetch-mock";

// const fetchMock = createFetchMock(vi);
const fetchMock: any = {};

const makeSketchProperties = (id?: string): SketchProperties => {
  id = id || uuid();
  return {
    id,
    name: "sketch name",
    updatedAt: new Date().toISOString(),
    sketchClassId: "abc123",
  } as SketchProperties;
};

const ContextWrapper: React.FunctionComponent<{
  children?: any;
  value?: ReportContextValue;
}> = (props) => {
  const sketchProperties = makeSketchProperties();
  return (
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/${sketchProperties.id}`,
        sketchProperties,
        projectUrl: "https://example.com/project",
        ...(props.value || {}),
        visibleLayers: [],
        language: "en",
      }}
    >
      {props.children}
    </ReportContext.Provider>
  );
};

// fetchMock.get("https://example.com/project", {
//   geoprocessingServices: [
//     {
//       title: "calcFoo",
//       endpoint: "https://example.com/calcFoo",
//     },
//   ],
// });

const consoleError = console.error;
beforeEach(() => {
  fetchMock.resetHistory();
});

test.skip("useFunction won't accept unrecognizable responses", async () => {
  vi.useFakeTimers();
  fetchMock.getOnce(
    "*",
    {},
    {
      overwriteRoutes: true,
    },
  );
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ContextWrapper,
  });
  expect(result.current.loading).toBe(true);
  await act(async () => {
    vi.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toContain("response");
});

test.skip("useFunction unsets loading prop and sets task upon completion of job (executionMode=sync)", async () => {
  vi.useFakeTimers();
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
      wss: "",
      status: "completed",
      data: {
        foo: "plenty",
      },
    } as GeoprocessingTask),
    { overwriteRoutes: true },
  );
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ContextWrapper,
  });

  expect(result.current.loading).toBe(true);
  await act(async () => {
    vi.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(result.current.loading).toBe(false);
  const task: GeoprocessingTask = result.current.task!;
  expect(task.data.foo).toBe("plenty");
  expect(task.status).toBe(GeoprocessingTaskStatus.Completed);
  expect(task.error).toBeUndefined();
});

test.skip("useFunction handles errors thrown within geoprocessing function", async () => {
  vi.useFakeTimers();
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
      wss: "",
      status: "failed",
      error: "Task error",
    } as GeoprocessingTask,
    { overwriteRoutes: true },
  );
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ContextWrapper,
  });
  expect(result.current.loading).toBe(true);
  await act(async () => {
    vi.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(result.current.loading).toBe(false);
  const task: GeoprocessingTask = result.current.task!;
  expect(task.error).toBe("Task error");
  expect(result.current.error).toBe("Task error");
});

test.skip("throws error if ReportContext is not set", async () => {
  const { result } = renderHook(() => useFunction("calcFoo"));
  expect(result && result.current.error).toBeTruthy();
  if (!result || !result.current.error) return;
  expect(result.current.error).toContain("ReportContext");
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

interface TestContainerProps {
  children: React.ReactNode;
}

const TestContainer: React.FC<TestContainerProps> = (props) => {
  const [sketchId, setSketchId] = useState(1);
  return (
    <ReportContext.Provider
      value={{
        sketchProperties:
          // @ts-ignore
          props.sketchProperties || makeSketchProperties(sketchId.toString()),
        geometryUri: `https://example.com/geometry/${sketchId}`,
        projectUrl: "https://example.com/project",
        visibleLayers: [],
        language: "en",
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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test.skip("changing ReportContext.geometryUri fetches new results", async () => {
  vi.useFakeTimers();
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
      wss: "",
      status: "completed",
      data: {
        foo: "plenty",
      },
    } as GeoprocessingTask),
    { overwriteRoutes: true },
  );
  const { getByRole, getByText, getAllByText } = render(
    <TestContainer>
      <TestReport />
    </TestContainer>,
  );
  expect(getByRole("alert")).toHaveTextContent("loading...");
  await domAct(async () => {
    vi.runAllTimers();
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
      wss: "",
      status: "completed",
      data: {
        foo: "lots!",
      },
    } as GeoprocessingTask),
    { overwriteRoutes: true },
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

test.skip("useFunction called multiple times with the same arguments will only fetch once", async () => {
  vi.useFakeTimers();
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
      wss: "",
      status: "completed",
      data: {
        foo: "plenty",
      },
    } as GeoprocessingTask),
    { overwriteRoutes: true },
  );
  const { getAllByRole, getByText, getAllByText } = render(
    <TestContainer>
      <MultiCardTestReport />
    </TestContainer>,
  );
  for (const el of getAllByRole("alert")) {
    expect(el).toHaveTextContent("loading...");
  }
  await domAct(async () => {
    vi.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
  expect(getAllByText(/Task Complete/i).length).toBe(2);
  const completeEls = getAllByText(/Task Complete/i);
  for (const el of completeEls) {
    expect(el).toHaveAttribute("data-results", "plenty");
  }
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
});

test.skip("useFunction uses a local cache for repeat requests", async () => {
  vi.useFakeTimers();
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
      wss: "",
      status: "completed",
      data: {
        foo: "plenty",
      },
    } as GeoprocessingTask),
    { overwriteRoutes: true },
  );
  const { getByRole, getByText, getAllByText } = render(
    // @ts-ignore
    <TestContainer sketchProperties={sketchProperties}>
      <TestReport />
    </TestContainer>,
  );
  expect(getByRole("alert")).toHaveTextContent("loading...");
  await domAct(async () => {
    vi.runAllTimers();
  });
  expect(getAllByText(/Task Complete/i).length).toBe(1);
  expect(getByText(/Task Complete/)).toHaveAttribute("data-results", "plenty");
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);

  const queries = render(
    // @ts-ignore
    <TestContainer sketchProperties={sketchProperties}>
      <TestReport />
    </TestContainer>,
  );
  await domAct(async () => {
    vi.runAllTimers();
  });
  expect(fetchMock.calls(/calcFoo/).length).toBe(1);
});

test.skip("Returns error if ReportContext does not include required values", () => {
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ({ children }) => (
      <ContextWrapper
        children={children}
        value={{ projectUrl: null } as unknown as ReportContextValue}
      />
    ),
  });
  expect(result.current.error).toContain("Client Error");
});

test.skip("Exposes error to client if project metadata can't be fetched", async () => {
  vi.useFakeTimers();
  fetchMock.get("https://example.com/project", 500, { overwriteRoutes: true });
  useFunction.reset();
  const { result } = renderHook(() => useFunction("calcFoo"), {
    wrapper: ({ children }) => (
      <ContextWrapper
        children={children}
        value={
          {
            projectUrl: "https://example.com/project",
            geometryUri: "https://example.com/geometry/123",
            sketchProperties: {},
          } as unknown as ReportContextValue
        }
      />
    ),
  });
  await act(async () => {
    vi.runAllTimers();
  });
  expect(result.current.error).toContain("metadata");
});
