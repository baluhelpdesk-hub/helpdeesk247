import { useState, useEffect, useRef, useCallback } from "react";

export function useRestTimer(defaultSeconds = 90) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const start = useCallback((duration?: number) => {
    stop();
    setSeconds(duration ?? defaultSeconds);
    setIsRunning(true);
  }, [stop, defaultSeconds]);

  const reset = useCallback(() => {
    stop();
    setSeconds(defaultSeconds);
  }, [stop, defaultSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          stop();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, stop]);

  return { seconds, isRunning, start, stop, reset };
}
