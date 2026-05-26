import type { TimerStatus } from '@/lib/pomodoro/types';

interface ControlButtonsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function ControlButtons({
  status,
  onStart,
  onPause,
  onReset,
}: ControlButtonsProps) {
  const isRunning = status === 'running';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={isRunning ? onPause : onStart}
        className="min-w-[7rem] rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isRunning ? '暫停' : status === 'paused' ? '繼續' : '開始'}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="min-w-[7rem] rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        重置
      </button>
    </div>
  );
}
