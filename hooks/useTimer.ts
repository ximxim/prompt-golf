"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now() - elapsedSeconds * 1000;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setElapsedSeconds(elapsed);
      }
    }, 1000);
  }, [isRunning, elapsedSeconds]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedSeconds(0);
    startTimeRef.current = null;
  }, [stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    elapsedSeconds,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
