import type { PomodoroStats } from '@/lib/pomodoro/types';

interface StatsBarProps {
  stats: PomodoroStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
      今日 <span className="font-semibold text-zinc-900 dark:text-zinc-100">{stats.todayCount}</span> 顆
      <span className="mx-2 text-zinc-300 dark:text-zinc-600">·</span>
      累計 <span className="font-semibold text-zinc-900 dark:text-zinc-100">{stats.totalCount}</span> 顆
    </p>
  );
}
