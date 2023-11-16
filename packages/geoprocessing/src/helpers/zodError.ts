import { generateErrorMessage, ErrorMessageOptions } from "zod-error";
import { z } from "zod";

export function genZodErrorMessage(issues: z.ZodIssue[]): string {
  // Standard zod error message options
  const options: ErrorMessageOptions = {
    delimiter: {
      error: " 🔥 ",
    },
    path: {
      enabled: true,
      type: "objectNotation",
      label: "Zod Path: ",
    },
    code: {
      enabled: true,
    },
    message: {
      enabled: true,
    },
    transform: ({ errorMessage, index }) =>
      `Error #${index + 1}: ${errorMessage}`,
  };
  return generateErrorMessage(issues, options);
}
