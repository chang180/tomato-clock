import type { PomodoroStats } from '@/lib/pomodoro/types';
import { STORAGE_KEYS } from './keys';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function createEmptyStats(today = getTodayDateString()): PomodoroStats {
  return { today, todayCount: 0, totalCount: 0 };
}

function isValidStats(value: unknown): value is PomodoroStats {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.today === 'string' &&
    typeof v.todayCount === 'number' &&
    typeof v.totalCount === 'number' &&
    v.todayCount >= 0 &&
    v.totalCount >= 0
  );
}

export function normalizeStatsForToday(stats: PomodoroStats): PomodoroStats {
  const today = getTodayDateString();
  if (stats.today === today) {
    return stats;
  }
  return { today, todayCount: 0, totalCount: stats.totalCount };
}

export function loadStats(): PomodoroStats {
  if (!isBrowser()) {
    return createEmptyStats();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.stats);
    if (!raw) {
      return createEmptyStats();
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isValidStats(parsed)) {
      return createEmptyStats();
    }
    return normalizeStatsForToday(parsed);
  } catch {
    return createEmptyStats();
  }
}

export function saveStats(stats: PomodoroStats): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function incrementWorkSession(): PomodoroStats {
  const current = normalizeStatsForToday(loadStats());
  const next: PomodoroStats = {
    today: current.today,
    todayCount: current.todayCount + 1,
    totalCount: current.totalCount + 1,
  };
  saveStats(next);
  return next;
}
