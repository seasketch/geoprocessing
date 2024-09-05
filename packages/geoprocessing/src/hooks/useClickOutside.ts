import React, { useEffect, useRef } from "react";

interface ClickOutsideProps {
  ref: React.RefObject<HTMLDivElement>;
}

/**
 * Creates and returns reference to a div element, which the caller can
 * populate.  `callback` is invoked if a click occurs outside of the reference
 * Useful for dropdown implementation
 */
export default function useClickOutside(
  callback: (...args: any[]) => void,
): ClickOutsideProps {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as HTMLDivElement)
      ) {
        callback.apply(null, [false]);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [callback]);

  return { ref };
}
