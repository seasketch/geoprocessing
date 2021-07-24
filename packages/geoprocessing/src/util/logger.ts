import { inspect } from "util";

if (inspect?.defaultOptions) {
  inspect.defaultOptions.depth = null;
}

/**
 * Implements a simple logger that's a narrow pass-thru to the console module
 * with some ability to redact information.
 */

const logger: Pick<Console, "info" | "warn" | "error" | "debug"> = console;
type LogLevel = keyof typeof logger;

const redact = (arg: string | Record<string, unknown> | Error | undefined) => {
  if (arg === undefined) return {};
  const res = JSON.stringify(
    arg instanceof Error ? { error: arg.toString() } : arg,
    (k, v) => (["lat", "lng", "coordinates"].includes(k) ? "[REDACTED]" : v)
  );

  return JSON.parse(res);
};

const log =
  (level: LogLevel) =>
  (
    message: string,
    data?: Record<string, unknown> | Error
  ): { log_message?: string; log_data?: any } => {
    const { log_message, log_data } = {
      log_message: redact(message),
      log_data: redact(data),
    };

    logger[level](
      JSON.stringify({
        log_level: level.toUpperCase(),
        log_message,
        log_data,
      })
    );

    return { log_message, log_data };
  };

const time = (label?: string | undefined) => {
  console.time(label);
};

const timeEnd = (label?: string | undefined) => {
  console.timeEnd(label);
};

export default {
  log: (level: LogLevel, ...args: Parameters<ReturnType<typeof log>>) =>
    log(level)(...args),
  debug: log("debug"),
  info: log("info"),
  warn: log("warn"),
  error: log("error"),
  time,
  timeEnd,
};
