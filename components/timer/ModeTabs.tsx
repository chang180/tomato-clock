import { MODE_LABELS } from '@/lib/pomodoro/constants';
import type { PomodoroMode, TimerStatus } from '@/lib/pomodoro/types';

const MODES: PomodoroMode[] = ['work', 'shortBreak', 'longBreak'];

interface ModeTabsProps {
  mode: PomodoroMode;
  status: TimerStatus;
  onSelectMode: (mode: PomodoroMode) => void;
}

export function ModeTabs({ mode, status, onSelectMode }: ModeTabsProps) {
  const canSwitch = status === 'idle';

  return (
    <div
      className="flex w-full max-w-md gap-2 rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-800"
      role="tablist"
      aria-label="番茄鐘模式"
    >
      {MODES.map((item) => {
        const selected = item === mode;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={!canSwitch}
            onClick={() => onSelectMode(item)}
            className={[
              'flex-1 rounded-xl px-3 py-2 text-sm font-medium transition',
              selected
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              !canSwitch ? 'cursor-not-allowed opacity-50' : '',
            ].join(' ')}
          >
            {MODE_LABELS[item]}
          </button>
        );
      })}
    </div>
  );
}
