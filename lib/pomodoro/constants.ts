import type { PomodoroMode, PomodoroSettings } from './types';

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

export const MODE_LABELS: Record<PomodoroMode, string> = {
  work: '專注',
  shortBreak: '短休',
  longBreak: '長休',
};
