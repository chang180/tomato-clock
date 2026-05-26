import { DEFAULT_SETTINGS } from '@/lib/pomodoro/constants';
import type { PomodoroSettings } from '@/lib/pomodoro/types';
import { STORAGE_KEYS } from './keys';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isValidSettings(value: unknown): value is PomodoroSettings {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.workMinutes === 'number' &&
    typeof v.shortBreakMinutes === 'number' &&
    typeof v.longBreakMinutes === 'number' &&
    typeof v.longBreakInterval === 'number' &&
    v.workMinutes > 0 &&
    v.shortBreakMinutes > 0 &&
    v.longBreakMinutes > 0 &&
    v.longBreakInterval > 0
  );
}

export function loadSettings(): PomodoroSettings {
  if (!isBrowser()) {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isValidSettings(parsed)) {
      return DEFAULT_SETTINGS;
    }
    return parsed;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PomodoroSettings): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify(settings),
    );
  } catch {
    // ignore quota / private mode errors
  }
}
