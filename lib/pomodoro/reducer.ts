import { DEFAULT_SETTINGS } from './constants';
import type {
  PomodoroAction,
  PomodoroMode,
  PomodoroSettings,
  PomodoroTimerState,
} from './types';

export function getModeDurationSeconds(
  mode: PomodoroMode,
  settings: PomodoroSettings,
): number {
  switch (mode) {
    case 'work':
      return settings.workMinutes * 60;
    case 'shortBreak':
      return settings.shortBreakMinutes * 60;
    case 'longBreak':
      return settings.longBreakMinutes * 60;
  }
}

export function createInitialState(
  settings: PomodoroSettings = DEFAULT_SETTINGS,
): PomodoroTimerState {
  return {
    mode: 'work',
    status: 'idle',
    remainingSeconds: getModeDurationSeconds('work', settings),
    workCount: 0,
    settings,
  };
}

function applySessionComplete(state: PomodoroTimerState): PomodoroTimerState {
  const { mode, settings, workCount } = state;

  if (mode === 'work') {
    const nextWorkCount = workCount + 1;
    const nextMode: PomodoroMode =
      nextWorkCount % settings.longBreakInterval === 0
        ? 'longBreak'
        : 'shortBreak';

    return {
      ...state,
      mode: nextMode,
      status: 'idle',
      workCount: nextWorkCount,
      remainingSeconds: getModeDurationSeconds(nextMode, settings),
    };
  }

  const resetWorkCount = mode === 'longBreak' ? 0 : workCount;

  return {
    ...state,
    mode: 'work',
    status: 'idle',
    workCount: resetWorkCount,
    remainingSeconds: getModeDurationSeconds('work', settings),
  };
}

export function pomodoroReducer(
  state: PomodoroTimerState,
  action: PomodoroAction,
): PomodoroTimerState {
  switch (action.type) {
    case 'START':
      if (state.status === 'running') {
        return state;
      }
      return { ...state, status: 'running' };

    case 'PAUSE':
      if (state.status !== 'running') {
        return state;
      }
      return { ...state, status: 'paused' };

    case 'RESET':
      return {
        ...state,
        status: 'idle',
        remainingSeconds: getModeDurationSeconds(state.mode, state.settings),
      };

    case 'TICK':
      if (state.status !== 'running') {
        return state;
      }
      if (state.remainingSeconds <= 1) {
        return applySessionComplete(state);
      }
      return { ...state, remainingSeconds: state.remainingSeconds - 1 };

    case 'COMPLETE':
      return applySessionComplete(state);

    case 'SET_MODE':
      if (state.status !== 'idle') {
        return state;
      }
      return {
        ...state,
        mode: action.mode,
        remainingSeconds: getModeDurationSeconds(action.mode, state.settings),
      };

    case 'LOAD_SETTINGS': {
      const settings = action.settings;
      return {
        ...state,
        settings,
        remainingSeconds:
          state.status === 'idle'
            ? getModeDurationSeconds(state.mode, settings)
            : state.remainingSeconds,
      };
    }

    default:
      return state;
  }
}
