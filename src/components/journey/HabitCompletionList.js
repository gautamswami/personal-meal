'use client';

import { HABIT_META, HABIT_KEYS } from '@/lib/journey';

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

export default function HabitCompletionList({ habitStats = {} }) {
  return (
    <div className="journey-card p-4">
      <h2 className="text-sm font-semibold text-white mb-3">Habit completion</h2>
      <ul className="space-y-3">
        {HABIT_KEYS.map((key) => {
          const meta = HABIT_META[key];
          const stat = habitStats[key] || { done: 0, total: 1, percent: 0 };
          return (
            <li key={key} className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {ICONS[key]}
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm text-white">{meta.label}</span>
                  <span className="text-xs text-[#8e8e93]">
                    {stat.done}/{stat.total}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-[#2c2c2e] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${stat.percent}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium w-10 text-right" style={{ color: meta.color }}>
                {stat.percent}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
