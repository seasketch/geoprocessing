import React, { useState } from "react";
import { render, act as domAct } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useFunction } from "./useFunction";
import ReportContext from "../ReportContext";
import { v4 as uuid } from "uuid";
import { GeoprocessingTaskStatus } from "../tasks";
import { renderHook, act } from "@testing-library/react-hooks";
const makeSketchProperties = (id) => {
    id = id || uuid();
    return {
        id,
        name: "sketch name",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123"
    };
};
const ContextWrapper = props => {
    const sketchProperties = makeSketchProperties();
    return (React.createElement(ReportContext.Provider, { value: {
            geometryUri: `https://localhost/${sketchProperties.id}`,
            sketchProperties,
            geoprocessingProject: {
                geoprocessingServices: [
                    {
                        title: "calcFoo",
                        endpoint: "https://example.com/calcFoo"
                    }
                ]
            },
            ...(props.value || {})
        } }, props.children));
};
beforeEach(() => {
    global.fetch.resetMocks();
});
// can't seem to catch these throws because of Promise maze...
// test("useFunction won't accept unrecognizable responses", async () => {
//   jest.useFakeTimers();
//   global.fetch.mockResponseOnce(JSON.stringify({ "huh?": "12345" }));
//   const { result } = renderHook(() => useFunction("calcFoo"), {
//     wrapper: ContextWrapper
//   });
//   expect(result.current.loading).toBe(true);
//   try {
//     await act(async () => {
//       jest.runAllTimers();
//       await sleep(10);
//     });
//   } catch (e) {}
//   console.log("after act");
//   expect(global.fetch.mock.calls.length).toBe(1);
//   expect(result.current.loading).toBe(false);
//   // expect(result.current.error).toContain("response");
// });
// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
test("useFunction unsets loading prop and sets task upon completion of job (executionMode=sync)", async () => {
    jest.useFakeTimers();
    const id = uuid();
    global.fetch.mockResponseOnce(JSON.stringify({
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
    }));
    const { result } = renderHook(() => useFunction("calcFoo"), {
        wrapper: ContextWrapper
    });
    expect(result.current.loading).toBe(true);
    await act(async () => {
        jest.runAllTimers();
    });
    expect(global.fetch.mock.calls.length).toBe(1);
    expect(result.current.loading).toBe(false);
    const task = result.current.task;
    expect(task.data.foo).toBe("plenty");
    expect(task.status).toBe(GeoprocessingTaskStatus.Completed);
    expect(task.error).toBeUndefined();
});
test("useFunction handles errors thrown within geoprocessing function", async () => {
    jest.useFakeTimers();
    const id = uuid();
    global.fetch.mockResponseOnce(JSON.stringify({
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
    }));
    const { result } = renderHook(() => useFunction("calcFoo"), {
        wrapper: ContextWrapper
    });
    expect(result.current.loading).toBe(true);
    await act(async () => {
        jest.runAllTimers();
    });
    expect(global.fetch.mock.calls.length).toBe(1);
    expect(result.current.loading).toBe(false);
    const task = result.current.task;
    expect(task.error).toBe("Task error");
    expect(result.current.error).toBe("Task error");
});
test("throws error if ReportContext is not set", async () => {
    const { result } = renderHook(() => useFunction("calcFoo"));
    expect(result.error.message).toContain("ReportContext");
});
test("Returns error if ReportContext does not include required values", async () => {
    const { result } = renderHook(() => useFunction("calcFoo"), {
        wrapper: ({ children }) => (React.createElement(ContextWrapper, { children: children, value: { geoprocessingProject: null } }))
    });
    expect(result.current.error).toContain("Client Error");
});
const TestReport = () => {
    var _a;
    const { loading, error, task } = useFunction("calcFoo");
    return (React.createElement("div", null,
        loading && (React.createElement("span", { role: "alert", "aria-busy": "true" }, "loading...")),
        error && React.createElement("span", { role: "alert" },
            "Errors: ",
            error),
        ((_a = task) === null || _a === void 0 ? void 0 : _a.status) === GeoprocessingTaskStatus.Completed && (React.createElement("span", { role: "alert", "data-results": task.data.foo }, "Task Complete!"))));
};
const TestContainer = props => {
    const [sketchId, setSketchId] = useState(1);
    return (React.createElement(ReportContext.Provider, { value: {
            sketchProperties: 
            // @ts-ignore
            props.sketchProperties || makeSketchProperties(sketchId.toString()),
            geometryUri: `https://example.com/geometry/${sketchId}`,
            geoprocessingProject: {
                geoprocessingServices: [
                    {
                        title: "calcFoo",
                        endpoint: "https://example.com/calcFoo"
                    }
                ]
            }
        } },
        React.createElement("button", { onClick: () => setSketchId(sketchId + 1) }, "change sketch id"),
        props.children));
};
test("changing ReportContext.geometryUri fetches new results", async () => {
    jest.useFakeTimers();
    const id = uuid();
    global.fetch.mockResponseOnce(JSON.stringify({
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
    }));
    const { getByRole, getByText, getAllByText } = render(React.createElement(TestContainer, null,
        React.createElement(TestReport, null)));
    expect(getByRole("alert")).toHaveTextContent("loading...");
    await domAct(async () => {
        jest.runAllTimers();
    });
    expect(global.fetch.mock.calls.length).toBe(1);
    expect(getAllByText(/Task Complete/i).length).toBe(1);
    expect(getByText(/Task Complete/)).toHaveAttribute("data-results", "plenty");
    expect(global.fetch.mock.calls.length).toBe(1);
    // now setup another mock because clicking the button will change the geometryUri
    const id2 = uuid();
    global.fetch.mockResponseOnce(JSON.stringify({
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
    }));
    await domAct(async () => {
        getByRole("button").click();
    });
    expect(getAllByText(/Task Complete/i).length).toBe(1);
    expect(getByText(/Task Complete/)).toHaveAttribute("data-results", "lots!");
    expect(global.fetch.mock.calls.length).toBe(2);
});
const MultiCardTestReport = () => {
    var _a, _b, _c, _d;
    const { loading, error, task } = useFunction("calcFoo");
    const task2 = useFunction("calcFoo");
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            loading && (React.createElement("span", { role: "alert", "aria-busy": "true" }, "loading...")),
            error && React.createElement("span", { role: "alert" },
                "Errors: ",
                error),
            ((_a = task) === null || _a === void 0 ? void 0 : _a.status) === GeoprocessingTaskStatus.Completed && (React.createElement("span", { role: "alert", "data-results": ((_b = task) === null || _b === void 0 ? void 0 : _b.data).foo }, "Task Complete!"))),
        React.createElement("div", { id: "task2" },
            task2.loading && (React.createElement("span", { role: "alert", "aria-busy": "true" }, "loading...")),
            task2.error && React.createElement("span", { role: "alert" },
                "Errors: ",
                task2.error),
            ((_c = task2.task) === null || _c === void 0 ? void 0 : _c.status) === GeoprocessingTaskStatus.Completed && (React.createElement("span", { role: "alert", "data-results": ((_d = task2.task) === null || _d === void 0 ? void 0 : _d.data).foo }, "Task Complete!")))));
};
test("useFunction called multiple times with the same arguments will only fetch once", async () => {
    jest.useFakeTimers();
    const id = uuid();
    global.fetch.mockResponseOnce(JSON.stringify({
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
    }));
    const { getAllByRole, getByText, getAllByText } = render(React.createElement(TestContainer, null,
        React.createElement(MultiCardTestReport, null)));
    for (const el of getAllByRole("alert")) {
        expect(el).toHaveTextContent("loading...");
    }
    await domAct(async () => {
        jest.runAllTimers();
    });
    expect(global.fetch.mock.calls.length).toBe(1);
    expect(getAllByText(/Task Complete/i).length).toBe(2);
    const completeEls = getAllByText(/Task Complete/i);
    for (const el of completeEls) {
        expect(el).toHaveAttribute("data-results", "plenty");
    }
    expect(global.fetch.mock.calls.length).toBe(1);
});
test("useFunction uses a local cache for repeat requests", async () => {
    jest.useFakeTimers();
    const id = uuid();
    const sketchProperties = makeSketchProperties(id);
    global.fetch.mockResponseOnce(JSON.stringify({
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
    }));
    const { getByRole, getByText, getAllByText } = render(
    // @ts-ignore
    React.createElement(TestContainer, { sketchProperties: sketchProperties },
        React.createElement(TestReport, null)));
    expect(getByRole("alert")).toHaveTextContent("loading...");
    await domAct(async () => {
        jest.runAllTimers();
    });
    expect(getAllByText(/Task Complete/i).length).toBe(1);
    expect(getByText(/Task Complete/)).toHaveAttribute("data-results", "plenty");
    expect(global.fetch.mock.calls.length).toBe(1);
    const queries = render(
    // @ts-ignore
    React.createElement(TestContainer, { sketchProperties: sketchProperties },
        React.createElement(TestReport, null)));
    expect(global.fetch.mock.calls.length).toBe(1);
});
//# sourceMappingURL=useFunction.test.js.map