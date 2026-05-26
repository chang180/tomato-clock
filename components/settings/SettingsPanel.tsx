'use client';

import type { PomodoroSettings } from '@/lib/pomodoro/types';

interface SettingsPanelProps {
  settings: PomodoroSettings;
  onChange: (settings: PomodoroSettings) => void;
  onSave: () => void;
}

const FIELDS: {
  key: keyof PomodoroSettings;
  label: string;
  min: number;
  max: number;
}[] = [
  { key: 'workMinutes', label: '專注（分鐘）', min: 1, max: 120 },
  { key: 'shortBreakMinutes', label: '短休（分鐘）', min: 1, max: 60 },
  { key: 'longBreakMinutes', label: '長休（分鐘）', min: 1, max: 60 },
  { key: 'longBreakInterval', label: '幾輪後長休', min: 1, max: 12 },
];

export function SettingsPanel({
  settings,
  onChange,
  onSave,
}: SettingsPanelProps) {
  return (
    <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        計時設定
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map(({ key, label, min, max }) => (
          <label key={key} className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
            <input
              type="number"
              min={min}
              max={max}
              value={settings[key]}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (Number.isNaN(value)) {
                  return;
                }
                onChange({ ...settings, [key]: value });
              }}
              className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={onSave}
        className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
      >
        儲存設定
      </button>
    </section>
  );
}
