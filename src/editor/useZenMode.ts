import { useState, useCallback } from "react";

export function useZenMode() {
  const [isZenMode, setIsZenMode] = useState(false);

  const toggleZenMode = useCallback(() => {
    setIsZenMode((prev) => !prev);
  }, []);

  const exitZenMode = useCallback(() => {
    setIsZenMode(false);
  }, []);

  return { isZenMode, toggleZenMode, exitZenMode };
}
