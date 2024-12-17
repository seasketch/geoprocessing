import { describe, test, expect, vi } from "vitest";
import { callWithRetry } from "./callWithRetry.js";
describe("callWithRetry", () => {
  test("should succeed on the first try", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await callWithRetry(fn, []);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should retry on first fail and succeed the second try", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fetch failed"))
      .mockResolvedValueOnce("success");
    const result = await callWithRetry(fn, []);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("errorSubstring should rethrow OtherError and retry SocketError", async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error("OtherError"));
    await expect(
      callWithRetry(fn, [], { ifErrorMsgContains: "fetch failed" }),
    ).rejects.toThrowError();
    expect(fn).toHaveBeenCalledTimes(1);

    const socketErrorFn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fetch failed"))
      .mockResolvedValueOnce("success");
    const result = await callWithRetry(socketErrorFn, [], {
      ifErrorMsgContains: "fetch failed",
    });
    expect(result).toBe("success");
    expect(socketErrorFn).toHaveBeenCalledTimes(2);
  });

  test("should fail all retry attempts", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fetch failed"));
    await expect(callWithRetry(fn, [])).rejects.toThrow("fetch failed");
    expect(fn).toHaveBeenCalledTimes(5);
  }, 10_000);
});
