'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { DEFAULT_SETTINGS } from '@/lib/pomodoro/constants';
import {
  createInitialState,
  getModeDurationSeconds,
  pomodoroReducer,
} from '@/lib/pomodoro/reducer';
import type { PomodoroMode, PomodoroSettings } from '@/lib/pomodoro/types';

export interface UsePomodoroTimerOptions {
  initialSettings?: PomodoroSettings;
  onWorkComplete?: () => void;
}

export function usePomodoroTimer(options: UsePomodoroTimerOptions = {}) {
  const { initialSettings = DEFAULT_SETTINGS, onWorkComplete } = options;
  const onWorkCompleteRef = useRef(onWorkComplete);
  const prevWorkCountRef = useRef(0);

  onWorkCompleteRef.current = onWorkComplete;

  const [state, dispatch] = useReducer(
    pomodoroReducer,
    initialSettings,
    createInitialState,
  );

  useEffect(() => {
    if (state.workCount > prevWorkCountRef.current) {
      onWorkCompleteRef.current?.();
      prevWorkCountRef.current = state.workCount;
    }
  }, [state.workCount]);

  useEffect(() => {
    if (state.status !== 'running') {
      return;
    }

    const id = window.setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => window.clearInterval(id);
  }, [state.status]);

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setMode = useCallback(
    (mode: PomodoroMode) => dispatch({ type: 'SET_MODE', mode }),
    [],
  );
  const loadSettings = useCallback(
    (settings: PomodoroSettings) =>
      dispatch({ type: 'LOAD_SETTINGS', settings }),
    [],
  );

  const totalSeconds = getModeDurationSeconds(state.mode, state.settings);
  const progress =
    totalSeconds > 0
      ? (totalSeconds - state.remainingSeconds) / totalSeconds
      : 0;

  return {
    ...state,
    progress,
    totalSeconds,
    start,
    pause,
    reset,
    setMode,
    loadSettings,
  };
}
