'use client';

import { useCallback, useEffect, useState } from 'react';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { StatsBar } from '@/components/stats/StatsBar';
import { ControlButtons } from '@/components/timer/ControlButtons';
import { ModeTabs } from '@/components/timer/ModeTabs';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { MODE_LABELS } from '@/lib/pomodoro/constants';
import type { PomodoroSettings, PomodoroStats } from '@/lib/pomodoro/types';
import { loadSettings, saveSettings } from '@/lib/storage/settings';
import { incrementWorkSession, loadStats } from '@/lib/storage/stats';

export default function Home() {
  const [stats, setStats] = useState<PomodoroStats | null>(null);
  const [draftSettings, setDraftSettings] = useState<PomodoroSettings | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);

  const handleWorkComplete = useCallback(() => {
    setStats(incrementWorkSession());
  }, []);

  const timer = usePomodoroTimer({
    onWorkComplete: handleWorkComplete,
  });

  useEffect(() => {
    const settings = loadSettings();
    const loadedStats = loadStats();
    setStats(loadedStats);
    setDraftSettings(settings);
    timer.loadSettings(settings);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  const handleSaveSettings = () => {
    if (!draftSettings) {
      return;
    }
    saveSettings(draftSettings);
    timer.loadSettings(draftSettings);
  };

  if (!hydrated || !stats || !draftSettings) {
    return (
      <main className="flex min-h-full flex-1 items-center justify-center px-4 py-10">
        <p className="text-sm text-zinc-500">載入中…</p>
      </main>
    );
  }

  const modeAccent =
    timer.mode === 'work'
      ? 'text-[#c94a3a]'
      : timer.mode === 'shortBreak'
        ? 'text-emerald-600'
        : 'text-emerald-700';

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-6 px-4 py-8 sm:py-12">
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          番茄鐘
        </h1>
        <p className={`mt-1 text-sm font-medium ${modeAccent}`}>
          {MODE_LABELS[timer.mode]}
        </p>
      </header>

      <ModeTabs
        mode={timer.mode}
        status={timer.status}
        onSelectMode={timer.setMode}
      />

      <TimerDisplay
        remainingSeconds={timer.remainingSeconds}
        progress={timer.progress}
        mode={timer.mode}
      />

      <ControlButtons
        status={timer.status}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={timer.reset}
      />

      <StatsBar stats={stats} />

      <SettingsPanel
        settings={draftSettings}
        onChange={setDraftSettings}
        onSave={handleSaveSettings}
      />
    </main>
  );
}
