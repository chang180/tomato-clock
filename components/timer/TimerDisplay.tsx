import { formatSeconds } from '@/lib/pomodoro/format';
import type { PomodoroMode } from '@/lib/pomodoro/types';

interface TimerDisplayProps {
  remainingSeconds: number;
  progress: number;
  mode: PomodoroMode;
}

const MODE_RING_COLORS: Record<PomodoroMode, string> = {
  work: '#e85d4c',
  shortBreak: '#4caf7a',
  longBreak: '#3d9b6e',
};

export function TimerDisplay({
  remainingSeconds,
  progress,
  mode,
}: TimerDisplayProps) {
  const accent = MODE_RING_COLORS[mode];
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const degrees = clampedProgress * 360;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex h-56 w-56 items-center justify-center rounded-full sm:h-64 sm:w-64"
        style={{
          background: `conic-gradient(${accent} ${degrees}deg, color-mix(in srgb, ${accent} 18%, transparent) ${degrees}deg)`,
        }}
        aria-hidden
      >
        <div className="flex h-[88%] w-[88%] flex-col items-center justify-center rounded-full bg-white shadow-inner dark:bg-zinc-900">
          <span
            className="font-mono text-5xl font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50 sm:text-6xl"
            aria-live="polite"
            aria-atomic
          >
            {formatSeconds(remainingSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
