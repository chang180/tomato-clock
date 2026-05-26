export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

export interface PomodoroStats {
  today: string;
  todayCount: number;
  totalCount: number;
}

export interface PomodoroTimerState {
  mode: PomodoroMode;
  status: TimerStatus;
  remainingSeconds: number;
  workCount: number;
  settings: PomodoroSettings;
}

export type PomodoroAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'COMPLETE' }
  | { type: 'SET_MODE'; mode: PomodoroMode }
  | { type: 'LOAD_SETTINGS'; settings: PomodoroSettings };
