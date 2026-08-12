'use client';

import { HABIT_KEYS, HABIT_META } from '@/lib/journey';

const ICONS = {
  meditate: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
    />
  ),
  walk: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 5a2 2 0 11-4 0 2 2 0 014 0zM8 21l2-6 2 2 3-5 2 2M5 11l3 1 2-2"
    />
  ),
  read: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  ),
  work: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
  learn: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  ),
  travel: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 12L3 21l18-9L3 3l3 9zm0 0h7"
    />
  ),
};

/** Compact per-habit current + best streaks */
export default function HabitStreaks({ habitStreaks = {}, average = 0 }) {
  return (
    <div className="space-y-2.5">
      <div className="journey-card px-3.5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-full bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-[#8e8e93] uppercase tracking-wide">Daily average</p>
            <p className="text-sm text-[#aeaeb2] truncate">Overall completion</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-white leading-none tabular-nums">
          {average}
          <span className="text-sm font-medium text-[#8e8e93] ml-0.5">%</span>
        </p>
      </div>

      <div className="journey-card p-3">
        <div className="flex items-center gap-1.5 mb-2.5 px-0.5">
          <svg className="w-3.5 h-3.5 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
            />
          </svg>
          <h2 className="text-sm font-semibold text-white">Habit streaks</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {HABIT_KEYS.map((key) => {
            const meta = HABIT_META[key];
            const streak = habitStreaks[key] || { current: 0, best: 0 };
            return (
              <div
                key={key}
                className="rounded-xl bg-[#2c2c2e]/70 border border-[#2c2c2e] px-2 py-2.5 flex flex-col items-center text-center gap-1"
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {ICONS[key]}
                  </svg>
                </span>
                <p className="text-[11px] text-[#aeaeb2] leading-tight truncate w-full">
                  {meta.label}
                </p>
                <p className="text-lg font-bold text-white leading-none tabular-nums">
                  {streak.current}
                  <span className="text-[10px] font-medium text-[#8e8e93] ml-0.5">d</span>
                </p>
                <p className="text-[10px] text-[#636366] leading-none">
                  best {streak.best}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
