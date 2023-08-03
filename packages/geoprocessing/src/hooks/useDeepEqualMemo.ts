import deepEqual from "fast-deep-equal";
import { useRef } from "react";

/**
 * Memoization that works with deep equal for objects we don't know the exact structure of
 */
export function useDeepEqualMemo<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);

  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}
